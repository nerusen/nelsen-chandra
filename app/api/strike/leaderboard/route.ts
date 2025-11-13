import { createClient } from "@/common/utils/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  const supabase = createClient();

  try {
    // Get all users with their strike data and profile info, ordered by current_streak descending
    const { data: leaderboard, error: leaderboardError } = await supabase
      .from("user_strikes")
      .select(`
        user_email,
        strike_name,
        current_streak,
        user_profiles (
          name,
          image
        )
      `)
      .order("current_streak", { ascending: false });

    if (leaderboardError) throw leaderboardError;

    // Transform the data to flatten the profile info
    const transformedLeaderboard = leaderboard?.map((item: any) => ({
      user_email: item.user_email,
      strike_name: item.strike_name,
      current_streak: item.current_streak,
      name: item.user_profiles?.name || "Unknown User",
      image: item.user_profiles?.image || "/default-avatar.png",
    }));

    return NextResponse.json(transformedLeaderboard, { status: 200 });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
