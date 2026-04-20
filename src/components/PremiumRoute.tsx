'use client';

import type { ReactNode } from "react";
import { Navigate, useLocation } from "@/lib/router";

import { useAuth } from "@/hooks/useAuth";

type PremiumRouteProps = {
  children: ReactNode;
};

const PremiumRoute = ({ children }: PremiumRouteProps) => {
  const { isAuthenticated, hasPremiumAccess, isLoading } = useAuth();
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

  if (!hasPremiumAccess) {
    return <Navigate to="/payment" replace />;
  }

  return <>{children}</>;
};

export default PremiumRoute;