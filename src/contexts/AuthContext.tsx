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
import { parseAuthService } from "@/integrations/parse/parseAuth";
import type {
  AppSession,
  AuthUser,
  RegisterInput,
  UpdateProfileInput,
  UserProfile,
} from "@/lib/auth/types";
import { getProfileDisplayName, getProfileKey } from "@/lib/profileUtils";
import { updateStudentName } from "@/lib/performanceUtils";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AppSession | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuthState = useCallback(() => {
    setSession(null);
    setUser(null);
    setProfile(null);
    setIsLoading(false);
  }, []);

  const applyUserData = useCallback(
    async (authSession: AppSession, userProfile: UserProfile) => {
      const authUser = authSession.user;
      const displayName = getProfileDisplayName(userProfile, authUser);
      const profileKey = getProfileKey(userProfile, authUser);
      setSession(authSession);
      setUser(authUser);
      setProfile(userProfile);

      updateStudentName(displayName, profileKey);

      setIsLoading(false);
      return userProfile;
    },
    []
  );

  const checkInactiveAccount = useCallback(
    (userProfile: UserProfile | null) => {
      if (!userProfile?.is_active) {
        const notice = "Your account is currently inactive. Contact the administrator.";
        sessionStorage.setItem(INACTIVE_ACCOUNT_NOTICE_KEY, notice);
      }
    },
    []
  );

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        const session = await parseAuthService.getSession();
        
        if (!active) {
          return;
        }

        if (session?.session && session?.profile) {
          await applyUserData(session.session, session.profile);
          checkInactiveAccount(session.profile);
        } else {
          clearAuthState();
        }
      } catch (error) {
        console.error("Auth bootstrap error:", error);
        if (active) {
          clearAuthState();
        }
      }
    };

    bootstrap();

    return () => {
      active = false;
    };
  }, [clearAuthState, applyUserData, checkInactiveAccount]);

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user,
    profile,
    isAuthenticated: Boolean(user),
    isAdmin: isAdminPreferences(profile?.preferences as any),
    hasPremiumAccess: hasPremiumPreferences(profile?.preferences as any),
    paymentStatus: getPaymentStatus(profile?.preferences as any),
    isLoading,
    displayName: getProfileDisplayName(profile, user),
    refreshProfile: async () => {
      try {
        const session = await parseAuthService.getSession();
        if (session?.session && session?.profile) {
          return await applyUserData(session.session, session.profile);
        }
        return null;
      } catch (error) {
        console.error("Refresh profile error:", error);
        return null;
      }
    },
    signIn: async (phone: string, password: string) => {
      try {
        const session = await parseAuthService.signIn({ phone, password });
        if (session?.session && session?.profile) {
          const userProfile = await applyUserData(session.session, session.profile);
          checkInactiveAccount(userProfile);
          return userProfile;
        }
        return null;
      } catch (error) {
        console.error("Sign in error:", error);
        throw error;
      }
    },
    register: async (input: RegisterInput) => {
      try {
        const session = await parseAuthService.register(input);
        if (session?.session && session?.profile) {
          const userProfile = await applyUserData(session.session, session.profile);
          checkInactiveAccount(userProfile);
          return userProfile;
        }
        return null;
      } catch (error) {
        console.error("Register error:", error);
        throw error;
      }
    },
    updateProfile: async (input: UpdateProfileInput) => {
      try {
        const session = await parseAuthService.updateProfile(input);
        if (session?.session && session?.profile) {
          const userProfile = await applyUserData(session.session, session.profile);
          return userProfile;
        }
        return null;
      } catch (error) {
        console.error("Update profile error:", error);
        throw error;
      }
    },
    signOut: async () => {
      try {
        await parseAuthService.signOut();
        clearAuthState();
      } catch (error) {
        console.error("Sign out error:", error);
        clearAuthState();
      }
    },
  }), [session, user, profile, isLoading, clearAuthState, applyUserData, checkInactiveAccount]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
