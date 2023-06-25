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
  const sender = (
    await supabase_ADMIN_UNSAFE_FULL_ACCESS.from("emails").select().match({
      hash,
    })
  ).data?.[0] as unknown as {
    sub: string;
  };

  // if user doesn't exist, return error
  if (!sender) {
    res.status(404).json({ error: "Sender not found" });
    return;
  }

  const [downvote, senderInfo] = await Promise.all([
    supabase_ADMIN_UNSAFE_FULL_ACCESS.from("downvotes").select("*").match({
      recipient: authUser.id,
      sender: sender.sub,
    }),
    supabase_ADMIN_UNSAFE_FULL_ACCESS.from("reputation").select("*").match({
      sub: sender.sub,
    }),
    ,
  ]);

  let rep = senderInfo.data?.[0]?.rep || 5;

  if (downvote.data?.length) {
    res.status(405).json({ error: "Cannot downvote the same user twice" });
    return;
  }

  await Promise.all([
    supabase_ADMIN_UNSAFE_FULL_ACCESS
      .from("reputation")
      .insert({ rep: rep - 1, sub: sender.sub })
      .match({
        hash: hash,
      }),
    supabase_ADMIN_UNSAFE_FULL_ACCESS
      .from("downvotes")
      .insert([{ sender: sender.sub, hash: hash, recipient: authUser.id }]),
  ]);

  res.status(200).json({ sender, recipient: authUser });
};

export default allowCors(handler);
