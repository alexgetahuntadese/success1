import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe2,
  GraduationCap,
  KeyRound,
  LibraryBig,
  Loader2,
  LockKeyhole,
  Mail,
  NotebookPen,
  Phone,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
} from "lucide-react";

import AppLogo from "@/components/AppLogo";
import StarField from "@/components/StarField";
import TopBar from "@/components/TopBar";
import { useAuth } from "@/hooks/useAuth";
import {
  AUTH_REQUIRED_NOTICE_KEY,
  INACTIVE_ACCOUNT_NOTICE_KEY,
} from "@/lib/authStorage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  authService,
  formatAuthError,
  normalizePhoneNumber,
  userProfileService,
} from "@/services/supabaseServiceFixed";

const focusCards = [
  {
    title: "Study journeys",
    description: "Move through learning paths that feel structured, calm, and easy to follow from first visit to final revision.",
    icon: BookOpenCheck,
  },
  {
    title: "Revision ecosystem",
    description: "Switch between notes, quiz practice, and exam preparation in one connected learning environment.",
    icon: NotebookPen,
  },
  {
    title: "Future-facing support",
    description: "Go beyond classwork with books, matric preparation, and career exploration built into the same platform.",
    icon: Trophy,
  },
];

const quickLinks = [
  {
    title: "Open learning",
    description: "Enter the main study experience with subjects, chapters, and guided practice.",
    route: "/grades",
  },
  {
    title: "Browse notes",
    description: "Read concise chapter notes designed for quick revision and stronger recall.",
    route: "/notes",
  },
  {
    title: "Explore books",
    description: "Find textbook downloads and study materials collected in one place.",
    route: "/books",
  },
  {
    title: "Enter matric prep",
    description: "Go directly into exam-focused revision built around Ethiopian national assessment pathways.",
    route: "/matric",
  },
];

const studySignals = [
  "Ethiopian curriculum focus",
  "Grades 9-12 learning",
  "Notes, quizzes, and books",
  "Secure account access",
];

const globalSignals = [
  {
    value: "4 spaces",
    label: "Learn, revise, read, and prepare in one platform",
  },
  {
    value: "Student-first",
    label: "Focused on clarity, continuity, and everyday progress",
  },
  {
    value: "Anywhere",
    label: "Designed for students at school, at home, or abroad",
  },
];

const platformAreas = [
  {
    title: "Learning",
    description: "Structured subjects, chapter routes, and practice sessions that reduce friction.",
  },
  {
    title: "Revision",
    description: "Short notes and quiz flows built for repeat practice and stronger memory.",
  },
  {
    title: "Resources",
    description: "Books and study materials collected in one place so learners can move faster.",
  },
  {
    title: "Preparation",
    description: "Matric review and career exploration for students planning their next step.",
  },
];

const homeCollections = [
  {
    title: "Guided Learning",
    description: "Start from grades and move into subjects, chapters, and focused quiz practice.",
    icon: GraduationCap,
  },
  {
    title: "Revision Library",
    description: "Use notes and book access when you want quieter reading and repeat review.",
    icon: LibraryBig,
  },
  {
    title: "Exam Mission",
    description: "Open matric pathways for stream-based preparation when exam pressure increases.",
    icon: Rocket,
  },
  {
    title: "Global Access",
    description: "Study from school, from home, or from abroad with the same account and route back in.",
    icon: Globe2,
  },
];

const trustPoints = [
  "Built around Ethiopian secondary and preparatory study patterns",
  "Designed for students, returners, and diaspora learners",
  "Balances reading, recall, and exam-focused preparation",
];

const authInputClassName =
  "h-12 rounded-2xl border border-white/75 bg-white/96 pl-11 text-sky-950 shadow-[0_12px_30px_rgba(14,36,68,0.06)] placeholder:text-sky-700/70 focus-visible:border-cyan-400 focus-visible:ring-cyan-200/40 [&:-webkit-autofill]:[-webkit-text-fill-color:#082f49] [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgba(255,255,255,0.96)]";

const authInputWithActionClassName = `${authInputClassName} pr-12`;

type AuthMode = "signin" | "signup";

