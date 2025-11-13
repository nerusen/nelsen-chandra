"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { GiFire, GiHolyGrail, GiUpgrade, GiBullseye, GiAncientSword, GiAllForOne, GiBatBlade, GiBoltShield, GiBurningSkull, GiAngelWings, GiAngelOutfit, GiLaurelCrown } from 'react-icons/gi';
import { supabase } from '../config/supabase';

export default function StrikeGamePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [strikeLevel, setStrikeLevel] = useState(0);
  const [upgradeAvailable, setUpgradeAvailable] = useState(true);
  const [restoreCount, setRestoreCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showInfo, setShowInfo] = useState({ type: null, user: null });
  const [showGuide, setShowGuide] = useState(false);
  const { theme } = useTheme();

  // Check authentication status and fetch user data
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      if (user) {
        // Fetch user's strike level and restore count
        const { data: userData, error } = await supabase
          .from('users')
          .select('strike_level, restore_count')
          .eq('id', user.id)
          .single();

        if (userData) {
          setStrikeLevel(userData.strike_level);
          setRestoreCount(userData.restore_count);
        }

        // Fetch leaderboard data
        const { data: leaderboardData, error: leaderboardError } = await supabase
          .from('leaderboard')
          .select('position, strike_name, username, badge')
          .order('position');

        if (leaderboardData) {
          setLeaderboard(leaderboardData);
        }
      }
    };

    checkAuth();
  }, []);

  // Prevent access if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl mb-4">Please log in to access Strike Game</p>
        <a href="/login" className="text-blue-500 hover:underline">
          Go to Login
        </a>
      </div>
    );
  }

  // Function to handle strike upgrade
  const handleUpgradeStrike = () => {
    // Implement upgrade logic here
    // Check if upgrade is available (once per day)
    // Update strike level and timestamp
    // Show appropriate popup
  };

  // Function to handle restore strike
  const handleRestoreStrike = () => {
    // Implement restore logic here
    // Check restore count (max 3 per month)
    // Reset strike level if exceeded
  };

  // Function to show leaderboard popup
  const showLeaderboardPopup = () => {
    setShowLeaderboard(true);
    // Fetch leaderboard data from Supabase
  };

  // Function to show info popup
  const showInfoPopup = (type, user) => {
    setShowInfo({ type, user });
  };

  // Function to close popups
  const closePopup = () => {
    setShowLeaderboard(false);
    setShowInfo({ type: null, user: null });
    setShowGuide(false);
  };

  return (
    <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Main Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Strike Game</h1>
        <p className="text-lg mb-4">Upgrade your strike level and track your progress</p>
        <hr className="border-gray-500" />
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Side - Profile and Buttons */}
        <div className="md:w-1/3">
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <img src="/default-avatar.png" alt="Profile" className="w-24 h-24 rounded-full mb-2" />
            <p className="font-semibold">Username</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <button 
              className={`flex items-center gap-2 px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={handleUpgradeStrike}
            >
              <GiUpgrade size={20} />
              Strike Upgrade
            </button>
            
            <button 
              className={`flex items-center gap-2 px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={showLeaderboardPopup}
            >
              <GiHolyGrail size={20} />
              Leaderboard
            </button>
            
            <button 
              className={`flex items-center gap-2 px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={handleRestoreStrike}
            >
              <GiFire size={20} />
              Restore Strike <span className="ml-2 text-sm">{restoreCount}/3</span>
            </button>
          </div>
        </div>

        {/* Right Side - GIF and Info Bubbles */}
        <div className="md:w-2/3">
          {/* GIF Display */}
          <div className="mb-6">
            <img 
              className="w-full max-w-md mx-auto" 
              style={{ width: '480px', height: '480px' }}
            />
          </div>

          {/* Info Bubbles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => showInfoPopup('strikeName', { name: 'Player1', level: strikeLevel })}
            >
              <p className="font-semibold">Strike Name</p>
              <p className="text-sm">Player1</p>
            </div>
            
            <div 
              className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => showInfoPopup('userRank', { rank: 1, badge: <GiBullseye size={30} /> })}
            >
              <p className="font-semibold">User Rank</p>
              <p className="text-sm">Rank 1</p>
            </div>
            
            <div 
              className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => showInfoPopup('userName', { username: 'nelsen' })}
            >
              <p className="font-semibold">User Name</p>
              <p className="text-sm">nelsen</p>
            </div>
            
            <div 
              className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={() => showInfoPopup('leaderboard', { position: 1 })}
            >
              <p className="font-semibold">Leaderboard</p>
              <p className="text-sm">#1</p>
            </div>
          </div>

          {/* Guide Button */}
          <div className="mt-6">
            <button 
              className={`flex items-center gap-2 px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}
              onClick={() => setShowGuide(true)}
            >
              <GiFire size={20} />
              Guide
            </button>
          </div>
        </div>
      </div>

      {/* Leaderboard Popup */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-2xl p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-500">
                    <th className="px-4 py-2 text-left">Position</th>
                    <th className="px-4 py-2 text-left">Strike Name</th>
                    <th className="px-4 py-2 text-left">Username</th>
                    <th className="px-4 py-2 text-left">Badge</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((user, index) => (
                    <tr key={index} className={`border-b border-gray-500 ${index < 3 ? 'bg-yellow-100 dark:bg-yellow-900' : ''}`}>
                      <td className="px-4 py-2 font-semibold">{index + 1}</td>
                      <td className="px-4 py-2">{user.strike_name}</td>
                      <td className="px-4 py-2">{user.username}</td>
                      <td className="px-4 py-2">{user.badge}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button 
                className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                onClick={closePopup}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Popups */}
      {showInfo.type === 'strikeName' && showInfo.user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-md p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-2">Strike Name</h3>
            <p className="mb-4">Your current strike name is: {showInfo.user.name}</p>
            <button 
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              onClick={() => {
                // Implement name change logic here
                closePopup();
              }}
            >
              Change Name
            </button>
            <button 
              className="mt-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showInfo.type === 'userRank' && showInfo.user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-md p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-2">User Rank</h3>
            <p className="mb-4">Your current rank is: {showInfo.user.rank}</p>
            <div className="flex justify-center">
              {showInfo.user.badge}
            </div>
            <button 
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showInfo.type === 'userName' && showInfo.user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-md p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-2">User Name</h3>
            <p className="mb-4">Your username is: {showInfo.user.username}</p>
            <button 
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showInfo.type === 'leaderboard' && showInfo.user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-md p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-2">Leaderboard Position</h3>
            <p className="mb-4">You are currently ranked: {showInfo.user.position}</p>
            <button 
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Guide Popup */}
      {showGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-2xl p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-2xl font-bold mb-4">Game Guide</h2>
            
            {/* Rank Information */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Rank Information</h3>
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-500">
                    <th className="px-4 py-2 text-left">Rank</th>
                    <th className="px-4 py-2 text-left">Badge</th>
                    <th className="px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-500">
                    <td className="px-4 py-2">1</td>
                    <td className="px-4 py-2"><GiBullseye size={30} /></td>
                    <td className="px-4 py-2">Unknown</td>
                  </tr>
                  <tr className="border-b border-gray-500">
                    <td className="px-4 py-2">2</td>
                    <td className="px-4 py-2"><GiAncientSword size={30} /></td>
                    <td className="px-4 py-2">Beginner</td>
                  </tr>
                  <tr className="border-b border-gray-500">
                    <td className="px-4 py-2">8</td>
                    <td className="px-4 py-2"><GiAllForOne size={30} /></td>
                    <td className="px-4 py-2">Explorer</td>
                  </tr>
                  <tr className="border-b border-gray-500">
                    <td className="px-4 py-2">16</td>
                    <td className="px-4 py-2"><GiBatBlade size={30} /></td>
                    <td className="px-4 py-2">Adventurer</td>
                  </tr>
                  <tr className="border-b border-gray-500">
                    <td className="px-4 py-2">31</td>
                    <td className="px-4 py-2"><GiBoltShield size={30} /></td>
                    <td className="px-4 py-2">Hero</td>
                  </tr>
                  <tr className="border-b border-gray-500">
                    <td className="px-4 py-2">51</td>
                    <td className="px-4 py-2"><GiBurningSkull size={30} /></td>
                    <td className="px-4 py-2">Knight</td>
                  </tr>
                  <tr className="border-b border-gray-500">
                    <td className="px-4 py-2">76</td>
                    <td className="px-4 py-2"><GiAngelWings size={30} /></td>
                    <td className="px-4 py-2">Legend</td>
                  </tr>
                  <tr className="border-b border-gray-500">
                    <td className="px-4 py-2">101</td>
                    <td className="px-4 py-2"><GiAngelOutfit size={30} /></td>
                    <td className="px-4 py-2">Mystic</td>
                  </tr>
                  <tr className="border-b border-gray-500">
                    <td className="px-4 py-2">151</td>
                    <td className="px-4 py-2"><GiLaurelCrown size={30} /></td>
                    <td className="px-4 py-2">God</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Level Information */}
            <div>
              <h3 className="text-xl font-semibold mb-2">Level Information</h3>
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-500">
                    <th className="px-4 py-2 text-left">Level</th>
                    <th className="px-4 py-2 text-left">Strike Image</th>
                    <th className="px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-500">
                    <td className="px-4 py-2">0</td>
                    <td className="px-4 py-2"><GiBullseye size={30} /></td>
                    <td className="px-4 py-2">Unknown</td>
                  </tr>
                  <tr className="border-b border-gray-500">
                    <td className="px-4 py-2">1</td>
                    <td className="px-4 py-2"><GiAncientSword size={30} /></td>
                    <td className="px-4 py-2">Beginner</td>
                  </tr>
                  <tr className="border-b border-gray-500">
                    <td className="px-4 py-2">7</td>
                    <td className="px-4 py-2"><GiAllForOne size={30} /></td>
                    <td className="px-4 py-2">Explorer</td>
                  </tr>
                  <tr className="border-b border-gray-500">
                    <td className="px-4 py-2">15</td>
                    <td className="px-4 py-2"><GiBatBlade size={30} /></td>
                    <td className="px-4 py-2">Adventurer</td>
                  </tr>
                  <tr className="border-b border-gray-500">
                    <td className="px-4 py-2">30</td>
                    <td className="px-4 py-2"><GiBoltShield size={30} /></td>
                    <td className="px-4 py-2">Hero</td>
                  </tr>
                  <tr className="border-b border-gray-500">
                    <td className="px-4 py-2">50</td>
                    <td className="px-4 py-2"><GiBurningSkull size={30} /></td>
                    <td className="px-4 py-2">Knight</td>
                  </tr>
                  <tr className="border-b border-gray-500">
                    <td className="px-4 py-2">75</td>
                    <td className="px-4 py-2"><GiAngelWings size={30} /></td>
                    <td className="px-4 py-2">Legend</td>
                  </tr>
                  <tr className="border-b border-gray-500">
                    <td className="px-4 py-2">100</td>
                    <td className="px-4 py-2"><GiAngelOutfit size={30} /></td>
                    <td className="px-4 py-2">Mystic</td>
                  </tr>
                  <tr className="border-b border-gray-500">
                    <td className="px-4 py-2">150</td>
                    <td className="px-4 py-2"><GiLaurelCrown size={30} /></td>
                    <td className="px-4 py-2">God</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <button 
              className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
