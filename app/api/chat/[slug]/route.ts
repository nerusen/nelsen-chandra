import { NextResponse } from "next/server";

import { createClient } from "@/common/utils/server";

export const DELETE = async (
  req: Request,
  { params }: { params: { slug: string } },
) => {
  const supabase = createClient();
  try {
    const id = params.slug;
    const { email } = await req.json();

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

    // Allow if user is author or owns the message
    if (!isAuthor && existingMessage.email !== email) {
      return NextResponse.json(
        { message: "Unauthorized to delete this message" },
        { status: 403 },
      );
    }

    await supabase.from("messages").delete().eq("id", id);
    return NextResponse.json("Data deleted successfully", { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};

export const PUT = async (
  req: Request,
  { params }: { params: { slug: string } },
) => {
  const supabase = createClient();
  try {
    const id = params.slug;
    const { message, email } = await req.json();

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

    // Allow if user is author or owns the message
    if (!isAuthor && existingMessage.email !== email) {
      return NextResponse.json(
        { message: "Unauthorized to edit this message" },
        { status: 403 },
      );
    }

    // Update the message
    const { data, error } = await supabase
      .from("messages")
      .update({ message, updated_at: new Date().toISOString() })
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
