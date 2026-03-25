import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Trophy, Sparkles, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import TopBar from "@/components/TopBar";
import StarField from '@/components/StarField';

const gradeData = [
  {
    number: 9,
    subjects: 9,
    icon: BookOpen,
    accent: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/30",
    ring: "ring-emerald-400/30",
    description: "Build your foundation",
  },
  {
    number: 10,
    subjects: 10,
    icon: Sparkles,
    accent: "from-cyan-500 to-blue-500",
    glow: "shadow-cyan-500/30",
    ring: "ring-cyan-400/30",
    description: "Strengthen core skills",
  },
  {
    number: 11,
    subjects: 13,
    icon: BookOpen,
    accent: "from-violet-500 to-fuchsia-500",
    glow: "shadow-violet-500/30",
    ring: "ring-violet-400/30",
    description: "Prepare for national exams",
  },
  {
    number: 12,
    subjects: 14,
    icon: Trophy,
    accent: "from-amber-400 to-orange-500",
    glow: "shadow-orange-500/30",
    ring: "ring-amber-400/30",
    description: "University entrance prep",
  },
];

const GradesPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 pt-14 px-4 pb-4 md:p-8 md:pt-14 overflow-hidden relative">
      <StarField starCount={50} shootingCount={4} />
      <TopBar />

      <div className="max-w-4xl mx-auto relative z-10">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="text-white/70 hover:text-white hover:bg-white/5 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.backToHome')}
        </Button>

        <div className="text-center mb-16 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm mb-6">
            <GraduationCap className="h-4 w-4" />
            Ethiopian Curriculum
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
            {t('grades.selectGrade')}
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-md mx-auto">
            {t('grades.chooseGrade')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {gradeData.map((grade, index) => {
            const Icon = grade.icon;
            return (
              <div
                key={grade.number}
                onClick={() => navigate(`/grade/${grade.number}/subjects`)}
                className={`group relative cursor-pointer opacity-0 animate-fade-in`}
                style={{ animationDelay: `${0.3 + 0.15 * index}s`, animationFillMode: 'forwards' }}
              >
                {/* Glow effect behind card */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${grade.accent} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
                
                <div className={`relative bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 md:p-10 transition-all duration-500 group-hover:bg-white/[0.08] group-hover:border-white/[0.15] group-hover:scale-[1.02] group-hover:${grade.glow} shadow-2xl`}>
                  {/* Sparkle decoration */}
                  <Sparkles className="absolute top-4 right-4 h-5 w-5 text-white/10 group-hover:text-white/30 transition-colors duration-500" />
                  
                  {/* Grade number - hero element */}
                  <div className="mb-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${grade.accent} shadow-lg group-hover:shadow-xl transition-shadow duration-500 ring-4 ${grade.ring} group-hover:ring-8`}>
                      <span className="text-3xl font-black text-white">{grade.number}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {t('common.grade')} {grade.number}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-white/40 text-sm mb-6">{grade.description}</p>

                  {/* Stats row */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white/50 text-sm">
                      <Icon className="h-4 w-4" />
                      <span>{grade.subjects} subjects</span>
                    </div>
                  </div>

                  {/* Bottom action hint */}
                  <div className="mt-8 flex items-center text-white/30 group-hover:text-white/60 text-sm transition-colors duration-300">
                    <span>Start learning</span>
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GradesPage;
