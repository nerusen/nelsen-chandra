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

    // Fetch user profile from Spotify
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: response.status });
    }

    const profile = await response.json();
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching Spotify profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
