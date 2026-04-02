import type { AuthError, Session, User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase/client";
import {
  isSupabaseConfigured,
  supabaseConfigError,
  supabaseProjectId,
  supabasePublishableKey,
  supabaseUrl,
} from "@/lib/supabaseConfig";
import type { StudentSignUpInput, UserProfile } from "@/lib/supabase/types";

const getStringValue = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const noopAuthSubscription = {
  data: {
    subscription: {
      unsubscribe() {},
    },
  },
} as ReturnType<typeof supabase.auth.onAuthStateChange>;

const assertSupabaseConfigured = () => {
  if (!isSupabaseConfigured) {
    throw new Error(
      supabaseConfigError ||
        "Missing Supabase environment variables. Add the Vercel env vars and redeploy.",
    );
  }
};

export const normalizePhoneNumber = (value: string) => {
  const compact = value.replace(/[^\d+]/g, "");

  if (!compact) {
    return "";
  }

  if (compact.startsWith("+")) {
    return compact;
  }

  if (compact.startsWith("251")) {
    return `+${compact}`;
  }

  if (compact.startsWith("0")) {
    return `+251${compact.slice(1)}`;
  }

  return compact;
};

export const formatAuthError = (error: unknown) => {
  const rawMessage =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : "Something went wrong while contacting Supabase.";

  const normalized = rawMessage.toLowerCase();

  if (normalized.includes("networkerror")) {
    return `Supabase could not be reached at ${supabaseUrl}. Check that the project URL and network access are working, then try again.`;
  }
  if (normalized.includes("missing supabase environment variables")) {
    return rawMessage;
  }
  if (normalized.includes("received http 401")) {
    return `Supabase rejected the project key for ${supabaseUrl}. Make sure VITE_SUPABASE_URL and the publishable or anon key belong to the same Supabase project.`;
  }
  if (normalized.includes("supabase health check failed")) {
    return rawMessage;
  }
  if (normalized.includes("failed to fetch")) {
    return `Supabase could not be reached at ${supabaseUrl}. Check your internet connection, DNS, and project URL, then try again.`;
  }
  if (normalized.includes("invalid login credentials")) {
    return "Incorrect email or password. Please try again.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Check your email and confirm your account before signing in.";
  }
  if (normalized.includes("password should be at least")) {
    return "Use a stronger password with at least 6 characters.";
  }
  if (normalized.includes("user already registered")) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (normalized.includes("unable to validate email")) {
    return "Enter a valid email address.";
  }
  if (normalized.includes("database error saving new user")) {
    return "Supabase Auth is still rejecting new users on the project. The app setup is ready, but the remote auth database needs to be repaired in Supabase.";
  }
  if (normalized.includes("database error creating new user")) {
    return "Supabase could not create the new auth user. Check the project auth configuration and database hooks in Supabase.";
  }

  return rawMessage;
};

const throwAuthError = (error: AuthError | Error | null) => {
  if (!error) {
    return;
  }

  throw new Error(formatAuthError(error));
};

const runWithTimeout = async <T>(operation: Promise<T>, timeoutMs: number) => {
  return await Promise.race<T>([
    operation,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => {
        reject(new Error("Supabase health check timed out."));
      }, timeoutMs);
    }),
  ]);
};

const assertSupabaseReachable = async () => {
  assertSupabaseConfigured();

  const healthUrl = `${supabaseUrl}/auth/v1/settings`;

  try {
    const response = await runWithTimeout(
      fetch(healthUrl, {
        method: "GET",
        headers: {
          apikey: supabasePublishableKey,
          Authorization: `Bearer ${supabasePublishableKey}`,
        },
      }),
      8000,
    );

    if (!response.ok) {
      throw new Error(
        `Supabase health check failed for ${supabaseUrl}. Received HTTP ${response.status}.`,
      );
    }
  } catch (error) {
    const detail =
      error instanceof Error && error.message
        ? error.message
        : "Unknown network error while contacting Supabase.";

    throw new Error(
      `Supabase health check failed for ${supabaseUrl}${supabaseProjectId ? ` (project ${supabaseProjectId})` : ""}. ${detail}`,
    );
  }
};

const buildProfileSeed = (
  user: User,
  overrides?: Partial<UserProfile>,
): Partial<UserProfile> => ({
  name: getStringValue(overrides?.name) || getStringValue(user.user_metadata?.name) || undefined,
  email: overrides?.email ?? user.email ?? undefined,
  mobile:
    getStringValue(overrides?.mobile) ||
    normalizePhoneNumber(getStringValue(user.user_metadata?.mobile)) ||
    undefined,
  is_active: overrides?.is_active ?? true,
});

export const authService = {
  async getSession(): Promise<Session | null> {
    if (!isSupabaseConfigured) {
      return null;
    }

    const { data, error } = await supabase.auth.getSession();
    throwAuthError(error);
    return data.session ?? null;
  },

  async getCurrentUser(): Promise<User | null> {
    if (!isSupabaseConfigured) {
      return null;
    }

    const { data, error } = await supabase.auth.getUser();
    throwAuthError(error);
    return data.user ?? null;
  },

  onAuthStateChange(callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) {
    if (!isSupabaseConfigured) {
      return noopAuthSubscription;
    }

    return supabase.auth.onAuthStateChange(callback);
  },

  async signInWithPassword(email: string, password: string) {
    await assertSupabaseReachable();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    throwAuthError(error);
    return data;
  },

  async signUpStudent(input: StudentSignUpInput) {
    await assertSupabaseReachable();

    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim(),
      password: input.password,
      options: {
        data: {
          name: input.fullName.trim(),
          mobile: input.mobile ? normalizePhoneNumber(input.mobile) : "",
        },
      },
    });
    throwAuthError(error);
    return data;
  },

  async sendPasswordReset(email: string) {
    await assertSupabaseReachable();

    const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin,
    });
    throwAuthError(error);
    return data;
  },

  async signOut() {
    if (!isSupabaseConfigured) {
      return;
    }

    const { error } = await supabase.auth.signOut();
    throwAuthError(error);
  },
};

export const userProfileService = {
  async getUserProfile(): Promise<UserProfile | null> {
    const user = await authService.getCurrentUser();
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("auth_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    return data;
  },

  async upsertProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const user = await authService.getCurrentUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          auth_id: user.id,
          ...profileData,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "auth_id",
        },
      )
      .select("*")
      .single();

    if (error) {
      console.error("Error upserting profile:", error);
      throw new Error("Could not save this profile in Supabase.");
    }

    return data;
  },

  async ensureCurrentUserProfile(overrides?: Partial<UserProfile>): Promise<UserProfile | null> {
    const user = await authService.getCurrentUser();
    if (!user) {
      return null;
    }

    const existingProfile = await this.getUserProfile();
    if (existingProfile) {
      return existingProfile;
    }

    try {
      return await this.upsertProfile(buildProfileSeed(user, overrides));
    } catch (error) {
      console.error("Error ensuring user profile:", error);
      return null;
    }
  },

  async updateLastLogin(): Promise<void> {
    const user = await authService.getCurrentUser();
    if (!user) {
      return;
    }

    const { error } = await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("auth_id", user.id);

    if (error) {
      console.error("Error updating last login:", error);
    }
  },
};

export const userService = {
  getCurrentUser: authService.getCurrentUser,
  signOut: authService.signOut,
};

export const checkAuthStatus = async () => {
  try {
    const session = await authService.getSession();
    return { authenticated: Boolean(session), session };
  } catch (error) {
    console.error("Unexpected error checking auth status:", error);
    return {
      authenticated: false,
      error: formatAuthError(error),
    };
  }
};
