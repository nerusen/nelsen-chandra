"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GiBullseye, GiAncientSword, GiAllForOne, GiBatBlade, GiBoltShield, GiBurningSkull, GiAngelWings, GiAngelOutfit, GiLaurelCrown, GiHolyGrail, GiUpgrade, GiCycle, GiOpenBook } from "react-icons/gi";

import Card from "@/common/components/elements/Card";
import Breakline from "@/common/components/elements/Breakline";
import SpotlightCard from "@/common/components/elements/SpotlightCard";

interface UserStrike {
  id: string;
  user_email: string;
  strike_name: string;
  current_streak: number;
  max_streak: number;
  last_strike_date: string | null;
  restore_count: number;
  last_restore_month: number | null;
}

interface LeaderboardUser {
  user_email: string;
  strike_name: string;
  max_streak: number;
  image: string;
  name: string;
}

const levelData = [
  { level: 0, name: "Unknown", icon: GiBullseye },
  { level: 1, name: "Beginner", icon: GiAncientSword },
  { level: 7, name: "Explorer", icon: GiAllForOne },
  { level: 15, name: "Adventurer", icon: GiBatBlade },
  { level: 30, name: "Hero", icon: GiBoltShield },
  { level: 50, name: "Knight", icon: GiBurningSkull },
  { level: 75, name: "Legend", icon: GiAngelWings },
  { level: 100, name: "Mystic", icon: GiAngelOutfit },
  { level: 150, name: "God", icon: GiLaurelCrown },
];

const getLevelFromStreak = (streak: number) => {
  for (let i = levelData.length - 1; i >= 0; i--) {
    if (streak >= levelData[i].level) {
      return levelData[i];
    }
  }
  return levelData[0];
};

