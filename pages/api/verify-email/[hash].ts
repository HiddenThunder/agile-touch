import { VercelApiHandler, VercelRequest, VercelResponse } from "@vercel/node";

import supabase from "../../../services/supabase";
import { getAuthUser } from "../../../services/auth";
import { allowCors } from "../../../services/cors";

export const handler: VercelApiHandler = async (req, res) => {
  // get email hash and nonce from query params
  const { hash } = req.query;

  const authUser = await getAuthUser(req, res);

  if (!authUser) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // get user from database
  const user = await supabase.from("users").insert("*").match({
    email_hash: hash,
  });

  // if user doesn't exist, return error
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.status(200).json({ user: authUser });
};

export default allowCors(handler);

