import { createClient } from "@/common/utils/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export const GET = async () => {
  const supabase = createClient();
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all users with their strike data, ordered by current_streak descending
    const { data: strikes, error: strikesError } = await supabase
      .from("user_strikes")
      .select("*")
      .order("current_streak", { ascending: false });

    if (strikesError) throw strikesError;

    // For each user, we need to get their profile info
    // Since we don't have a users table, we'll use the session data for the current user
    // and mock data for others (in a real app, you'd have a users table)
    const leaderboard = await Promise.all(
      strikes.map(async (strike, index) => {
        let userInfo = {
          name: `User ${index + 1}`,
          image: "/default-avatar.png",
        };

        // If this is the current user, use their session data
        if (strike.user_email === session.user?.email) {
          userInfo = {
            name: session.user?.name || "Unknown User",
            image: session.user?.image || "/default-avatar.png",
          };
        }

        return {
          user_email: strike.user_email,
          strike_name: strike.strike_name,
          max_streak: strike.max_streak,
          ...userInfo,
        };
      })
    );

    return NextResponse.json(leaderboard, { status: 200 });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
