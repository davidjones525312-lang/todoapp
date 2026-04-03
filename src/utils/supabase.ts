import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dkhbjjltlaywryjvtmcy.supabase.co";
const supabaseKey = "sb_publishable_FnIyKIWZtxnZEdCPVMhOYw_h8fvnbRd";

export const supabase = createClient(supabaseUrl, supabaseKey);
