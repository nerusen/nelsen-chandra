"use client";

import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FaSpotify, FaSignOutAlt } from "react-icons/fa";

import Container from "@/common/components/elements/Container";
import Button from "@/common/components/elements/Button";
import Card from "@/common/components/elements/Card";
import Breakline from "@/common/components/elements/Breakline";

interface SpotifyProfile {
  id: string;
  display_name: string;
  images: { url: string }[];
  followers: { total: number };
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  tracks: { total: number };
  external_urls: { spotify: string };
}

const MusicRoom = () => {
  const { data: session, status } = useSession();
  const t = useTranslations("MusicRoom");
  const [ownerProfile, setOwnerProfile] = useState<SpotifyProfile | null>(null);
  const [ownerPlaylists, setOwnerPlaylists] = useState<Playlist[]>([]);
  const [userProfile, setUserProfile] = useState<SpotifyProfile | null>(null);
  const [userPlaylists, setUserPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = status === "authenticated" && session?.user;

  useEffect(() => {
    if (isLoggedIn) {
      fetchSpotifyData();
    } else {
      fetchOwnerData();
    }
  }, [isLoggedIn]);

  const fetchOwnerData = async () => {
    try {
      const profileRes = await fetch("/api/spotify/owner-profile");
      const profileData = await profileRes.json();
      setOwnerProfile(profileData);

      const playlistsRes = await fetch("/api/spotify/owner-playlists");
      const playlistsData = await playlistsRes.json();
      setOwnerPlaylists(playlistsData.items || []);
    } catch (error) {
      console.error("Error fetching owner data:", error);
    }
  };

  const fetchSpotifyData = async () => {
    setLoading(true);
    try {
      // Fetch owner's public data
      await fetchOwnerData();

      // Fetch user's private data
      const userProfileRes = await fetch("/api/spotify/profile");
      const userProfileData = await userProfileRes.json();
      setUserProfile(userProfileData);

      const userPlaylistsRes = await fetch("/api/spotify/playlists");
      const userPlaylistsData = await userPlaylistsRes.json();
      setUserPlaylists(userPlaylistsData.items || []);
    } catch (error) {
      console.error("Error fetching Spotify data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    window.location.href = "/api/auth/signin/spotify";
  };

  const handleLogout = () => {
    signOut();
  };

  const ProfileCard = ({ profile, title, isUser = false }: { profile: SpotifyProfile; title: string; isUser?: boolean }) => (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="flex items-center space-x-3">
        {profile.images?.[0] && (
          <img
            src={profile.images[0].url}
            alt={profile.display_name}
            className="w-12 h-12 rounded-full"
          />
        )}
        <div>
          <h4 className="font-medium text-sm">{profile.display_name}</h4>
          {!isUser && (
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              {profile.followers?.total} followers
            </p>
          )}
        </div>
      </div>
    </Card>
  );

  const PlaylistCard = ({ playlist }: { playlist: Playlist }) => (
    <Card className="p-3 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-3 mb-3">
        {playlist.images?.[0] && (
          <img
            src={playlist.images[0].url}
            alt={playlist.name}
            className="w-12 h-12 rounded-lg flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{playlist.name}</h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
            {playlist.description}
          </p>
          <p className="text-xs text-neutral-500">
            {playlist.tracks.total} tracks
          </p>
        </div>
        <Button
          onClick={() => window.open(playlist.external_urls.spotify, "_blank")}
          className="text-xs px-2 py-1 flex-shrink-0"
        >
          Open
        </Button>
      </div>
      <div className="relative overflow-hidden rounded-lg">
        <iframe
          src={`https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&theme=0`}
          width="100%"
          height="352"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-lg"
        ></iframe>
      </div>
    </Card>
  );

  if (!isLoggedIn) {
    return (
      <Container>
        <div className="text-center py-8">
          <h2 className="text-xl font-bold mb-3">{t("loginRequired")}</h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            {t("loginDescription")}
          </p>
          <Button
            onClick={handleLogin}
            className="flex w-full items-center justify-center border !bg-black py-2.5 shadow-sm transition duration-300 hover:scale-105 active:scale-100 text-white"
          >
            <FaSpotify size={18} className="text-green-400" />
            <span>Login with Spotify</span>
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {userProfile && (
        <div className="flex items-center gap-2 text-sm">
          <img
            src={userProfile.images?.[0]?.url || "/default-avatar.png"}
            alt={userProfile.display_name}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-medium">{userProfile.display_name}</span>
        </div>
      )}
      <Button
        onClick={handleLogout}
        className="group flex w-fit items-center gap-2 rounded-lg border border-neutral-400 bg-neutral-100 px-3 py-2 text-sm transition duration-100 hover:text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:text-neutral-200"
      >
        <FaSignOutAlt size={16} />
        Sign Out
      </Button>
    </div>
  );
};

export default MusicRoom;
