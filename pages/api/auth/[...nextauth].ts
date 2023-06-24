import NextAuth, { Profile, Session, TokenSet, User } from "next-auth";
import { JWT } from "next-auth/jwt/types";
import jwt_decode from "jwt-decode";

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
      userinfo: `${process.env.WORLDCOIN_DOMAIN}/userinfo`,
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
};

// @ts-ignore
export default NextAuth(authOptions);
