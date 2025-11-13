import { createClient } from "@/common/utils/server";
import { NextResponse } from "next/server";

export const GET = async () => {
  const supabase = createClient();

  try {
    // Get all users with their strike data from the unified table, ordered by current_streak descending
    const { data: leaderboard, error } = await supabase
      .from("user_strikes")
      .select("user_email, strike_name, current_streak, name, image")
      .order("current_streak", { ascending: false });

    if (error) throw error;

    // Transform the data to ensure consistent format
    const transformedLeaderboard = leaderboard?.map((user) => ({
      user_email: user.user_email,
      strike_name: user.strike_name,
      current_streak: user.current_streak,
      name: user.name || "Unknown User",
      image: user.image || "/default-avatar.png",
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
