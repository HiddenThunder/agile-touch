import { VercelRequest } from "@vercel/node";
import { VercelResponse } from "@vercel/node";
import { decodeJwt } from "jose";

import { getServerSession } from "next-auth/next";

import { authOptions } from "./nextAuthOptions";

// import supabase from "./supabase";

export const getAuthUser = async (
  req: VercelRequest,
  res: VercelResponse
): Promise<
  // we love this type
  | {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  | null
  | undefined
> => {
  const authHeader = req.headers["x-fake-header"] as string;
  const jwt = authHeader?.split(" ")[1];

  if (!jwt) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return null;
    }

    // HACK: this is a hack for demo purposes, implement proper auth
    return session.user;
  }

  const { sub } = decodeJwt(jwt);

  // HACK: this is a hack for demo purposes, implement proper auth
  return { id: sub };
};
