import { createClient } from "@/common/utils/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  const supabase = createClient();

  try {
    // Get all users with their strike data and profile info, ordered by current_streak descending
    const { data: strikes, error: strikesError } = await supabase
      .from("user_strikes")
      .select("*")
      .order("current_streak", { ascending: false });

    if (strikesError) throw strikesError;

    // Get all user profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("user_profiles")
      .select("*");

    if (profilesError) throw profilesError;

    // Create a map of profiles for quick lookup
    const profileMap = new Map();
    profiles?.forEach(profile => {
      profileMap.set(profile.user_email, profile);
    });

    // Transform the data to include profile info
    const transformedLeaderboard = strikes?.map((strike) => {
      const profile = profileMap.get(strike.user_email);
      return {
        user_email: strike.user_email,
        strike_name: strike.strike_name,
        current_streak: strike.current_streak,
        name: profile?.name || "Unknown User",
        image: profile?.image || "/default-avatar.png",
      };
    });

    return NextResponse.json(transformedLeaderboard, { status: 200 });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
