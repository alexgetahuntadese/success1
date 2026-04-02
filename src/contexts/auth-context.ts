import { createContext } from "react";
import type { User } from "@supabase/supabase-js";

import type { AppSession, UserProfile } from "@/lib/supabase/types";

export type AuthContextValue = {
  session: AppSession | null;
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasPremiumAccess: boolean;
  paymentStatus: string;
  isLoading: boolean;
  displayName: string;
  refreshProfile: () => Promise<UserProfile | null>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
