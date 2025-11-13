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
    // Always sync user profile data in the unified table
    await supabase
      .from("user_strikes")
      .upsert({
        user_email: session.user.email,
        name: session.user.name || null,
        image: session.user.image || null,
      }, {
        onConflict: 'user_email'
      });

    const { data, error } = await supabase
      .from("user_strikes")
      .select("*")
      .eq("user_email", session.user.email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    if (!data) {
      // Create new user strike record
      const { data: newData, error: insertError } = await supabase
        .from("user_strikes")
        .insert([{
          user_email: session.user.email,
          strike_name: session.user.name || "New Striker",
          current_streak: 0,
          max_streak: 0,
          last_strike_date: null,
          restore_count: 0,
          last_restore_month: null,
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      return NextResponse.json(newData, { status: 200 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching user strike:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  const supabase = createClient();
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { action } = await req.json();
    const userEmail = session.user.email;
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed

    // Get current user data
    const { data: userData, error: fetchError } = await supabase
      .from("user_strikes")
      .select("*")
      .eq("user_email", userEmail)
      .single();

    if (fetchError) throw fetchError;

    if (action === "upgrade") {
      // Check if already upgraded today
      if (userData.last_strike_date === today) {
        return NextResponse.json({ message: "Already upgraded today" }, { status: 400 });
      }

      // Check if streak is broken (more than 1 day since last strike)
      const lastStrikeDate = userData.last_strike_date ? new Date(userData.last_strike_date) : null;
      const daysSinceLastStrike = lastStrikeDate ? Math.floor((now.getTime() - lastStrikeDate.getTime()) / (1000 * 60 * 60 * 24)) : null;

      let newCurrentStreak = userData.current_streak;
      let newMaxStreak = userData.max_streak;

      if (daysSinceLastStrike === null || daysSinceLastStrike === 1) {
        // Continue streak
        newCurrentStreak += 1;
        if (newCurrentStreak > newMaxStreak) {
          newMaxStreak = newCurrentStreak;
        }
      } else if (daysSinceLastStrike > 1) {
        // Streak broken, start new streak
        newCurrentStreak = 1;
      }

      const { data, error } = await supabase
        .from("user_strikes")
        .update({
          current_streak: newCurrentStreak,
          max_streak: newMaxStreak,
          last_strike_date: today,
          updated_at: now.toISOString(),
        })
        .eq("user_email", userEmail)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data, { status: 200 });

    } else if (action === "restore") {
      // Check if restore is allowed
      if (userData.restore_count >= 3 && userData.last_restore_month === currentMonth) {
        return NextResponse.json({ message: "Restore limit reached for this month" }, { status: 400 });
      }

      // Restore streak to max_streak
      const newRestoreCount = userData.last_restore_month === currentMonth ? userData.restore_count + 1 : 1;

      const { data, error } = await supabase
        .from("user_strikes")
        .update({
          current_streak: userData.max_streak,
          restore_count: newRestoreCount,
          last_restore_month: currentMonth,
          updated_at: now.toISOString(),
        })
        .eq("user_email", userEmail)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data, { status: 200 });

    } else if (action === "reset") {
      const { data, error } = await supabase
        .from("user_strikes")
        .update({
          current_streak: 0,
          max_streak: 0,
          last_strike_date: null,
          restore_count: 0,
          last_restore_month: null,
          updated_at: now.toISOString(),
        })
        .eq("user_email", userEmail)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data, { status: 200 });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating user strike:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: Request) => {
  const supabase = createClient();
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { strike_name } = await req.json();

    const { data, error } = await supabase
      .from("user_strikes")
      .update({ strike_name, updated_at: new Date().toISOString() })
      .eq("user_email", session.user.email)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error updating strike name:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
