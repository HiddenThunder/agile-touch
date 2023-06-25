import {
  Account,
  AuthOptions,
  Awaitable,
  Profile,
  Session,
  User,
} from "next-auth";
import { JWT } from "next-auth/jwt/types";

import supabase from "../services/supabase";
import { AdapterUser } from "next-auth/adapters";

export const authOptions: AuthOptions = {
  providers: [
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      clientId: process.env.WORLDCOIN_APP_ID,
      clientSecret: process.env.WORLDCOIN_APP_SECRET,
      wellKnown: `${process.env.WORLDCOIN_DOMAIN}/.well-known/openid-configuration`,
      token: `${process.env.WORLDCOIN_DOMAIN}/token`,
      authorization: `${process.env.WORLDCOIN_DOMAIN}/authorize`,
      userinfo: {
        url: `${process.env.WORLDCOIN_DOMAIN}/userinfo`,
        // The result of this method will be the input to the `profile` callback.
        async request(context: any) {
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
      profile(profile: {
        sub: string;
        name: string;
        email: string;
        id: string;
      }) {
        console.log({ profile });
        return {
          id: profile.sub,
          name: profile.name || "Worldcoin User",
          email: `${profile.sub}@id.worldcoinemail.org`,
          image:
            "https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/000/864/329/datas/original.png",
        };
      },
    },
  ],
  callbacks: {
    jwt(params: {
      token: JWT;
      user: User | AdapterUser;
      account: Account | null;
      profile?: Profile | undefined;
      trigger?: "signIn" | "signUp" | "update" | undefined;
      isNewUser?: boolean | undefined;
      session?: any;
    }): Awaitable<JWT> {
      const { token, account, user } = params;
      console.log({ token, account, user });

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

      return token;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: Session;
      token: JWT;
      user: User;
    }) {
      try {
        // HACK: bruh i dont know what is wrong with you
        // but please fix creating users
        // we need to integrate into supabase flow properly
        const { data, error } = await supabase.auth.signUp({
          email: token.email as string,
          // HACK: !!!
          password: "12345678",
          options: {
            data: {
              id: token.sub,
              name: token.name,
              image: token.picture,
            },
          },
        });

        if (error) {
          console.error("USER WAS NOT SAVED", { error });
        }

        console.log("USER WAS SAVED", { data });
      } catch (error) {
        console.error("USER WAS NOT SAVED", { error });
      }

      // Send properties to the client, like an access_token from a provider.
      // (session as any).accessToken = token.access_token as string;
      // (session as any).error = token.error as string;
      session.user = token.user as User;

      try {
        const { data, error } = await supabase.auth.setSession({
          access_token: token.access_token as string,
          refresh_token: token.refresh_token as string,
        });

        if (error) {
          console.error("USER SESSION WAS NOT SET", { error });
        }

        console.log("USER SESSION WAS SET", { data });
      } catch (error) {
        console.error("USER SESSION WAS NOT SET", { error });
      }

      return session;
    },
  },
};
