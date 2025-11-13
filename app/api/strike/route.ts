import { createClient } from "@/common/utils/server";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/common/libs/next-auth";

export const GET = async () => {
  const supabase = createClient();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Use upsert to handle both insert and update in one operation
    const { data: userData, error: upsertError } = await supabase
      .from("user_strikes")
      .upsert({
        user_email: session.user.email,
        name: session.user.name || null,
        image: session.user.image || null,
        strike_name: session.user.name || "New Striker",
        current_streak: 0,
        max_streak: 0,
        last_strike_date: null,
        restore_count: 0,
        last_restore_month: null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_email',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (upsertError) {
      console.error("Upsert error:", upsertError);
      throw upsertError;
    }

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error fetching user strike:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  const supabase = createClient();
  const session = await getServerSession(authOptions);

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

    if (fetchError) {
      console.error("Fetch user data error:", fetchError);
      throw fetchError;
    }

    if (action === "upgrade") {
      // Use the database function for safer upgrade logic
      const { data: upgradeResult, error: upgradeError } = await supabase
        .rpc('upgrade_strike', { p_email: userEmail });

      if (upgradeError) {
        console.error("Upgrade RPC error:", upgradeError);
        throw upgradeError;
      }

      if (!upgradeResult.success) {
        return NextResponse.json({ message: upgradeResult.message }, { status: 400 });
      }

      // Fetch updated data to return
      const { data: updatedData, error: fetchError } = await supabase
        .from("user_strikes")
        .select("*")
        .eq("user_email", userEmail)
        .single();

      if (fetchError) {
        console.error("Fetch updated data error:", fetchError);
        throw fetchError;
      }

      return NextResponse.json(updatedData, { status: 200 });

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

      if (error) {
        console.error("Restore error:", error);
        throw error;
      }
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

      if (error) {
        console.error("Reset error:", error);
        throw error;
      }
      return NextResponse.json(data, { status: 200 });
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating user strike:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: Request) => {
  const supabase = createClient();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { strike_name } = await req.json();

    if (!strike_name || typeof strike_name !== 'string' || strike_name.trim().length === 0) {
      return NextResponse.json({ message: "Invalid strike name" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user_strikes")
      .update({ strike_name: strike_name.trim(), updated_at: new Date().toISOString() })
      .eq("user_email", session.user.email)
      .select()
      .single();

    if (error) {
      console.error("Update strike name error:", error);
      throw error;
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error updating strike name:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
};
