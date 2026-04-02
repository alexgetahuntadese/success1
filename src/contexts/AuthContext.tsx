import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";

import { AuthContext, type AuthContextValue } from "@/contexts/auth-context";
import { isAdminPreferences } from "@/lib/authRoles";
import {
  isSupabaseConfigured,
  supabaseConfigError,
} from "@/lib/supabaseConfig";
import type { AppSession } from "@/lib/supabase/types";
import { updateStudentName } from "@/lib/performanceUtils";
import {
  authService,
  userProfileService,
  userService,
  type UserProfile,
} from "@/services/supabaseServiceFixed";
import { INACTIVE_ACCOUNT_NOTICE_KEY } from "@/lib/authStorage";

const getStringValue = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const deriveDisplayName = (user: User | null, profile: UserProfile | null) => {
  const profileName = getStringValue(profile?.name);
  if (profileName) return profileName;

  const metadataName = getStringValue(user?.user_metadata?.name);
  if (metadataName) return metadataName;

  const email = getStringValue(user?.email);
  if (email) return email.split("@")[0];

  return "Student";
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AppSession | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncPerformanceName = useCallback((nextUser: User | null, nextProfile: UserProfile | null) => {
    const nextName = deriveDisplayName(nextUser, nextProfile);
    if (nextName && nextName !== "Student") {
      updateStudentName(nextName);
    }
  }, []);

  const loadProfile = useCallback(async (nextUser: User | null) => {
    if (!nextUser) {
      setProfile(null);
      return null;
    }

    const nextProfile = await userProfileService.ensureCurrentUserProfile({
      name: getStringValue(nextUser.user_metadata?.name) || undefined,
      email: nextUser.email,
      mobile: getStringValue(nextUser.user_metadata?.mobile) || undefined,
      is_active: true,
    });

    if (nextProfile?.is_active === false) {
      sessionStorage.setItem(
        INACTIVE_ACCOUNT_NOTICE_KEY,
        "Your account is currently inactive. Contact the administrator.",
      );
      await userService.signOut();
      setProfile(null);
      return null;
    }

    setProfile(nextProfile);
    syncPerformanceName(nextUser, nextProfile);
    return nextProfile;
  }, [syncPerformanceName]);

  useEffect(() => {
    let active = true;

    if (!isSupabaseConfigured) {
      console.warn(supabaseConfigError);
      setIsLoading(false);

      return () => {
        active = false;
      };
    }

    const bootstrap = async () => {
      let nextSession: AppSession | null = null;

      try {
        nextSession = await authService.getSession();
      } catch (error) {
        console.error("Error loading auth session:", error);
      }

      if (!active) return;

      const nextUser = nextSession?.user ?? null;

      setSession(nextSession);
      setUser(nextUser);
      await loadProfile(nextUser);

      if (active) {
        setIsLoading(false);
      }
    };

    void bootstrap();

    const {
      data: { subscription },
    } = authService.onAuthStateChange((_event, nextSession) => {
      const nextUser = nextSession?.user ?? null;
      setSession(nextSession);
      setUser(nextUser);
      setIsLoading(false);
      void loadProfile(nextUser);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user,
    profile,
    isAuthenticated: Boolean(session?.user),
    isAdmin: isAdminPreferences(profile?.preferences),
    isLoading,
    displayName: deriveDisplayName(user, profile),
    refreshProfile: async () => loadProfile(user),
    signOut: async () => {
      await userService.signOut();
      setProfile(null);
    },
  }), [isLoading, loadProfile, profile, session, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
