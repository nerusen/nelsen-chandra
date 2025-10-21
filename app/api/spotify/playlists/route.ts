import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch playlists" }, { status: response.status });
    }

    const playlists = await response.json();
    return NextResponse.json(playlists);
  } catch (error) {
    console.error("Error fetching Spotify playlists:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
