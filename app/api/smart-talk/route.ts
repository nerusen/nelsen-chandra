import { createClient } from "@/common/utils/server";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { message: "Email parameter is required" },
      { status: 400 },
    );
  }

  try {
    const { data } = await supabase
      .from("smart_talk_messages")
      .select()
      .eq("user_email", email)
      .order("created_at", { ascending: true });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  const supabase = createClient();

  try {
    const body = await req.json();

    // Check if this is an AI response request
    if (body.userMessage && body.email) {
      // Get AI response from OpenRouter
      const aiResponse = await getAIResponse(body.userMessage);

      const aiMessageData = {
        id: crypto.randomUUID(),
        name: "AI Assistant",
        email: "ai@smarttalk.com",
        image: null,
        message: aiResponse,
        is_reply: false,
        reply_to: null,
        is_show: true,
        created_at: new Date().toISOString(),
        is_ai: true,
        user_email: body.email,
      };

      await supabase.from("smart_talk_messages").insert([aiMessageData]);
      return NextResponse.json("AI response saved successfully", { status: 200 });
    }

    // Regular message insertion
    const messageData = {
      ...body,
      user_email: body.email, // Add user_email for filtering
    };

    await supabase.from("smart_talk_messages").insert([messageData]);
    return NextResponse.json("Message saved successfully", { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};

async function getAIResponse(userMessage: string): Promise<string> {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY) {
    return "I'm sorry, but I'm currently unable to respond. Please try again later.";
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku:beta",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant in a chat application called Smart Talk. Be friendly, informative, and engaging. Keep responses concise but helpful.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response right now.";
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    return "I'm sorry, but I'm currently unable to respond. Please try again later.";
  }
}
