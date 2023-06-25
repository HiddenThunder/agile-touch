import { VercelRequest, VercelResponse } from "@vercel/node";

import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

import supabase from "../../services/supabase";
import { getAuthUser } from "../../services/auth";

const handler = async (req: VercelRequest, res: VercelResponse) => {
  // get email hash and nonce from query params
  const { hash } = req.query;

  //@ts-ignore
  const session = await getServerSession(req, res, authOptions);

  const authUser = getAuthUser(session);

  if (!authUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // get user from database
  const user = await supabase.from("users").insert("*").match({
    email_hash: hash,
  });

  // if user doesn't exist, return error
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({ message: "User verified" });
};

export default handler;
