import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gvxtbasijhiihafyqsbl.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  throw new Error("Missing SUPABASE_KEY");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
