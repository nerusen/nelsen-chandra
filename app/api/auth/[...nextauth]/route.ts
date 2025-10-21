import NextAuth from "next-auth";
import type { Account, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import SpotifyProvider from "next-auth/providers/spotify";

interface SpotifyProfile {
  display_name: string;
  email: string;
  images: { url: string }[];
}

// Custom TikTok Provider
function TikTokProvider(options: any) {
  return {
    id: "tiktok",
    name: "TikTok",
    type: "oauth",
    authorization: {
      url: "https://www.tiktok.com/auth/authorize/",
      params: {
        scope: "user.info.basic",
        response_type: "code",
      },
    },
    token: {
      url: "https://open-api.tiktok.com/oauth/access_token/",
      async request({ client, params, checks, provider }: any) {
        const response = await fetch(provider.token.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_key: client.client_id,
            client_secret: client.client_secret,
            code: params.code,
            grant_type: "authorization_code",
            redirect_uri: client.redirect_uri,
          }),
        });

        const tokens = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch access token");
        }

        return {
          tokens,
        };
      },
    },
    userinfo: {
      url: "https://open-api.tiktok.com/user/info/",
      async request({ tokens, client }: any) {
        const response = await fetch(`${this.url}?access_token=${tokens.access_token}&open_id=${tokens.open_id}`, {
          headers: {
            "Authorization": `Bearer ${tokens.access_token}`,
          },
        });

        const userInfo = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        return userInfo.data.user;
      },
    },
    profile(profile: any) {
      return {
        id: profile.open_id,
        name: profile.display_name,
        email: profile.email || null,
        image: profile.avatar_url,
      };
    },
    options,
  };
}

async function refreshAccessToken(token: JWT) {
  try {
    const url = "https://accounts.spotify.com/api/token";
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "user-read-private user-read-email playlist-read-private playlist-read-collaborative",
        },
      },
    }),
    TikTokProvider({
      clientId: process.env.TIKTOK_CLIENT_ID as string,
      clientSecret: process.env.TIKTOK_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/music-room",
    error: "/music-room",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: any) {
      // Allow OAuth without email verification
      return true;
    },
    async jwt({ token, account }: { token: JWT; account?: Account | null }) {
      if (account?.provider === "spotify") {
        const profile = account.profile as SpotifyProfile;
        token.name = profile.display_name;
        token.email = profile.email;
        token.picture = profile.images?.[0]?.url;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000;
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.name) session.user.name = token.name;
      if (token?.email) session.user.email = token.email;
      if (token?.picture) session.user.image = token.picture;
      if (token?.accessToken) {
        (session as any).accessToken = token.accessToken;
        (session as any).refreshToken = token.refreshToken;
        (session as any).accessTokenExpires = token.accessTokenExpires;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

          
