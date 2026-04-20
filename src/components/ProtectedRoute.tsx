'use client';

import type { ReactNode } from "react";
import { Navigate, useLocation } from "@/lib/router";

import { useAuth } from "@/hooks/useAuth";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950">
        <div className="text-sm text-white/80">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?from=${encodeURIComponent(location.pathname || '/')}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
