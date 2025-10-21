"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

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

  const ProfileCard = ({ profile, title }: { profile: SpotifyProfile; title: string }) => (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="flex items-center space-x-4">
        {profile.images?.[0] && (
          <img
            src={profile.images[0].url}
            alt={profile.display_name}
            className="w-16 h-16 rounded-full"
          />
        )}
        <div>
          <h4 className="font-medium">{profile.display_name}</h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {profile.followers?.total} followers
          </p>
        </div>
      </div>
    </Card>
  );

  const PlaylistCard = ({ playlist }: { playlist: Playlist }) => (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4">
        {playlist.images?.[0] && (
          <img
            src={playlist.images[0].url}
            alt={playlist.name}
            className="w-16 h-16 rounded-lg"
          />
        )}
        <div className="flex-1">
          <h4 className="font-medium truncate">{playlist.name}</h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
            {playlist.description}
          </p>
          <p className="text-xs text-neutral-500">
            {playlist.tracks.total} tracks
          </p>
        </div>
        <Button
          onClick={() => window.open(playlist.external_urls.spotify, "_blank")}
          className="text-sm"
        >
          Open in Spotify
        </Button>
      </div>
    </Card>
  );

  if (!isLoggedIn) {
    return (
      <Container>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">{t("loginRequired")}</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {t("loginDescription")}
          </p>
          <Button onClick={handleLogin} className="bg-green-600 hover:bg-green-700">
            Login with Spotify
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-8">
        {/* Owner's Profile and Playlists */}
        <div>
          <h2 className="text-2xl font-bold mb-6">{t("ownerContent")}</h2>
          {ownerProfile && <ProfileCard profile={ownerProfile} title={t("ownerProfile")} />}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">{t("ownerPlaylists")}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {ownerPlaylists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          </div>
        </div>

        <Breakline />

        {/* User's Profile and Playlists */}
        <div>
          <h2 className="text-2xl font-bold mb-6">{t("userContent")}</h2>
          {userProfile && <ProfileCard profile={userProfile} title={t("userProfile")} />}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">{t("userPlaylists")}</h3>
            {loading ? (
              <p>Loading your playlists...</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {userPlaylists.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default MusicRoom;
