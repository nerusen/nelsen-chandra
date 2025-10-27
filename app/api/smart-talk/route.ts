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

      // Check if AI response already exists for this user message to prevent duplicates
      const { data: existingMessages } = await supabase
        .from("smart_talk_messages")
        .select("id, created_at")
        .eq("user_email", body.email)
        .eq("is_ai", true)
        .order("created_at", { ascending: false })
        .limit(1);

      if (existingMessages && existingMessages.length > 0) {
        // Check if the last AI message was sent within the last 5 seconds
        const lastAIMessage = existingMessages[0];
        const lastMessageTime = new Date(lastAIMessage.created_at);
        const now = new Date();
        const timeDiff = now.getTime() - lastMessageTime.getTime();

        if (timeDiff < 5000) { // 5 seconds
          console.log("AI response already sent recently, skipping duplicate");
          return NextResponse.json("AI response already sent", { status: 200 });
        }
      }

      // Get AI response from OpenRouter
      const aiResponse = await getAIResponse(body.userMessage, body.model || "minimax/minimax-01");
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

async function getAIResponse(userMessage: string, model: string = "minimax/minimax-01"): Promise<string> {
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
        model: model,
        messages: [
          {
            role: "system",
            content: `You are a helpful AI assistant in a chat application called Smart Talk. You have access to real-time information and current events. Be friendly, informative, and engaging. Keep responses concise but helpful.

**CURRENT DATE AND TIME INFORMATION (UPDATED IN REAL-TIME):**
- Current DateTime (ISO): ${currentDateTime.iso}
- Current DateTime (Local): ${currentDateTime.local}
- Current Day: ${currentDateTime.day}
- Current Date: ${currentDateTime.date}
- Current Time: ${currentDateTime.time}
- Timezone: ${currentDateTime.timezone}

**IMPORTANT INSTRUCTIONS FOR ACCURATE, UP-TO-DATE RESPONSES:**
- You have continuous access to current information, news, and real-time data.
- When asked about current events, news, weather, sports, technology updates, or any time-sensitive information, provide the most recent and accurate information available.
- For date/time related questions, ALWAYS use the current date/time information provided above as your reference point.
- When calculating future dates, always start from the current date shown above.
- For questions about "today", "now", "current", use the information provided in the CURRENT DATE AND TIME section.
- If asked about recent developments, breaking news, or current trends, provide information based on your continuous learning and access to real-time data.

**KNOWLEDGE AND CAPABILITIES:**
- You have knowledge of current events, technology trends, scientific developments, and global news up to your last training data, plus real-time access to current information.
- For coding questions, provide modern, best-practice solutions using current frameworks and technologies.
- For general knowledge questions, provide accurate, up-to-date information.
- If something is time-sensitive, acknowledge that your information might need verification for the absolute latest updates.

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
