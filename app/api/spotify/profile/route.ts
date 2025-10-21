import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, return mock profile until we fix the session type
    // TODO: Fix session type to include accessToken
    return NextResponse.json({
      display_name: "User",
      id: "user_id",
      images: [],
      followers: { total: 0 }
    });
  } catch (error) {
    console.error("Error fetching Spotify profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
