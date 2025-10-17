import { createClient } from "@/common/utils/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  const supabase = createClient();
  try {
    const { data } = await supabase.from("messages").select();
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
    await supabase.from("messages").insert([body]);
    return NextResponse.json("Data saved successfully", { status: 200 });
  } catch (error) {
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
