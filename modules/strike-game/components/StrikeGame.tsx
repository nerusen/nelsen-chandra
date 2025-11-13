"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GiBullseye, GiAncientSword, GiAllForOne, GiBatBlade, GiBoltShield, GiBurningSkull, GiAngelWings, GiAngelOutfit, GiLaurelCrown, GiHolyGrail, GiUpgrade, GiCycle, GiOpenBook, GiBurningEmbers as StrikeIcon } from "react-icons/gi";
import { useTranslations } from "next-intl";

import Card from "@/common/components/elements/Card";
import Breakline from "@/common/components/elements/Breakline";
import SpotlightCard from "@/common/components/elements/SpotlightCard";
import SectionHeading from "@/common/components/elements/SectionHeading";
import SectionSubHeading from "@/common/components/elements/SectionSubHeading";

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
  const t = useTranslations("StrikeGamePage");
  const [userStrike, setUserStrike] = useState<UserStrike | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [showPopup, setShowPopup] = useState<string | null>(null);
  const [newStrikeName, setNewStrikeName] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      return;
    }
    fetchUserStrike();
    fetchLeaderboard();
  }, [session, status]);

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
        const data = await res.json();
        setUserStrike(data);
        setNewStrikeName(data.strike_name);
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to upgrade strike");
      }
    } catch (error) {
      console.error("Error upgrading strike:", error);
      alert("Error upgrading strike");
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
        const data = await res.json();
        setUserStrike(data);
        setNewStrikeName(data.strike_name);
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to restore strike");
      }
    } catch (error) {
      console.error("Error restoring strike:", error);
      alert("Error restoring strike");
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
        const data = await res.json();
        setUserStrike(data);
        setNewStrikeName(data.strike_name);
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to reset progress");
      }
    } catch (error) {
      console.error("Error resetting progress:", error);
      alert("Error resetting progress");
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
        const data = await res.json();
        setUserStrike(data);
        setShowPopup(null);
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update strike name");
      }
    } catch (error) {
      console.error("Error updating strike name:", error);
      alert("Error updating strike name");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-y-4 transition-all duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-700 dark:border-neutral-300 mx-auto"></div>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-medium">{t("login_required")}</h2>
          <p className="mb-6 border-b border-dashed border-neutral-600 pb-6 pt-2 text-neutral-600 dark:text-neutral-400 md:mb-0 md:border-b-0 md:pb-0">
            {t("login_description")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/login"
            className="group flex w-fit items-center gap-2 rounded-lg border border-neutral-400 bg-neutral-100 px-3 py-2 text-sm transition duration-100 hover:text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:text-neutral-200"
          >
            <span className="inline">{t("login_button")}</span>
          </a>
        </div>
      </div>
    );
  }

  const currentLevel = userStrike ? getLevelFromStreak(userStrike.current_streak) : levelData[0];
  const displayLevel = userStrike && userStrike.current_streak === 0 ? levelData[0] : currentLevel;

  return (
    <div className="space-y-6">
      <SectionHeading title={t("title")} icon={<StrikeIcon />} />
      <SectionSubHeading>
        <p>{t("sub_title")}</p>
      </SectionSubHeading>

      <Breakline className="my-8" />

      {/* Profile Bubble */}
      <SpotlightCard className="p-6">
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
      </SpotlightCard>

      {/* Action Buttons Above GIF */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowPopup("guide")}
          className="group flex w-fit items-center gap-2 rounded-lg border border-neutral-400 bg-neutral-100 px-3 py-2 text-sm transition duration-100 hover:text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:text-neutral-200"
        >
          <GiOpenBook />
          <span className="inline">{t("guide_button")}</span>
        </button>
        <button
          onClick={() => setShowPopup("leaderboard")}
          className="group flex w-fit items-center gap-2 rounded-lg border border-neutral-400 bg-neutral-100 px-3 py-2 text-sm transition duration-100 hover:text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:text-neutral-200"
        >
          <GiHolyGrail />
          <span className="inline">{t("leaderboard_button")}</span>
        </button>
      </div>

      {/* GIF Display */}
      <SpotlightCard className="p-6 text-center">
        <img
          src={`/images/strike/level-${displayLevel.level}.gif`}
          alt={`Level ${displayLevel.level}`}
          className="w-48 h-48 mx-auto"
        />
      </SpotlightCard>

      {/* Strike Upgrade Button */}
      <div className="text-center space-y-2">
        <button
          onClick={handleStrikeUpgrade}
          className="group flex w-fit items-center gap-2 rounded-lg border border-neutral-400 bg-neutral-100 px-3 py-2 text-sm transition duration-100 hover:text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:text-neutral-200 mx-auto"
        >
          <GiUpgrade />
          <span className="inline">{t("upgrade_button")}</span>
        </button>
        {userStrike && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {t("restores_left")}: {3 - userStrike.restore_count}/3
          </p>
        )}
        {userStrike && userStrike.current_streak === 0 && (
          <button
            onClick={handleRestoreStrike}
            className="group flex w-fit items-center gap-2 rounded-lg border border-neutral-400 bg-neutral-100 px-3 py-2 text-sm transition duration-100 hover:text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:text-neutral-200 mx-auto"
          >
            <GiCycle />
            <span className="inline">{t("restore_button")}</span>
          </button>
        )}
      </div>

      {/* User Info Bubbles */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <SpotlightCard className="p-4 cursor-pointer text-center" onClick={() => setShowPopup("strike_name")}>
          <h4 className="font-medium text-sm">{t("strike_name_title")}</h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{userStrike?.strike_name}</p>
        </SpotlightCard>
        <SpotlightCard className="p-4 cursor-pointer text-center" onClick={() => setShowPopup("user_rank")}>
          <h4 className="font-medium text-sm">{t("user_rank_title")}</h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{currentLevel.name}</p>
        </SpotlightCard>
        <SpotlightCard className="p-4 cursor-pointer text-center" onClick={() => setShowPopup("user_level")}>
          <h4 className="font-medium text-sm">{t("user_level_title")}</h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{userStrike?.current_streak} {t("days")}</p>
        </SpotlightCard>
        <SpotlightCard className="p-4 cursor-pointer text-center" onClick={() => setShowPopup("user_name")}>
          <h4 className="font-medium text-sm">{t("user_name_title")}</h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">{session.user?.name}</p>
        </SpotlightCard>
        <SpotlightCard className="p-4 cursor-pointer text-center" onClick={() => setShowPopup("user_leaderboard")}>
          <h4 className="font-medium text-sm">{t("leaderboard_title")}</h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">#{leaderboard.findIndex(u => u.user_email === session.user?.email) + 1}</p>
        </SpotlightCard>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            fetchUserStrike();
            fetchLeaderboard();
          }}
          className="group flex w-fit items-center gap-2 rounded-lg border border-neutral-400 bg-neutral-100 px-3 py-2 text-sm transition duration-100 hover:text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:text-neutral-200"
        >
          <GiCycle />
          <span className="inline">{t("refresh_button")}</span>
        </button>
        <button
          onClick={handleResetProgress}
          className="group flex w-fit items-center gap-2 rounded-lg border border-neutral-400 bg-neutral-100 px-3 py-2 text-sm transition duration-100 hover:text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:text-neutral-200"
        >
          <span className="inline">{t("reset_button")}</span>
        </button>
      </div>

      {/* Popups */}
      {showPopup === "strike_name" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <SpotlightCard className="p-4 max-w-sm w-full">
            <h3 className="text-base font-bold mb-3">{t("change_strike_name")}</h3>
            <input
              type="text"
              value={newStrikeName}
              onChange={(e) => setNewStrikeName(e.target.value)}
              className="w-full p-2 border rounded mb-3 text-sm"
            />
            <div className="flex space-x-2">
              <button onClick={handleUpdateStrikeName} className="px-3 py-1 bg-green-600 text-white rounded text-sm">{t("save_button")}</button>
              <button onClick={() => setShowPopup(null)} className="px-3 py-1 bg-gray-600 text-white rounded text-sm">{t("cancel_button")}</button>
            </div>
          </SpotlightCard>
        </div>
      )}

      {showPopup === "user_rank" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <SpotlightCard className="p-4 max-w-sm w-full">
            <h3 className="text-base font-bold mb-3">{t("user_rank_popup")}</h3>
            <div className="flex items-center space-x-2">
              <currentLevel.icon size={20} />
              <span className="text-sm">{currentLevel.name}</span>
            </div>
            <button onClick={() => setShowPopup(null)} className="mt-3 px-3 py-1 bg-gray-600 text-white rounded text-sm">{t("close_button")}</button>
          </SpotlightCard>
        </div>
      )}

      {showPopup === "user_name" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <SpotlightCard className="p-4 max-w-sm w-full">
            <h3 className="text-base font-bold mb-3">{t("user_name_popup")}</h3>
            <p className="text-sm">{session.user?.name}</p>
            <button onClick={() => setShowPopup(null)} className="mt-3 px-3 py-1 bg-gray-600 text-white rounded text-sm">{t("close_button")}</button>
          </SpotlightCard>
        </div>
      )}

      {showPopup === "user_leaderboard" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <SpotlightCard className="p-4 max-w-sm w-full">
            <h3 className="text-base font-bold mb-3">{t("leaderboard_position_popup")}</h3>
            <p className="text-sm">#{leaderboard.findIndex(u => u.user_email === session.user?.email) + 1}</p>
            <button onClick={() => setShowPopup(null)} className="mt-3 px-3 py-1 bg-gray-600 text-white rounded text-sm">{t("close_button")}</button>
          </SpotlightCard>
        </div>
      )}

      {showPopup === "user_level" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <SpotlightCard className="p-4 max-w-sm w-full">
            <h3 className="text-base font-bold mb-3">{t("user_level_popup")}</h3>
            <p className="text-sm">{userStrike?.current_streak} {t("days")}</p>
            <button onClick={() => setShowPopup(null)} className="mt-3 px-3 py-1 bg-gray-600 text-white rounded text-sm">{t("close_button")}</button>
          </SpotlightCard>
        </div>
      )}

      {showPopup === "leaderboard" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <SpotlightCard className="p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">{t("leaderboard_popup")}</h3>
            <div className="space-y-2">
              {leaderboard.map((user, index) => {
                const userLevel = getLevelFromStreak(user.max_streak);
                const isTop3 = index < 3;
                return (
                  <SpotlightCard
                    key={user.user_email}
                    className={`p-3 ${isTop3 ? (index === 0 ? 'bg-yellow-100 dark:bg-yellow-900' : index === 1 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-orange-100 dark:bg-orange-900') : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-sm">#{index + 1}</span>
                      <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user.strike_name} - {user.name}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">{t("streak")}: {user.max_streak}</span>
                          <div className="flex items-center space-x-1">
                            <userLevel.icon size={12} />
                            <span className="text-xs text-neutral-600 dark:text-neutral-400">{userLevel.name}</span>
                          </div>
                        </div>
                      </div>
                      <img src={`/images/strike/level-${userLevel.level}.gif`} alt={`Level ${userLevel.level}`} className="w-10 h-10" />
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>
            <button onClick={() => setShowPopup(null)} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded">{t("close_button")}</button>
          </SpotlightCard>
        </div>
      )}

      {showPopup === "guide" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <SpotlightCard className="p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">{t("guide_popup")}</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">{t("ranks_section")}</h4>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2">{t("rank_header")}</th>
                      <th className="border border-gray-300 p-2">{t("badge_header")}</th>
                      <th className="border border-gray-300 p-2">{t("description_header")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levelData.map((level) => (
                      <tr key={level.level}>
                        <td className="border border-gray-300 p-2">{level.name}</td>
                        <td className="border border-gray-300 p-2"><level.icon size={20} /></td>
                        <td className="border border-gray-300 p-2">{t("achieved_at")} {level.level} {t("streak")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h4 className="font-semibold mb-2">{t("levels_section")}</h4>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2">{t("level_header")}</th>
                      <th className="border border-gray-300 p-2">{t("strike_header")}</th>
                      <th className="border border-gray-300 p-2">{t("description_header")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levelData.map((level) => (
                      <tr key={level.level}>
                        <td className="border border-gray-300 p-2">{level.level}</td>
                        <td className="border border-gray-300 p-2">
                          <img src={`/images/strike/level-${level.level}.gif`} alt={`Level ${level.level}`} className="w-12 h-12" />
                        </td>
                        <td className="border border-gray-300 p-2">{level.name} {t("level")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <button onClick={() => setShowPopup(null)} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded">{t("close_button")}</button>
          </SpotlightCard>
        </div>
      )}
    </div>
  );
};

export default StrikeGame;