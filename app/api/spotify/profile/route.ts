import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
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
