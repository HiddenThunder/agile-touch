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

  console.log("hash", hash);

  const { data: email, error: error1 } = await supabase_ADMIN_UNSAFE_FULL_ACCESS
    .from("emails")
    .select("sub")
    .eq("hash", hash)
    .limit(1)
    .maybeSingle();

  if (error1) {
    console.error("error1", error1);

    res.status(500).json({ error: "Internal server error" });
    return;
  }

  if (!email) {
    res.status(200).json({ rep: 0, isRealHuman: false });
    return;
  }

  const { data: sender, error: error2 } =
    await supabase_ADMIN_UNSAFE_FULL_ACCESS
      .from("reputation")
      .select("rep")
      .eq("sub", email.sub)
      .limit(1)
      .maybeSingle();

  if (error2) {
    console.error("error2", error2);

    res.status(500).json({ error: "Internal server error" });
    return;
  }

  const isRealHuman = !!email.sub;

  // if user doesn't exist, return default rep
  if (!sender || !sender.rep) {
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