const StrikeGame = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userStrike, setUserStrike] = useState<UserStrike | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [showPopup, setShowPopup] = useState<string | null>(null);
  const [newStrikeName, setNewStrikeName] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    fetchUserStrike();
    fetchLeaderboard();
  }, [session, status, router]);

  const fetchUserStrike = async () => {
    try {
      const res = await fetch("/api/strike");
      if (res.ok) {
        const data = await res.json();
        setUserStrike(data);
        setNewStrikeName(data.strike_name);
      }
    } catch (error) {
      console.error("Error fetching user strike:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/strike/leaderboard");
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const handleStrikeUpgrade = async () => {
    try {
      const res = await fetch("/api/strike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upgrade" }),
      });
      if (res.ok) {
        await fetchUserStrike();
      }
    } catch (error) {
      console.error("Error upgrading strike:", error);
    }
  };

  const handleRestoreStrike = async () => {
    try {
      const res = await fetch("/api/strike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore" }),
      });
      if (res.ok) {
        await fetchUserStrike();
      }
    } catch (error) {
      console.error("Error restoring strike:", error);
    }
  };

  const handleResetProgress = async () => {
    try {
      const res = await fetch("/api/strike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      if (res.ok) {
        await fetchUserStrike();
      }
    } catch (error) {
      console.error("Error resetting progress:", error);
    }
  };

  const handleUpdateStrikeName = async () => {
    try {
      const res = await fetch("/api/strike", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strike_name: newStrikeName }),
      });
      if (res.ok) {
        await fetchUserStrike();
        setShowPopup(null);
      }
    } catch (error) {
      console.error("Error updating strike name:", error);
    }
  };

  if (status === "loading") return <div>Loading...</div>;
  if (!session) return null;

  const currentLevel = userStrike ? getLevelFromStreak(userStrike.max_streak) : levelData[0];
  const displayLevel = userStrike && userStrike.current_streak === 0 ? levelData[0] : currentLevel;

  return (
    <div className="space-y-6">
      {/* Profile Bubble */}
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <img
            src={session.user?.image || "/default-avatar.png"}
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h3 className="font-medium">{session.user?.name}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{session.user?.email}</p>
          </div>
        </div>
      </Card>

      {/* Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handleResetProgress}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Reset Progress
        </button>
        <button
          onClick={() => setShowPopup("leaderboard")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <GiHolyGrail />
          <span>Leaderboard</span>
        </button>
      </div>

      {/* GIF Display */}
      <Card className="p-4 text-center">
        <img
          src={`/images/strike/level-${displayLevel.level}.gif`}
          alt={`Level ${displayLevel.level}`}
          className="w-48 h-48 mx-auto"
        />
      </Card>

      {/* Strike Upgrade Button */}
      <div className="text-center">
        <button
          onClick={handleStrikeUpgrade}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 mx-auto"
        >
          <GiUpgrade />
          <span>Strike Upgrade</span>
        </button>
        {userStrike && (
          <p className="mt-2 text-sm">Restores left: {3 - userStrike.restore_count}/3</p>
        )}
        {userStrike && userStrike.current_streak === 0 && (
          <button
            onClick={handleRestoreStrike}
            className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center space-x-2"
          >
            <GiCycle />
            <span>Restore Strike</span>
          </button>
        )}
      </div>

      {/* User Info Bubbles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SpotlightCard className="p-4 cursor-pointer" onClick={() => setShowPopup("strike_name")}>
          <h4 className="font-medium">Strike Name</h4>
          <p className="text-sm">{userStrike?.strike_name}</p>
        </SpotlightCard>
        <SpotlightCard className="p-4 cursor-pointer" onClick={() => setShowPopup("user_rank")}>
          <h4 className="font-medium">User Rank</h4>
          <p className="text-sm">{currentLevel.name}</p>
        </SpotlightCard>
        <SpotlightCard className="p-4 cursor-pointer" onClick={() => setShowPopup("user_name")}>
          <h4 className="font-medium">User Name</h4>
          <p className="text-sm">{session.user?.name}</p>
        </SpotlightCard>
        <SpotlightCard className="p-4 cursor-pointer" onClick={() => setShowPopup("user_leaderboard")}>
          <h4 className="font-medium">Leaderboard</h4>
          <p className="text-sm">#{leaderboard.findIndex(u => u.user_email === session.user?.email) + 1}</p>
        </SpotlightCard>
      </div>

      {/* Guide Button */}
      <div className="text-center">
        <button
          onClick={() => setShowPopup("guide")}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2 mx-auto"
        >
          <GiOpenBook />
          <span>Guide</span>
        </button>
      </div>

      {/* Popups */}
      {showPopup === "strike_name" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Change Strike Name</h3>
            <input
              type="text"
              value={newStrikeName}
              onChange={(e) => setNewStrikeName(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex space-x-2">
              <button onClick={handleUpdateStrikeName} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
              <button onClick={() => setShowPopup(null)} className="px-4 py-2 bg-gray-600 text-white rounded">Cancel</button>
            </div>
          </Card>
        </div>
      )}

      {showPopup === "user_rank" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">User Rank</h3>
            <div className="flex items-center space-x-2">
              <currentLevel.icon size={24} />
              <span>{currentLevel.name}</span>
            </div>
            <button onClick={() => setShowPopup(null)} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded">Close</button>
          </Card>
        </div>
      )}

      {showPopup === "user_name" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">User Name</h3>
            <p>{session.user?.name}</p>
            <button onClick={() => setShowPopup(null)} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded">Close</button>
          </Card>
        </div>
      )}

      {showPopup === "user_leaderboard" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Your Leaderboard Position</h3>
            <p>#{leaderboard.findIndex(u => u.user_email === session.user?.email) + 1}</p>
            <button onClick={() => setShowPopup(null)} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded">Close</button>
          </Card>
        </div>
      )}

      {showPopup === "leaderboard" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <Card className="p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Leaderboard</h3>
            <div className="space-y-2">
              {leaderboard.map((user, index) => {
                const userLevel = getLevelFromStreak(user.max_streak);
                const isTop3 = index < 3;
                return (
                  <SpotlightCard
                    key={user.user_email}
                    className={`p-4 ${isTop3 ? (index === 0 ? 'bg-yellow-100 dark:bg-yellow-900' : index === 1 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-orange-100 dark:bg-orange-900') : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-bold">#{index + 1}</span>
                      <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full" />
                      <div className="flex-1">
                        <p className="font-medium">{user.strike_name} - {user.name}</p>
                      </div>
                      <img src={`/images/strike/level-${userLevel.level}.gif`} alt={`Level ${userLevel.level}`} className="w-12 h-12" />
                      <userLevel.icon size={20} />
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>
            <button onClick={() => setShowPopup(null)} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded">Close</button>
          </Card>
        </div>
      )}

      {showPopup === "guide" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <Card className="p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Guide</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Ranks</h4>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2">Rank</th>
                      <th className="border border-gray-300 p-2">Badge</th>
                      <th className="border border-gray-300 p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levelData.map((level) => (
                      <tr key={level.level}>
                        <td className="border border-gray-300 p-2">{level.name}</td>
                        <td className="border border-gray-300 p-2"><level.icon size={20} /></td>
                        <td className="border border-gray-300 p-2">Achieved at {level.level} streak</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Levels</h4>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2">Level</th>
                      <th className="border border-gray-300 p-2">Strike</th>
                      <th className="border border-gray-300 p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levelData.map((level) => (
                      <tr key={level.level}>
                        <td className="border border-gray-300 p-2">{level.level}</td>
                        <td className="border border-gray-300 p-2">
                          <img src={`/images/strike/level-${level.level}.gif`} alt={`Level ${level.level}`} className="w-12 h-12" />
                        </td>
                        <td className="border border-gray-300 p-2">{level.name} level</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <button onClick={() => setShowPopup(null)} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded">Close</button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StrikeGame;
