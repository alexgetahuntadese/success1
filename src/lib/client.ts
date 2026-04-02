import { createBrowserClient } from "@supabase/ssr";

import { supabasePublishableKey, supabaseUrl } from "@/lib/supabaseConfig";

export function createClient() {
  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
