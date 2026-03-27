import { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, BookOpen, Sparkles, GraduationCap, ArrowLeft, MessageSquare, Brain, Trophy, Quote, ScrollText, NotebookPen } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import TopBar from "@/components/TopBar";
import StarField from "@/components/StarField";
import { getRecentAttempts } from "@/lib/performanceUtils";
import { migrateLocalDataToDb } from "@/lib/dbPerformanceUtils";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { notesByGrade } from "@/lib/notesData";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const recentAttempts = useMemo(() => getRecentAttempts(5), []);

  useEffect(() => {
    if (user) {
      migrateLocalDataToDb();
    }
  }, [user]);

  const testimonials = [
    { name: "Abigail Tesfaye", subject: "Biology", quote: "This app helped me score 95% on my national exam! The practice questions are spot on." },
    { name: "Dawit Bekele", subject: "Mathematics", quote: "I went from struggling with calculus to topping my class. The explanations are incredible." },
    { name: "Hanna Girma", subject: "Physics", quote: "The career simulator showed me my passion for engineering. Now I'm working towards it!" },
    { name: "Yonas Tadesse", subject: "Chemistry", quote: "Studying became fun with the quizzes. I recommend this to every Ethiopian student." },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const features = [
    {
      icon: BookOpen,
      title: t("index.exploreSubjects"),
      description: t("index.browseDescription"),
      buttonText: t("index.browseQuizzes"),
      route: "/grades",
      accent: "from-violet-500 to-fuchsia-500",
      ring: "ring-violet-400/30",
    },
    {
      icon: BarChart3,
      title: t("index.myPerformance"),
      description: t("index.trackProgress"),
      buttonText: t("index.viewDashboard"),
      route: "/performance",
      accent: "from-emerald-500 to-teal-500",
      ring: "ring-emerald-400/30",
    },
    {
      icon: Sparkles,
      title: "Future Me Mode",
      description: "AI-powered career simulator: experience a day in any career.",
      buttonText: "Try Career Simulator",
      route: "/career-simulator",
      accent: "from-amber-400 to-orange-500",
      ring: "ring-amber-400/30",
    },
    {
      icon: ScrollText,
      title: "National Matric Exams",
      description: "Practice with real past national exam questions organized by year.",
      buttonText: "Browse Past Exams",
      route: "/matric",
      accent: "from-orange-500 to-red-500",
      ring: "ring-orange-400/30",
    },
  ];

  const stats = [
    { value: "2050+", label: t("common.questions"), icon: MessageSquare, color: "from-emerald-400 to-teal-400" },
    { value: "12", label: t("common.subjects"), icon: BookOpen, color: "from-blue-400 to-cyan-400" },
    { value: "12", label: t("common.gradeLevels"), icon: GraduationCap, color: "from-violet-400 to-purple-400" },
    { value: "AI", label: t("common.powered"), icon: Brain, color: "from-pink-400 to-rose-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 pt-14 px-4 pb-4 md:p-8 md:pt-14 overflow-hidden relative">
      <TopBar />
      <StarField starCount={60} shootingCount={4} />

      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center w-full py-12 md:py-20">
        <div className="text-center mb-16 opacity-0 animate-fade-in" style={{ animationFillMode: "forwards" }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm mb-6">
            <GraduationCap className="h-4 w-4" />
            Ethiopian Curriculum
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent">
            {t("index.title")}
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-lg mx-auto">
            {t("index.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(feature.route)}
                className="group relative cursor-pointer opacity-0 animate-fade-in"
                style={{ animationDelay: `${0.3 + 0.15 * index}s`, animationFillMode: "forwards" }}
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${feature.accent} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                <div className="relative bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 transition-all duration-500 group-hover:bg-white/[0.08] group-hover:border-white/[0.15] group-hover:scale-[1.02] shadow-2xl">
                  <Sparkles className="absolute top-4 right-4 h-5 w-5 text-white/10 group-hover:text-white/30 transition-colors duration-500" />
                  <div className="mb-5">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.accent} shadow-lg group-hover:shadow-xl transition-shadow duration-500 ring-4 ${feature.ring} group-hover:ring-8`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{feature.title}</h2>
                  <p className="text-white/40 text-sm mb-6">{feature.description}</p>
                  <div className="flex items-center text-white/30 group-hover:text-white/60 text-sm transition-colors duration-300">
                    <span>{feature.buttonText}</span>
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full max-w-5xl mb-16 opacity-0 animate-fade-in" style={{ animationDelay: "0.65s", animationFillMode: "forwards" }}>
          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-[2rem] p-6 md:p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs uppercase tracking-[0.2em] mb-4">
                  <NotebookPen className="h-3.5 w-3.5" />
                  Notes by Chapter
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Open notes on a dedicated page
                </h2>
                <p className="text-sm md:text-base text-white/45 max-w-2xl">
                  Browse grade chips first, then move to separate subject and chapter note pages instead of expanding everything on the homepage.
                </p>
              </div>
              <Button
                onClick={() => navigate("/notes")}
                className="bg-white text-slate-950 hover:bg-white/90 rounded-xl self-start lg:self-auto"
              >
                Open Notes
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {notesByGrade.map((grade) => (
                <button
                  key={grade.grade}
                  onClick={() => navigate(`/notes/${grade.grade}`)}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-left transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.14]"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${grade.accent}`} />
                  <div className="text-3xl font-black text-white mb-2">{grade.grade}</div>
                  <div className="text-sm font-semibold text-white mb-1">Grade {grade.grade}</div>
                  <div className="text-xs text-white/40 mb-4">{grade.subjects.length} subjects</div>
                  <div className="flex items-center text-white/30 group-hover:text-white/60 text-xs transition-colors duration-300">
                    <span>View notes</span>
                    <ArrowLeft className="ml-2 h-3.5 w-3.5 rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl opacity-0 animate-fade-in" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="text-center">
                    <Icon className="h-5 w-5 mx-auto mb-2 text-white/30" />
                    <div className={`text-2xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/40 mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full max-w-2xl mt-8 opacity-0 animate-fade-in" style={{ animationDelay: "1s", animationFillMode: "forwards" }}>
          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6">
            {recentAttempts.length > 0 ? (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <Trophy className="h-5 w-5 text-amber-400" />
                  <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                </div>
                <div className="space-y-3">
                  {recentAttempts.map((attempt) => (
                    <div
                      key={attempt.attempt_id}
                      className="flex items-center justify-between p-3 bg-white/[0.04] rounded-xl border border-white/[0.06] hover:bg-white/[0.08] transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{attempt.subject}</p>
                        <p className="text-xs text-white/40 truncate">{attempt.chapter} • Grade {attempt.grade}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-3">
                        <Badge className="text-xs border-white/20 text-white/60 capitalize" variant="outline">
                          {attempt.difficulty}
                        </Badge>
                        <Badge className={`${getScoreColor(attempt.score)} text-white text-xs`}>
                          {attempt.score}%
                        </Badge>
                      </div>
                      <span className="text-xs text-white/30 ml-3 whitespace-nowrap">
                        {formatDistanceToNow(new Date(attempt.attempted_at), { addSuffix: true })}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <Quote className="h-5 w-5 text-violet-400" />
                  <h3 className="text-lg font-bold text-white">What Students Say</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map((item, i) => (
                    <div key={i} className="p-4 bg-white/[0.04] rounded-xl border border-white/[0.06]">
                      <p className="text-sm text-white/50 italic mb-3">"{item.quote}"</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-white/70">{item.name}</span>
                        <Badge variant="outline" className="text-xs border-white/20 text-white/40">
                          {item.subject}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
