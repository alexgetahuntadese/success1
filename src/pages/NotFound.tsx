import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import StarField from '@/components/StarField';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 overflow-hidden relative">
      <StarField starCount={30} shootingCount={2} />
      <div className="text-center relative z-10">
        <h1 className="text-4xl font-bold mb-4 text-white">404</h1>
        <p className="text-xl text-white/60 mb-4">Oops! Page not found</p>
        <a href="/" className="text-violet-300 hover:text-violet-100 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
