import type { Json } from "@/integrations/supabase/types";

const asObject = (value: Json | null | undefined) => {
  if (!value || Array.isArray(value) || typeof value !== "object") {
    return null;
  }

  return value as Record<string, Json | undefined>;
};

export const getPreferenceRole = (preferences: Json | null | undefined) => {
  const objectValue = asObject(preferences);
  const role = objectValue?.role;

  return typeof role === "string" ? role.trim().toLowerCase() : "";
};

export const isAdminPreferences = (preferences: Json | null | undefined) =>
  getPreferenceRole(preferences) === "admin";

export const setPreferenceRole = (
  preferences: Json | null | undefined,
  role: string | null,
) => {
  const nextPreferences = { ...(asObject(preferences) ?? {}) };

  if (!role) {
    delete nextPreferences.role;
    return nextPreferences;
  }

  nextPreferences.role = role;
  return nextPreferences;
};
