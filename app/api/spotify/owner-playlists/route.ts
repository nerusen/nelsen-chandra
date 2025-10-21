import { NextRequest, NextResponse } from "next";

export async function GET(request: NextRequest) {
  try {
    // Replace with your Spotify user ID
    const ownerId = process.env.SPOTIFY_OWNER_ID;

    if (!ownerId) {
      return NextResponse.json({ error: "Owner ID not configured" }, { status: 500 });
    }

    // Use client credentials flow for public data
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "Spotify credentials not configured" }, { status: 500 });
    }

    // Get access token
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!tokenResponse.ok) {
      return NextResponse.json({ error: "Failed to get access token" }, { status: 500 });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch owner's public playlists
    const playlistsResponse = await fetch(`https://api.spotify.com/v1/users/${ownerId}/playlists`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!playlistsResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch owner playlists" }, { status: playlistsResponse.status });
    }

    const playlists = await playlistsResponse.json();
    return NextResponse.json(playlists);
  } catch (error) {
    console.error("Error fetching owner playlists:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
