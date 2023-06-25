import { VercelApiHandler } from "@vercel/node";
import supabase from "../../services/supabase";

const handler: VercelApiHandler = async (req, res) => {
  // get email hash and nonce from query params
  const { hash, nonce } = req.query;

  // get user from database
  const user = await supabase.from("users").select("*").match({
    email_hash: hash,
  });

  // if user doesn't exist, return error
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({ message: "User verified" });
};

export default handler;