const Index = () => {
  const navigate = useNavigate();
  const { displayName, isAuthenticated, isLoading: isCheckingSession, refreshProfile } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authNotice, setAuthNotice] = useState("");

  useEffect(() => {
    const storedNotice =
      sessionStorage.getItem(INACTIVE_ACCOUNT_NOTICE_KEY) ||
      sessionStorage.getItem(AUTH_REQUIRED_NOTICE_KEY);

    if (!storedNotice) {
      return;
    }

    setAuthError(storedNotice);
    sessionStorage.removeItem(INACTIVE_ACCOUNT_NOTICE_KEY);
    sessionStorage.removeItem(AUTH_REQUIRED_NOTICE_KEY);
  }, []);

  const isSignUp = authMode === "signup";
  const primaryLabel = isSubmitting
    ? authMode === "signin"
      ? "Signing in..."
      : "Creating account..."
    : authMode === "signin"
      ? "Sign In"
      : "Create Account";

  const helperText = useMemo(() => {
    if (authMode === "signin") {
      return "Use your Supabase account email and password to continue your study progress.";
    }

    return "Create your student account with Supabase email sign-up, then keep your name and mobile number in your study profile.";
  }, [authMode]);

  const resetMessages = () => {
    setAuthError("");
    setAuthNotice("");
  };

  const handleModeChange = (mode: AuthMode) => {
    setAuthMode(mode);
    resetMessages();
  };

  const handleForgotPassword = async () => {
    resetMessages();

    if (!email.trim()) {
      setAuthError("Enter your account email first so we can send a reset link.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.sendPasswordReset(email.trim());
      setAuthNotice("Password reset email sent. Check your inbox and spam folder.");
    } catch (error) {
      setAuthError(formatAuthError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = async () => {
    resetMessages();

    if (!email.trim() || !password.trim()) {
      setAuthError("Enter your email and password to sign in.");
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.signInWithPassword(email.trim(), password);

      const profile = await refreshProfile();
      if (profile?.is_active === false) {
        setAuthError("Your account is currently inactive. Contact the administrator.");
        return;
      }

      await userProfileService.updateLastLogin();
      navigate("/grades");
    } catch (error) {
      setAuthError(formatAuthError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async () => {
    resetMessages();

    if (!fullName.trim()) {
      setAuthError("Enter your full name to create an account.");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setAuthError("Enter your email and password to create an account.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await authService.signUpStudent({
        fullName,
        email,
        password,
        mobile,
      });

      if (data.session) {
        await userProfileService.upsertProfile({
          name: fullName.trim(),
          email: email.trim(),
          mobile: mobile.trim() ? normalizePhoneNumber(mobile.trim()) : undefined,
          is_active: true,
        });

        await refreshProfile();
        navigate("/grades");
        return;
      }

      setAuthNotice("Account created. Check your email to confirm your account, then sign in.");
      setAuthMode("signin");
    } catch (error) {
      setAuthError(formatAuthError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrimaryAction = async () => {
    if (authMode === "signin") {
      await handleSignIn();
      return;
    }

    await handleSignUp();
  };

  if (isCheckingSession) {
    return (
      <div className="app-shell relative flex min-h-screen items-center justify-center px-4">
        <StarField starCount={36} shootingCount={2} />
        <div className="relative z-10 flex items-center gap-3 rounded-2xl border border-white/12 bg-white/8 px-5 py-4 text-white backdrop-blur-xl">
          <Loader2 className="h-5 w-5 animate-spin text-cyan-200" />
          <span>Checking your session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell relative min-h-screen overflow-hidden px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <StarField starCount={58} shootingCount={4} />
      <TopBar />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(34,211,238,0.16),transparent_22%),radial-gradient(circle_at_86%_16%,rgba(251,191,36,0.14),transparent_18%),radial-gradient(circle_at_50%_84%,rgba(59,130,246,0.16),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:80px_80px]" />
      <div className="pointer-events-none absolute inset-y-0 left-[-12%] w-[38%] bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.16),transparent_62%)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-8%] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.12),transparent_65%)] blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl items-center pt-16 sm:min-h-[calc(100vh-3rem)] sm:pt-20">
        <div className="grid w-full gap-8 xl:grid-cols-[1.02fr_0.98fr] xl:gap-14">
          <section className="order-2 flex flex-col justify-center xl:order-1">
            <div
              className="mb-6 inline-flex w-fit items-center gap-3 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-white/85 backdrop-blur-xl opacity-0 animate-fade-in"
              style={{ animationFillMode: "forwards" }}
            >
              <AppLogo compact />
              <span>Global-ready Ethiopian study hub</span>
            </div>

            <div
              className="max-w-3xl opacity-0 animate-fade-in"
              style={{ animationDelay: "0.08s", animationFillMode: "forwards" }}
            >
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.28em] text-cyan-200/90">
                International Student Experience
              </p>
              <h1 className="max-w-4xl text-4xl font-black leading-[0.98] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                One home for
                <span className="block bg-gradient-to-r from-cyan-200 via-white to-amber-200 bg-clip-text text-transparent">
                  Ethiopian learning and revision
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
                Simple Road is the landing place for studying, revising, reading, and preparing for exams,
                built for learners in Ethiopia and beyond with a cleaner, more modern experience.
              </p>
            </div>

            <div
              className="mt-6 grid gap-3 sm:grid-cols-3 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.12s", animationFillMode: "forwards" }}
            >
              {globalSignals.map((item) => (
                <div
                  key={item.value}
                  className="rounded-[1.5rem] border border-white/14 bg-white/[0.07] px-4 py-4 text-white shadow-[0_12px_34px_rgba(8,15,40,0.16)] backdrop-blur-xl"
                >
                  <div className="text-lg font-black tracking-tight text-cyan-100">{item.value}</div>
                  <div className="mt-1 text-sm leading-6 text-white/62">{item.label}</div>
                </div>
              ))}
            </div>

            <div
              className="mt-7 flex flex-wrap gap-3 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.16s", animationFillMode: "forwards" }}
            >
              {studySignals.map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-white/78 backdrop-blur-xl"
                >
                  {item}
                </div>
              ))}
            </div>

            <div
              className="mt-8 grid gap-4 md:grid-cols-3 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.24s", animationFillMode: "forwards" }}
            >
              {focusCards.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-[1.75rem] border border-white/14 bg-white/8 p-5 text-white shadow-[0_18px_60px_rgba(8,15,40,0.24)] backdrop-blur-xl"
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-amber-300/12 text-cyan-100 ring-1 ring-white/10">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-white/66">{item.description}</p>
                  </div>
                );
              })}
            </div>

            <div
              className="mt-8 grid gap-4 sm:grid-cols-2 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.28s", animationFillMode: "forwards" }}
            >
              {platformAreas.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.6rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-5 text-white shadow-[0_16px_50px_rgba(8,15,40,0.14)] backdrop-blur-xl"
                >
                  <div className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200/90">{item.title}</div>
                  <p className="mt-3 text-sm leading-6 text-white/66">{item.description}</p>
                </div>
              ))}
            </div>

            <div
              className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-2 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.34s", animationFillMode: "forwards" }}
            >
              {quickLinks.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => navigate(item.route)}
                  className="group rounded-[1.9rem] border border-white/16 bg-[linear-gradient(145deg,rgba(56,189,248,0.14),rgba(14,116,144,0.18))] p-5 text-left text-white shadow-[0_20px_70px_rgba(14,36,68,0.18)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200/30 hover:bg-white/12"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white/8">
                      <ArrowRight className="h-4 w-4 text-cyan-200" />
                    </div>
                    <div className="text-sm uppercase tracking-[0.2em] text-white/55">Platform Area</div>
                  </div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/66">{item.description}</p>
                  <div className="mt-4 inline-flex items-center text-sm text-cyan-200 transition-transform duration-300 group-hover:translate-x-1">
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </button>
              ))}
            </div>

            <div
              className="mt-8 rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-5 shadow-[0_18px_60px_rgba(8,15,40,0.16)] backdrop-blur-2xl opacity-0 animate-fade-in"
              style={{ animationDelay: "0.38s", animationFillMode: "forwards" }}
            >
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200/90">
                <Sparkles className="h-4 w-4" />
                Inside The Platform
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {homeCollections.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4 text-white"
                    >
                      <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-cyan-100 ring-1 ring-white/10">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="text-lg font-semibold">{item.title}</div>
                      <p className="mt-2 text-sm leading-6 text-white/64">{item.description}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 grid gap-2">
                {trustPoints.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-sm text-white/72"
                  >
                    <div className="h-2 w-2 rounded-full bg-amber-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="order-1 flex items-center justify-center xl:order-2">
            <Card
              className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border-cyan-200/18 bg-[linear-gradient(180deg,rgba(18,64,105,0.86),rgba(21,84,124,0.78))] text-white shadow-[0_32px_100px_rgba(14,36,68,0.26)] backdrop-blur-2xl opacity-0 animate-fade-in"
              style={{ animationDelay: "0.12s", animationFillMode: "forwards" }}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-300 via-sky-400 to-amber-300" />
              <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-amber-300/10 blur-3xl" />

              {isAuthenticated ? (
                <>
                  <CardHeader className="space-y-5 p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div className="app-kicker w-fit">
                        <CheckCircle2 className="h-4 w-4" />
                        Home Dashboard
                      </div>
                      <div className="rounded-2xl border border-white/12 bg-white/8 p-3">
                        <Sparkles className="h-5 w-5 text-cyan-200" />
                      </div>
                    </div>

                    <div>
                      <CardTitle className="text-2xl sm:text-3xl">
                        Welcome, {displayName}
                      </CardTitle>
                      <CardDescription className="mt-2 text-base leading-6 text-white/64">
                        This is your main home space. Choose what kind of study session you want to open next.
                      </CardDescription>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
                        <div className="text-xs uppercase tracking-[0.2em] text-white/50">Start</div>
                        <div className="mt-2 text-lg font-semibold text-white">Learning flow</div>
                        <p className="mt-2 text-sm leading-6 text-white/64">
                          Continue through subjects, chapters, and quiz practice.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
                        <div className="text-xs uppercase tracking-[0.2em] text-white/50">Focus</div>
                        <div className="mt-2 text-lg font-semibold text-white">Revision flow</div>
                        <p className="mt-2 text-sm leading-6 text-white/64">
                          Move into notes, books, or exam preparation without leaving home.
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5 p-6 pt-0 sm:p-7 sm:pt-0">
                    <div className="rounded-[1.4rem] border border-cyan-300/18 bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(251,191,36,0.06))] p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-100">
                        <CheckCircle2 className="h-4 w-4" />
                        Your home base
                      </div>
                      <p className="text-sm leading-6 text-white/72">
                        Home should help you choose the right mode quickly, not push you into a single page by default.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Button
                        onClick={() => navigate("/grades")}
                        className="h-12 w-full bg-gradient-to-r from-cyan-300 via-sky-300 to-amber-200 text-base font-semibold text-sky-950 shadow-[0_14px_34px_rgba(56,189,248,0.18)] hover:from-cyan-200 hover:via-sky-200 hover:to-amber-100"
                      >
                        Open Learning
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate("/notes")}
                        className="h-12 w-full border-white/15 bg-transparent text-white hover:bg-white/10"
                      >
                        Open Notes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate("/books")}
                        className="h-12 w-full border-white/15 bg-transparent text-white hover:bg-white/10"
                      >
                        Open Books
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate("/matric")}
                        className="h-12 w-full border-white/15 bg-transparent text-white hover:bg-white/10"
                      >
                        Open Matric
                      </Button>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4">
                      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white/84">
                        <Sparkles className="h-4 w-4 text-amber-200" />
                        Your platform shortcuts
                      </div>
                      <div className="space-y-2">
                        {[
                          "Jump into chapter learning when you want structured study",
                          "Open notes and books for quieter revision sessions",
                          "Use matric and career tools when planning ahead",
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/6 px-3 py-3 text-sm text-white/74">
                            <div className="h-2 w-2 rounded-full bg-cyan-300" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <>
                  <CardHeader className="space-y-5 p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div className="app-kicker w-fit">
                        <ShieldCheck className="h-4 w-4" />
                        {authMode === "signin" ? "Student Access" : "Create Access"}
                      </div>
                      <div className="rounded-2xl border border-white/12 bg-white/8 p-3">
                        <LockKeyhole className="h-5 w-5 text-cyan-200" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 rounded-2xl border border-white/12 bg-white/10 p-1">
                      <button
                        type="button"
                        onClick={() => handleModeChange("signin")}
                        className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                          authMode === "signin"
                            ? "bg-gradient-to-r from-cyan-200 via-sky-200 to-amber-200 text-sky-950 shadow-[0_10px_30px_rgba(125,211,252,0.18)]"
                            : "text-white/72 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModeChange("signup")}
                        className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                          authMode === "signup"
                            ? "bg-gradient-to-r from-cyan-200 via-sky-200 to-amber-200 text-sky-950 shadow-[0_10px_30px_rgba(125,211,252,0.18)]"
                            : "text-white/72 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        Create Account
                      </button>
                    </div>

                    <div>
                      <CardTitle className="text-2xl sm:text-3xl">
                        {authMode === "signin" ? "Welcome back" : "Create your learning account"}
                      </CardTitle>
                      <CardDescription className="mt-2 text-base leading-6 text-white/64">{helperText}</CardDescription>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-center">
                        <GraduationCap className="mx-auto mb-2 h-4 w-4 text-cyan-200" />
                        <div className="text-xs text-white/70">Learning</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-center">
                        <NotebookPen className="mx-auto mb-2 h-4 w-4 text-cyan-200" />
                        <div className="text-xs text-white/70">Notes</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-center">
                        <Trophy className="mx-auto mb-2 h-4 w-4 text-cyan-200" />
                        <div className="text-xs text-white/70">Matric</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5 p-6 pt-0 sm:p-7 sm:pt-0">
                    <div className="rounded-[1.4rem] border border-cyan-300/18 bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(251,191,36,0.06))] p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-100">
                        <CheckCircle2 className="h-4 w-4" />
                        Secure learner access
                      </div>
                      <p className="text-sm leading-6 text-white/72">
                        Sign in once and keep your path, profile, and study momentum connected across the platform.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {isSignUp && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white/80">Full name</label>
                          <div className="relative">
                            <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-600/80" />
                            <Input
                              value={fullName}
                              onChange={(event) => setFullName(event.target.value)}
                              placeholder="Student full name"
                              className={authInputClassName}
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Email address</label>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-600/80" />
                          <Input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="student@school.com"
                            className={authInputClassName}
                          />
                        </div>
                      </div>

                      {isSignUp && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white/80">Mobile number</label>
                          <div className="relative">
                            <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-600/80" />
                            <Input
                              value={mobile}
                              onChange={(event) => setMobile(event.target.value)}
                              placeholder="09xx xxx xxx"
                              className={authInputClassName}
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <label className="text-sm font-medium text-white/80">Password</label>
                          {!isSignUp && (
                            <button
                              type="button"
                              onClick={handleForgotPassword}
                              className="text-xs text-cyan-200 transition-colors hover:text-cyan-100"
                            >
                              Forgot password?
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-600/80" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                void handlePrimaryAction();
                              }
                            }}
                            placeholder={isSignUp ? "Choose at least 6 characters" : "Password"}
                            className={authInputWithActionClassName}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-sky-600/80 transition-colors hover:text-sky-900"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {authError ? (
                      <div className="rounded-2xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                        {authError}
                      </div>
                    ) : null}

                    {authNotice ? (
                      <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                        {authNotice}
                      </div>
                    ) : null}

                    <div className="grid gap-3">
                      <Button
                        onClick={() => void handlePrimaryAction()}
                        disabled={isSubmitting}
                        className="h-12 w-full bg-gradient-to-r from-cyan-300 via-sky-300 to-amber-200 text-base font-semibold text-sky-950 shadow-[0_14px_34px_rgba(56,189,248,0.18)] hover:from-cyan-200 hover:via-sky-200 hover:to-amber-100"
                      >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {primaryLabel}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => navigate("/grades")}
                        className="h-12 w-full border-white/15 bg-transparent text-white hover:bg-white/10"
                      >
                        Explore learning first
                      </Button>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Index;
