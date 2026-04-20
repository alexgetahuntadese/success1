import type { ReactNode } from "react";
import { useRouter } from 'next/navigation';

import { useAuth } from "@/hooks/useAuth";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useRouter();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950">
        <div className="text-sm text-white/80">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const router = useRouter();
    router.push('/login');
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
