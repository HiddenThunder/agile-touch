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

  // get sender from database
  const sender = (await supabase.from("senders").insert("*").match({
    hash: hash,
  })) as unknown as {
    sub: string;
    rep: string;
    created_at: string;
  };

  // if user doesn't exist, return error
  if (!sender) {
    res.status(200).json({ sender: {} });
    return;
  }

  if (Number(sender.rep) < 0) {
    res.status(404).json({ error: "User is banned" });
    return;
  }

  res.status(200).json({ sender });
};

export default allowCors(handler);
