import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { AuthContext, type AuthContextValue } from "@/contexts/auth-context";
import {
  getPaymentStatus,
  hasPremiumPreferences,
  isAdminPreferences,
} from "@/lib/authRoles";
import { INACTIVE_ACCOUNT_NOTICE_KEY } from "@/lib/authStorage";
import { backendAuthService } from "@/lib/backendAuth";
import type {
  AppSession,
  AuthSessionResponse,
  AuthUser,
  RegisterInput,
  UpdateProfileInput,
  UserProfile,
} from "@/lib/auth/types";
import { updateStudentName } from "@/lib/performanceUtils";

const getStringValue = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const deriveDisplayName = (user: AuthUser | null, profile: UserProfile | null) => {
  const profileName = getStringValue(profile?.name);
  if (profileName) return profileName;

  const metadataName = getStringValue(user?.user_metadata?.name);
  if (metadataName) return metadataName;

  const phone = getStringValue(user?.phone);
  if (phone) return phone;

  const email = getStringValue(user?.email);
  if (email) return email.split("@")[0];

  return "Student";
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AppSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncPerformanceName = useCallback((nextUser: AuthUser | null, nextProfile: UserProfile | null) => {
    const nextName = deriveDisplayName(nextUser, nextProfile);
    if (nextName && nextName !== "Student") {
      updateStudentName(nextName);
    }
  }, []);

  const clearAuthState = useCallback(() => {
    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  const applySnapshot = useCallback((payload: AuthSessionResponse) => {
    const nextSession = payload.session;
    const nextUser = payload.session?.user ?? null;
    const nextProfile = payload.profile;

    setSession(nextSession);
    setUser(nextUser);
    setProfile(nextProfile);
    syncPerformanceName(nextUser, nextProfile);

    return nextProfile;
  }, [syncPerformanceName]);

  const enforceActiveProfile = useCallback(async (payload: AuthSessionResponse) => {
    if (payload.profile?.is_active === false) {
      sessionStorage.setItem(
        INACTIVE_ACCOUNT_NOTICE_KEY,
        "Your account is currently inactive. Contact the administrator.",
      );
      await backendAuthService.signOut();
      clearAuthState();
      return null;
    }

    return applySnapshot(payload);
  }, [applySnapshot, clearAuthState]);

  const refreshProfile = useCallback(async () => {
    try {
      const payload = await backendAuthService.getSession();
      if (!payload.session || !payload.profile) {
        clearAuthState();
        return null;
      }

      return await enforceActiveProfile(payload);
    } catch (error) {
      console.error("Error refreshing auth session:", error);
      clearAuthState();
      return null;
    }
  }, [clearAuthState, enforceActiveProfile]);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        const payload = await backendAuthService.getSession();

        if (!active) {
          return;
        }

        if (payload.session && payload.profile) {
          await enforceActiveProfile(payload);
        } else {
          clearAuthState();
        }
      } catch (error) {
        console.error("Error loading auth session:", error);
        if (active) {
          clearAuthState();
        }
      }

      if (active) {
        setIsLoading(false);
      }
    };

    void bootstrap();

    return () => {
      active = false;
    };
  }, [clearAuthState, enforceActiveProfile]);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user,
    profile,
    isAuthenticated: Boolean(session?.user),
    isAdmin: isAdminPreferences(profile?.preferences),
    hasPremiumAccess: hasPremiumPreferences(profile?.preferences),
    paymentStatus: getPaymentStatus(profile?.preferences),
    isLoading,
    displayName: deriveDisplayName(user, profile),
    refreshProfile,
    signIn: async (phone, password) => {
      const payload = await backendAuthService.signIn({ phone, password });
      return await enforceActiveProfile(payload);
    },
    register: async (input: RegisterInput) => {
      const payload = await backendAuthService.register(input);
      return await enforceActiveProfile(payload);
    },
    updateProfile: async (input: UpdateProfileInput) => {
      const payload = await backendAuthService.updateProfile(input);
      return await enforceActiveProfile(payload);
    },
    signOut: async () => {
      clearAuthState();
      await backendAuthService.signOut();
    },
  }), [clearAuthState, enforceActiveProfile, isLoading, profile, refreshProfile, session, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
