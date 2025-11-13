import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get access token from session
    const accessToken = (session as any).accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: "No access token" }, { status: 401 });
    }

    // Fetch user playlists from Spotify
    const response = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
