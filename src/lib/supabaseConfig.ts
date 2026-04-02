const rawSupabaseProjectId = import.meta.env.VITE_SUPABASE_PROJECT_ID?.trim();
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const rawSupabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim() ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ||
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(
  rawSupabaseUrl && rawSupabasePublishableKey,
);

export const supabaseConfigError = isSupabaseConfigured
  ? null
  : "Missing Supabase environment variables. In Vercel, add VITE_SUPABASE_URL and one Supabase publishable key such as VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY.";

export const supabaseProjectId = rawSupabaseProjectId ?? "";
export const supabaseUrl = rawSupabaseUrl || "https://placeholder.invalid";
export const supabasePublishableKey =
  rawSupabasePublishableKey || "missing-supabase-publishable-key";
