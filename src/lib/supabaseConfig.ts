const rawSupabaseProjectId = import.meta.env.VITE_SUPABASE_PROJECT_ID?.trim();
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();

const getProjectRefFromUrl = (url?: string) => {
  if (!url) {
    return "";
  }

  const match = url.trim().match(/^https:\/\/([a-z0-9-]+)\.supabase\.co/i);
  return match?.[1] ?? "";
};

const decodeBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  if (typeof atob === "function") {
    return atob(padded);
  }

  return "";
};

const getProjectRefFromKey = (key?: string) => {
  if (!key) {
    return "";
  }

  const parts = key.split(".");
  if (parts.length !== 3) {
    return "";
  }

  try {
    const payload = JSON.parse(decodeBase64Url(parts[1])) as { ref?: unknown };
    return typeof payload.ref === "string" ? payload.ref : "";
  } catch {
    return "";
  }
};

const getSupabasePublishableKey = () => {
  const candidates = [
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim(),
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY?.trim(),
    import.meta.env.VITE_SUPABASE_ANON_KEY?.trim(),
  ].filter((value): value is string => Boolean(value));

  const projectRef = rawSupabaseProjectId || getProjectRefFromUrl(rawSupabaseUrl);

  if (projectRef) {
    const matchingCandidate = candidates.find((candidate) => getProjectRefFromKey(candidate) === projectRef);
    if (matchingCandidate) {
      return matchingCandidate;
    }
  }

  return candidates[0] ?? "";
};

const rawSupabasePublishableKey = getSupabasePublishableKey();

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
