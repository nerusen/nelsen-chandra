"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GiBullseye, GiAncientSword, GiAllForOne, GiBatBlade, GiBoltShield, GiBurningSkull, GiAngelWings, GiAngelOutfit, GiLaurelCrown, GiHolyGrail, GiUpgrade, GiCycle, GiOpenBook, GiBurningEmbers as StrikeIcon, GiDna2 as WarningIcon } from "react-icons/gi";
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
  current_streak: number;
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
  const [guideTab, setGuideTab] = useState<"ranks" | "levels">("ranks");

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
    <div className="max-w-4xl mx-auto px-4 space-y-6">
      <SectionHeading title={t("title")} />
      <SectionSubHeading>
        <p>{t("sub_title")}</p>
      </SectionSubHeading>
      <Breakline />

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

      {/* Settings Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowPopup("settings")}
          className="group flex w-fit items-center gap-2 rounded-lg border border-neutral-400 bg-neutral-100 px-3 py-2 text-sm transition duration-100 hover:text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:text-neutral-200"
        >
          <span className="inline">{t("settings_button")}</span>
        </button>
      </div>

      {/* Popups */}
      {showPopup === "strike_name" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <SpotlightCard className="p-4 max-w-sm w-full animate-in zoom-in-95 duration-300">
            <h3 className="text-base font-bold mb-3">{t("change_strike_name")}</h3>
            <input
              type="text"
              value={newStrikeName}
              onChange={(e) => setNewStrikeName(e.target.value)}
              className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg mb-4 text-sm bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleUpdateStrikeName}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t("save_button")}
              </button>
              <button
                onClick={() => setShowPopup(null)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t("cancel_button")}
              </button>
            </div>
          </SpotlightCard>
        </div>
      )}

      {showPopup === "user_rank" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <SpotlightCard className="p-4 max-w-sm w-full animate-in zoom-in-95 duration-300">
            <h3 className="text-base font-bold mb-3">{t("user_rank_popup")}</h3>
            <div className="flex items-center space-x-2">
              <currentLevel.icon size={20} />
              <span className="text-sm">{currentLevel.name}</span>
            </div>
            <button
              onClick={() => setShowPopup(null)}
              className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t("close_button")}
            </button>
          </SpotlightCard>
        </div>
      )}

      {showPopup === "user_name" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <SpotlightCard className="p-4 max-w-sm w-full animate-in zoom-in-95 duration-300">
            <h3 className="text-base font-bold mb-3">{t("user_name_popup")}</h3>
            <p className="text-sm">{session.user?.name}</p>
            <button
              onClick={() => setShowPopup(null)}
              className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t("close_button")}
            </button>
          </SpotlightCard>
        </div>
      )}

      {showPopup === "user_leaderboard" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <SpotlightCard className="p-4 max-w-sm w-full animate-in zoom-in-95 duration-300">
            <h3 className="text-base font-bold mb-3">{t("leaderboard_position_popup")}</h3>
            <p className="text-sm">#{leaderboard.findIndex(u => u.user_email === session.user?.email) + 1}</p>
            <button
              onClick={() => setShowPopup(null)}
              className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t("close_button")}
            </button>
          </SpotlightCard>
        </div>
      )}

      {showPopup === "user_level" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <SpotlightCard className="p-4 max-w-sm w-full animate-in zoom-in-95 duration-300">
            <h3 className="text-base font-bold mb-3">{t("user_level_popup")}</h3>
            <p className="text-sm">{userStrike?.current_streak} {t("days")}</p>
            <button
              onClick={() => setShowPopup(null)}
              className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t("close_button")}
            </button>
          </SpotlightCard>
        </div>
      )}

      {showPopup === "leaderboard" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto animate-in fade-in duration-300">
          <SpotlightCard className="p-4 max-w-sm w-full max-h-[60vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            <h3 className="text-base font-bold mb-3">{t("leaderboard_popup")}</h3>
            <div className="space-y-3">
              {leaderboard.slice(0, 10).map((user, index) => {
                const userLevel = getLevelFromStreak(user.current_streak);
                const isTop3 = index < 3;

                const getTop3Styles = (position: number) => ({
                  0: {
                    border: 'border-2 border-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500',
                    bg: 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
                    crown: '👑',
                    shadow: 'shadow-yellow-200/50 dark:shadow-yellow-900/30',
                    rankBg: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg',
                    ringColor: 'ring-white/50 dark:ring-neutral-800/50',
                    pulseColor: 'bg-gradient-to-r from-yellow-400 to-amber-500'
                  },
                  1: {
                    border: 'border-2 border-gradient-to-r from-gray-400 via-gray-500 to-slate-500',
                    bg: 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20',
                    crown: '🥈',
                    shadow: 'shadow-gray-200/50 dark:shadow-gray-900/30',
                    rankBg: 'bg-gradient-to-r from-gray-400 to-slate-500 text-white shadow-lg',
                    ringColor: 'ring-white/50 dark:ring-neutral-800/50',
                    pulseColor: 'bg-gradient-to-r from-gray-400 to-slate-500'
                  },
                  2: {
                    border: 'border-2 border-gradient-to-r from-orange-400 via-orange-500 to-red-500',
                    bg: 'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
                    crown: '🥉',
                    shadow: 'shadow-orange-200/50 dark:shadow-orange-900/30',
                    rankBg: 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg',
                    ringColor: 'ring-white/50 dark:ring-neutral-800/50',
                    pulseColor: 'bg-gradient-to-r from-orange-400 to-red-500'
                  }
                }[position]);

                const top3Styles = isTop3 ? getTop3Styles(index) : null;

                return (
                  <div
                    key={user.user_email}
                    className={`relative p-3 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                      isTop3 && top3Styles
                        ? `${top3Styles.bg} ${top3Styles.shadow} shadow-lg`
                        : 'bg-white dark:bg-neutral-900 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {isTop3 && top3Styles && (
                      <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                        {top3Styles.crown}
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        isTop3 && top3Styles
                          ? top3Styles.rankBg
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                      }`}>
                        #{index + 1}
                      </div>
                      <div className="relative rounded-full">
                        <img
                          src={user.image}
                          alt={user.name}
                          className={`w-10 h-10 rounded-full object-cover ${isTop3 ? 'shadow-lg' : ''}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm truncate ${isTop3 ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-800 dark:text-neutral-200'}`}>
                          {user.strike_name} - {user.name}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs font-medium ${isTop3 ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-600 dark:text-neutral-400'}`}>
                            {user.current_streak} days
                          </span>
                          <userLevel.icon size={12} className={isTop3 ? 'text-neutral-600 dark:text-neutral-400' : 'text-neutral-500 dark:text-neutral-500'} />
                        </div>
                      </div>
                      <div className={`relative ${isTop3 ? 'ring-2 ring-white/30 dark:ring-neutral-700/50 rounded-lg' : ''}`}>
                        <img
                          src={`/images/strike/level-${userLevel.level}.gif`}
                          alt={`Level ${userLevel.level}`}
                          className={`w-12 h-12 rounded-lg object-cover ${isTop3 ? 'shadow-lg' : ''}`}
                        />
                        {isTop3 && top3Styles && (
                          <div className={`absolute -inset-1 rounded-lg ${top3Styles.pulseColor} opacity-20 animate-pulse`}></div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setShowPopup(null)}
              className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t("close_button")}
            </button>
          </SpotlightCard>
        </div>
      )}

      {showPopup === "settings" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <SpotlightCard className="p-6 max-w-md w-full animate-in zoom-in-95 duration-300">
            <h3 className="text-lg font-bold mb-4 text-center">{t("settings_popup_title")}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 text-center">{t("settings_popup_description")}</p>

            <div className="space-y-4">
              {/* Refresh Button */}
              <div className="border border-neutral-300 dark:border-neutral-600 rounded-lg p-4">
                <h4 className="font-semibold mb-2">{t("refresh_title")}</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{t("refresh_description")}</p>
                <button
                  onClick={() => {
                    fetchUserStrike();
                    fetchLeaderboard();
                    setShowPopup(null);
                  }}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-400 bg-neutral-100 px-4 py-2 text-sm transition-all duration-200 hover:text-neutral-800 hover:scale-105 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:text-neutral-200 shadow-lg hover:shadow-xl"
                >
                  <GiCycle />
                  <span className="inline">{t("refresh_button")}</span>
                </button>
              </div>

              {/* Reset Button */}
              <div className="border border-neutral-300 dark:border-neutral-600 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-red-500">{t("reset_title")}</h4>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">{t("reset_description")}</p>
                <button
                  onClick={() => setShowPopup("reset_confirm")}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg border border-red-400 bg-red-50 px-4 py-2 text-sm transition-all duration-200 hover:bg-red-100 hover:scale-105 dark:border-red-600 dark:bg-red-900 dark:hover:bg-red-800 text-red-700 dark:text-red-300 shadow-lg hover:shadow-xl"
                >
                  <span className="inline">{t("reset_button")}</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowPopup(null)}
              className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t("close_button")}
            </button>
          </SpotlightCard>
        </div>
      )}

      {showPopup === "reset_confirm" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <SpotlightCard className="p-6 max-w-sm w-full text-center animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-center mb-4">
              <WarningIcon size={48} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-red-500">WARNING</h3>
            <p className="text-sm mb-6 text-neutral-700 dark:text-neutral-300">
              Apakah Anda yakin ingin mengatur ulang semua progres permainan? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => setShowPopup(null)}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t("cancel_button")}
              </button>
              <button
                onClick={() => {
                  handleResetProgress();
                  setShowPopup(null);
                }}
                className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {t("confirm_button")}
              </button>
            </div>
          </SpotlightCard>
        </div>
      )}

      {showPopup === "guide" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto animate-in fade-in duration-300">
          <SpotlightCard className="p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            <h3 className="text-lg font-bold mb-4">{t("guide_popup")}</h3>

            {/* Tab Buttons */}
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setGuideTab("ranks")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  guideTab === "ranks"
                    ? "bg-gradient-to-r from-neutral-800 to-neutral-900 text-white shadow-lg"
                    : "bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-700 border border-neutral-300 hover:from-neutral-200 hover:to-neutral-300 dark:from-neutral-800 dark:to-neutral-900 dark:text-neutral-300 dark:border-neutral-600 dark:hover:from-neutral-700 dark:hover:to-neutral-800 shadow-md hover:shadow-lg"
                }`}
              >
                {t("ranks_section")}
              </button>
              <button
                onClick={() => setGuideTab("levels")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  guideTab === "levels"
                    ? "bg-gradient-to-r from-neutral-800 to-neutral-900 text-white shadow-lg"
                    : "bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-700 border border-neutral-300 hover:from-neutral-200 hover:to-neutral-300 dark:from-neutral-800 dark:to-neutral-900 dark:text-neutral-300 dark:border-neutral-600 dark:hover:from-neutral-700 dark:hover:to-neutral-800 shadow-md hover:shadow-lg"
                }`}
              >
                {t("levels_section")}
              </button>
            </div>

            {/* Tab Content */}
            {guideTab === "ranks" && (
              <div className="animate-in slide-in-from-left-5 duration-300">
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-neutral-200 dark:border-neutral-700">
                        <th className="px-6 py-4 text-left font-semibold text-neutral-900 dark:text-neutral-100">{t("rank_header")}</th>
                        <th className="px-6 py-4 text-center font-semibold text-neutral-900 dark:text-neutral-100">{t("badge_header")}</th>
                        <th className="px-6 py-4 text-left font-semibold text-neutral-900 dark:text-neutral-100">{t("description_header")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {levelData.map((level, index) => (
                        <tr key={level.level} className="group hover:bg-gradient-to-r hover:from-neutral-50 hover:to-neutral-100 dark:hover:from-neutral-800 dark:hover:to-neutral-700 transition-all duration-200 border-b border-neutral-100 dark:border-neutral-800 last:border-b-0">
                          <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">{level.name}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <level.icon size={24} className="text-neutral-700 dark:text-neutral-300 group-hover:scale-110 transition-transform duration-200" />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">{t("achieved_at")} {level.level} {t("streak")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {guideTab === "levels" && (
              <div className="animate-in slide-in-from-right-5 duration-300">
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-b border-neutral-200 dark:border-neutral-700">
                        <th className="px-6 py-4 text-left font-semibold text-neutral-900 dark:text-neutral-100">{t("level_header")}</th>
                        <th className="px-6 py-4 text-center font-semibold text-neutral-900 dark:text-neutral-100">{t("strike_header")}</th>
                        <th className="px-6 py-4 text-left font-semibold text-neutral-900 dark:text-neutral-100">{t("description_header")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {levelData.map((level, index) => (
                        <tr key={level.level} className="group hover:bg-gradient-to-r hover:from-neutral-50 hover:to-neutral-100 dark:hover:from-neutral-800 dark:hover:to-neutral-700 transition-all duration-200 border-b border-neutral-100 dark:border-neutral-800 last:border-b-0">
                          <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">{level.level}</td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <img
                                src={`/images/strike/level-${level.level}.gif`}
                                alt={`Level ${level.level}`}
                                className="w-14 h-14 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-200"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">{level.name} {t("level")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowPopup(null)}
              className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {t("close_button")}
            </button>
          </SpotlightCard>
        </div>
      )}
    </div>
  );
};

export default StrikeGame;