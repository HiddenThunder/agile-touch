import { VercelApiHandler, VercelRequest, VercelResponse } from "@vercel/node";

import { supabase_ADMIN_UNSAFE_FULL_ACCESS } from "../../../services/supabase";
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
  const [senderRes, emailRes] = await Promise.all([
    supabase_ADMIN_UNSAFE_FULL_ACCESS.from("reputation").select("hash").match({
      hash,
    }),
    supabase_ADMIN_UNSAFE_FULL_ACCESS.from("emails").select("sub").match({
      hash,
    }),
  ]);

  const sender = senderRes.data?.[0] as unknown as {
    sub: string;
    rep: string;
    created_at: string;
  };

  const isRealHuman =
    emailRes.data?.length && emailRes.data.length > 0 ? true : false;
  // if user doesn't exist, return error
  if (!sender) {
    res.status(200).json({ rep: 5, isRealHuman });
    return;
  }

  if (Number(sender.rep) < 0) {
    res.status(404).json({ error: "User is banned" });
    return;
  }

  res.status(200).json({ rep: sender.rep, isRealHuman });
};

export default allowCors(handler);
