import { Route } from "lucide-react";

type AppLogoProps = {
  compact?: boolean;
  className?: string;
};

const AppLogo = ({ compact = false, className = "" }: AppLogoProps) => {
  return (
    <div className={`flex min-w-0 items-center gap-3 ${className}`.trim()}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-400 to-emerald-400 text-slate-950 shadow-[0_10px_24px_rgba(34,211,238,0.28)] ring-1 ring-white/20 sm:h-10 sm:w-10">
        <Route className="h-5 w-5" />
      </div>
      {!compact && (
        <div className="min-w-0 leading-tight">
          <div className="truncate text-xs font-black uppercase tracking-[0.18em] text-white sm:text-sm sm:tracking-[0.22em]">Simple Road</div>
          <div className="truncate text-[10px] text-white/60 sm:text-[11px]">Learn with a clear path</div>
        </div>
      )}
    </div>
  );
};

export default AppLogo;
