import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { AUTH_REQUIRED_NOTICE_KEY } from "@/lib/authStorage";
import {
  isSupabaseConfigured,
  supabaseConfigError,
} from "@/lib/supabaseConfig";

const RequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/8 px-5 py-4 text-white backdrop-blur-xl">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-200" />
          <span>Checking your account...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    sessionStorage.setItem(
      AUTH_REQUIRED_NOTICE_KEY,
      isSupabaseConfigured
        ? "Sign in first to continue into the student portal."
        : supabaseConfigError || "Missing Supabase environment variables.",
    );
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
