"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

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

const MusicRoomContent = () => {
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
        <a
          href={playlist.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex-shrink-0"
        >
          Open
        </a>
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
      <div className="space-y-6">
        {/* Owner's Profile and Playlists */}
        <div>
          <h2 className="text-xl font-bold mb-4">{t("ownerContent")}</h2>
          {ownerProfile && <ProfileCard profile={ownerProfile} title={t("ownerProfile")} />}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-3">{t("ownerPlaylists")}</h3>
            <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
              {ownerPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Owner's Profile and Playlists */}
      <div>
        <h2 className="text-xl font-bold mb-4">{t("ownerContent")}</h2>
        {ownerProfile && <ProfileCard profile={ownerProfile} title={t("ownerProfile")} />}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-3">{t("ownerPlaylists")}</h3>
          <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
            {ownerPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </div>
      </div>

      <Breakline />

      {/* User's Profile and Playlists */}
      <div>
        <h2 className="text-xl font-bold mb-4">{t("userContent")}</h2>
        {userProfile && <ProfileCard profile={userProfile} title={t("userProfile")} isUser />}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-3">{t("userPlaylists")}</h3>
          <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
            {userPlaylists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicRoomContent;
