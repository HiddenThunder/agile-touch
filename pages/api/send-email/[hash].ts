import { VercelApiHandler } from "@vercel/node";

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

  // insert email into database
  const { error } = await supabase_ADMIN_UNSAFE_FULL_ACCESS
    .from("emails")
    .insert([{ hash, sub: authUser.id }]);

  // if error, return error
  if (error) {
    console.error(error);
    res.status(500).json({ error: "Error while sending an email" });
    return;
  }

  // nonce will be used to verify the email if we decide to do so
  res.status(200).json({ hash });
};

export default allowCors(handler);
