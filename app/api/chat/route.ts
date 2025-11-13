import { createClient } from "@/common/utils/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  const supabase = createClient();
  try {
    // Get messages with their associated images
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select(`
        *,
        images (
          image_data
        )
      `)
      .order('created_at', { ascending: true });

    if (messagesError) throw messagesError;

    // Transform the data to include media array
    const transformedMessages = messages?.map(message => ({
      ...message,
      media: message.images?.map((img: any) => img.image_data) || []
    }));

    return NextResponse.json(transformedMessages, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages:", error);
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
    const { media, ...messageData } = body;

    // Insert message first
    const { data: messageResult, error: messageError } = await supabase
      .from("messages")
      .insert([messageData])
      .select()
      .single();

    if (messageError) throw messageError;

    // If there are media files, insert them
    if (media && media.length > 0) {
      const mediaData = media.map((imageData: string) => ({
        message_id: messageResult.id,
        image_data: imageData,
        user_email: messageData.email,
      }));

      const { error: mediaError } = await supabase
        .from("images")
        .insert(mediaData);

      if (mediaError) throw mediaError;
    }

    return NextResponse.json("Data saved successfully", { status: 200 });
  } catch (error) {
    console.error("Error saving message with media:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: Request) => {
  const supabase = createClient();
  try {
    const { id, is_pinned, email } = await req.json();

    const authorEmail = process.env.NEXT_PUBLIC_AUTHOR_EMAIL;
    const isAuthor = email === authorEmail;

    // First, check if the message exists
    const { data: existingMessage, error: fetchError } = await supabase
      .from("messages")
      .select("email")
      .eq("id", id)
      .single();

    if (fetchError || !existingMessage) {
      return NextResponse.json(
        { message: "Message not found" },
        { status: 404 },
      );
    }

    // Only author can pin/unpin messages
    if (!isAuthor) {
      return NextResponse.json(
        { message: "Unauthorized to pin/unpin this message" },
        { status: 403 },
      );
    }

    const { data, error } = await supabase
      .from("messages")
      .update({ is_pinned })
      .eq("id", id)
      .select();

    if (error) throw error;
    return NextResponse.json(data[0], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
