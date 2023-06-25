import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gvxtbasijhiihafyqsbl.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  throw new Error("Missing SUPABASE_KEY");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const supabase_ADMIN_UNSAFE_FULL_ACCESS = (() => {
  const service_role_key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  const supabase = createClient(supabaseUrl, service_role_key);

  return supabase;
})();

export default supabase;
