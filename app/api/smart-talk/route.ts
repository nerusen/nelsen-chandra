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

export const DELETE = async (req: Request) => {
  const supabase = createClient();
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email parameter is required" },
        { status: 400 },
      );
    }

    await supabase
      .from("smart_talk_messages")
      .delete()
      .eq("user_email", email);

    return NextResponse.json("Chat cleared successfully", { status: 200 });
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
    console.log("POST request body:", body);

    // Check if this is an AI response request
    if (body.userMessage && body.email) {
      console.log("Processing AI response request for user:", body.email);
      // Get AI response from OpenRouter
      const aiResponse = await getAIResponse(body.userMessage);
      console.log("AI response generated:", aiResponse);

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

      console.log("Inserting AI message:", aiMessageData);
      const { data, error } = await supabase.from("smart_talk_messages").insert([aiMessageData]);
      if (error) {
        console.error("Error inserting AI message:", error);
        throw error;
      }
      console.log("AI message inserted successfully:", data);
      return NextResponse.json("AI response saved successfully", { status: 200 });
    }

    // Regular message insertion
    const messageData = {
      ...body,
      user_email: body.email, // Add user_email for filtering
    };

    console.log("Inserting regular message:", messageData);
    const { data, error } = await supabase.from("smart_talk_messages").insert([messageData]);
    if (error) {
      console.error("Error inserting regular message:", error);
      throw error;
    }
    console.log("Regular message inserted successfully:", data);
    return NextResponse.json("Message saved successfully", { status: 200 });
  } catch (error) {
    console.error("Error in POST:", error);
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
    // Get current date and time information
    const now = new Date();
    const currentDateTime = {
      iso: now.toISOString(),
      local: now.toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'long'
      }),
      day: now.toLocaleDateString('id-ID', { weekday: 'long' }),
      date: now.toLocaleDateString('id-ID'),
      time: now.toLocaleTimeString('id-ID'),
      timezone: 'WIB (UTC+7)'
    };

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
            content: `You are a helpful AI assistant in a chat application called Smart Talk. Be friendly, informative, and engaging. Keep responses concise but helpful.

**CURRENT DATE AND TIME INFORMATION (UPDATED IN REAL-TIME):**
- Current DateTime (ISO): ${currentDateTime.iso}
- Current DateTime (Local): ${currentDateTime.local}
- Current Day: ${currentDateTime.day}
- Current Date: ${currentDateTime.date}
- Current Time: ${currentDateTime.time}
- Timezone: ${currentDateTime.timezone}

**IMPORTANT INSTRUCTIONS:**
- When asked about dates, calculations, or time-related questions, ALWAYS use the current date/time information provided above.
- Always provide specific, calculated answers with real dates and numbers.
- Do not use placeholders like [current date] or [today] - use the actual current information.
- For date calculations, use the current date as the reference point.
- When asked "what day is today?" or similar, respond with the actual current day name.
- When asked for future dates, calculate from the current date provided.

**FORMATTING INSTRUCTIONS:**
- For code responses, use proper markdown formatting with syntax highlighting.
- Use backticks for inline code, triple backticks for code blocks with language specification.
- Format your responses with appropriate markdown elements like **bold**, *italic*, \`code\`, etc.
- Keep responses concise but helpful.`,
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
