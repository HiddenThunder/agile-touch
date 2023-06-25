import { VercelRequest } from "@vercel/node";
import { VercelResponse } from "@vercel/node";

import { getServerSession } from "next-auth/next";

import { authOptions } from "./nextAuthOptions";

// import supabase from "./supabase";

export const getAuthUser = async (req: VercelRequest, res: VercelResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return null;
  }

  // console.log("supabase auth", await supabase.auth.getUser());

  console.log("session", session);

  // HACK: this is a hack for demo purposes, implement proper auth
  return session.user;
};
