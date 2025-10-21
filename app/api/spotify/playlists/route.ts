import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, return empty array until we fix the session type
    // TODO: Fix session type to include accessToken
    return NextResponse.json({ items: [] });
  } catch (error) {
    console.error("Error fetching Spotify playlists:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
