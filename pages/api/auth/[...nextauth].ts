import NextAuth, { Profile, Session, TokenSet, User } from "next-auth";
import { JWT } from "next-auth/jwt/types";

export const authOptions = {
  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      clientId: process.env.WORLDCOIN_APP_ID,
      clientSecret: process.env.WORLDCOIN_APP_SECRET,
      wellKnown: `${process.env.WORLDCOIN_DOMAIN}/.well-known/openid-configuration`,
      token: `${process.env.WORLDCOIN_DOMAIN}/token`, // Replace with actual endpoint
      authorization: `${process.env.WORLDCOIN_DOMAIN}/authorize`,
      userinfo: {
        url: `${process.env.WORLDCOIN_DOMAIN}/userinfo`,
        // The result of this method will be the input to the `profile` callback.
        async request(context: {
          userinfo: any;
          provider: { userinfo: { url: RequestInfo | URL } };
          tokens: { access_token: string };
        }) {
          // context contains useful properties to help you make the request.
          const profileRes = await fetch(context.provider.userinfo.url, {
            headers: {
              Authorization: `Bearer ${context.tokens.access_token}`,
            },
          });
          const profile = await profileRes.json();
          console.log({ profile });
          return profile;
        },
      },
      idToken: true,
      checks: ["pkce", "state"],
      profile(profile: { sub: string; name: string; email: string }) {
        console.log({ profile });
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image:
            "https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/000/864/329/datas/original.png",
        };
      },
    },
  ],
  callbacks: {
    async jwt({
      token,
      account,
      user,
    }: {
      token: JWT;
      account: {
        access_token: string;
        refresh_token: string;
        id_token: string;
      };
      user: User;
      profile: Profile;
    }) {
      // Persist the OAuth access_token to the token right after signin
      // we are authorizing with worldcoin we will have the encoded tokens
      if (account) {
        return {
          access_token: account.access_token,
          expires_at: token.exp,
          refresh_token: account.refresh_token,
          name: token.name,
          picture: token.picture,
          email: token.email,
          id: token.sub,
          token,
          user,
        };
      } else if (Date.now() < (token.exp as number) * 1000) {
        // If the access token has not expired yet, return it
        return token;
      }
    },
    async session({
      session,
      token,
    }: {
      session: Session & { accessToken: string; user: User; error: string };
      token: JWT;
    }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.access_token as string;
      session.user = token.user as User;
      session.error = token.error as string;

      return session;
    },
  },
};

// @ts-ignore
export default NextAuth(authOptions);
