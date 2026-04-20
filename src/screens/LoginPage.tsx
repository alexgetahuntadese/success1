'use client';

import { useState, useCallback } from "react";
import { useNavigate, Link, useLocation } from "@/lib/router";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, RefreshCw, AlertCircle } from "lucide-react";
import { formatAuthError, normalizePhoneNumber, getAuthErrorDetails, shouldRetryAuthError, type AuthErrorDetails } from "@/services/firebaseService";

const MAX_RETRIES = 2;
const RETRY_DELAY = 2000;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isLoading: authLoading } = useAuth();
  const [phone, setPhone] = useState(
    ((location.state as { phone?: string } | null)?.phone || "")
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<AuthErrorDetails | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [canRetry, setCanRetry] = useState(false);

  const handleError = useCallback((error: unknown) => {
    const details = getAuthErrorDetails(error);
    setErrorDetails(details);
    setCanRetry(details.shouldRetry && retryCount < MAX_RETRIES);

    // Show appropriate toast based on error severity
    if (details.category === "user-disabled" || details.category === "unauthorized-domain") {
      toast.error(details.userMessage, { duration: 8000 });
    } else if (details.category === "too-many-requests") {
      toast.error(details.userMessage, { duration: 6000 });
    } else {
      toast.error(details.userMessage);
    }
  }, [retryCount]);

  const clearError = useCallback(() => {
    setErrorDetails(null);
    setCanRetry(false);
  }, []);

  const performSignIn = useCallback(async (attempt: number = 1): Promise<void> => {
    const normalizedPhone = normalizePhoneNumber(phone);

    try {
      await signIn(normalizedPhone, password);
      toast.success("Signed in successfully!");
      const targetPath = (location.state as { from?: string } | null)?.from || "/grades";
      navigate(targetPath, { replace: true });
    } catch (error: unknown) {
      const details = getAuthErrorDetails(error);

      // Check if we should retry
      if (details.shouldRetry && attempt < MAX_RETRIES && details.category === "network-error") {
        setRetryCount(attempt);
        toast.info(`Connection issue. Retrying... (${attempt}/${MAX_RETRIES})`, { duration: 3000 });
        await delay(RETRY_DELAY * attempt);
        return performSignIn(attempt + 1);
      }

      // Final error - no more retries
      setRetryCount(0);
      throw error;
    }
  }, [phone, password, signIn, navigate, location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const normalizedPhone = normalizePhoneNumber(phone);

    if (!normalizedPhone || !password) {
      toast.error("Please enter your mobile number and password");
      return;
    }

    // Validate phone format
    if (!/^\d{10}$/.test(normalizedPhone.replace(/\D/g, ""))) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);

    try {
      await performSignIn(1);
    } catch (error: unknown) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    clearError();
    setIsLoading(true);

    try {
      await performSignIn(1);
    } catch (error: unknown) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
          <CardDescription className="text-white/70">
            Sign in to continue your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Alert */}
            <AnimatePresence>
              {errorDetails && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-lg border border-red-400/30 bg-red-500/10 p-3"
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-red-200">{errorDetails.userMessage}</p>
                      {errorDetails.canContactSupport && (
                        <p className="mt-2 text-xs text-red-300/70">
                          Need help? Contact: alexgetahuntadese@gmail.com | 0992010092
                        </p>
                      )}
                    </div>
                  </div>
                  {canRetry && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRetry}
                      disabled={isLoading || authLoading}
                      className="mt-2 w-full text-red-300 hover:text-red-200 hover:bg-red-500/20"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">Mobile Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0912345678"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errorDetails) clearError();
                }}
                className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 transition-colors ${
                  errorDetails?.category === "invalid-credentials" || errorDetails?.category === "user-not-found"
                    ? "border-red-400/50 focus:border-red-400"
                    : ""
                }`}
                required
                disabled={isLoading || authLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorDetails) clearError();
                  }}
                  className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10 transition-colors ${
                    errorDetails?.category === "invalid-credentials" || errorDetails?.category === "wrong-password"
                      ? "border-red-400/50 focus:border-red-400"
                      : ""
                  }`}
                  required
                  disabled={isLoading || authLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                  disabled={isLoading || authLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black font-semibold relative overflow-hidden"
              disabled={isLoading || authLoading}
            >
              <AnimatePresence mode="wait">
                {isLoading || authLoading ? (
                  <motion.div
                    key="loading"
                    className="flex items-center justify-center gap-2"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {retryCount > 0 ? `Retrying (${retryCount}/${MAX_RETRIES})...` : "Signing in..."}
                    </motion.span>
                  </motion.div>
                ) : (
                  <motion.span
                    key="signin"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Shimmer effect when loading */}
              {(isLoading || authLoading) && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-100, 100] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              )}
            </Button>
          </form>
          <p className="mt-4 text-center text-white/70">
            Don't have an account?{" "}
            <Link to="/signup" className="text-yellow-400 hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
