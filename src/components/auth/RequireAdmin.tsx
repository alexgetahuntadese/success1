import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";

import TopBar from "@/components/TopBar";
import StarField from "@/components/StarField";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const RequireAdmin = () => {
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/8 px-5 py-4 text-white backdrop-blur-xl">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-200" />
          <span>Checking admin access...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="app-shell relative min-h-screen px-4 pb-4 pt-14 md:px-8 md:pb-8 md:pt-14">
        <TopBar />
        <StarField starCount={42} shootingCount={3} />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-7rem)] max-w-xl items-center">
          <div className="w-full rounded-[2rem] border border-white/14 bg-white/8 p-8 text-center text-white backdrop-blur-xl">
            <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-500/15 text-rose-200">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">Admin access only</h1>
            <p className="mt-3 text-sm leading-7 text-white/68">
              This dashboard now uses Supabase account roles. Your current signed-in account is not marked as an admin.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                onClick={() => navigate("/grades")}
                className="bg-cyan-400 text-slate-950 hover:bg-cyan-300"
              >
                Back to Grades
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="border-white/15 bg-transparent text-white hover:bg-white/10"
              >
                Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default RequireAdmin;
