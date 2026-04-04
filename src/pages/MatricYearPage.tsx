import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  BookOpen,
  AlertCircle,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Languages,
  Landmark,
  Globe2,
  GraduationCap,
  ScrollText,
  Banknote,
  Lock,
  CreditCard,
  type LucideIcon,
} from 'lucide-react';
import { getMatricSubjectsForYear } from '@/data/matricExams';
import TopBar from '@/components/TopBar';
import StarField from '@/components/StarField';
import { useAuth } from "@/hooks/useAuth";
import { FREE_MATRIC_SUBJECT_LIMIT, isFreeMatricSubject } from '@/lib/paymentAccess';

const subjectIcons: Record<string, LucideIcon> = {
  Mathematics: Calculator,
  Physics: Atom,
  Chemistry: FlaskConical,
  Biology: Dna,
  English: Languages,
  Civics: Landmark,
  History: ScrollText,
  Geography: Globe2,
  Economics: Banknote,
  "Scholastic Aptitude Test": GraduationCap,
};

const MatricYearPage = () => {
  const { year, stream } = useParams<{ year: string; stream: string }>();
  const navigate = useNavigate();
  const { hasPremiumAccess: premiumAccess } = useAuth();
  const yearNum = Number(year);
  const streamKey = stream ?? 'natural';
  const streamLabel = streamKey === 'social' ? 'Social Science' : 'Natural Science';
  const subjects = getMatricSubjectsForYear(yearNum, streamKey);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 pt-14 px-4 pb-4 md:p-8 md:pt-14 overflow-hidden relative">
      <StarField starCount={40} shootingCount={2} />
      <TopBar />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/matric/${yearNum}`)}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{yearNum} E.C. {streamLabel}</h1>
            <p className="text-white/50 text-sm mt-1">Select a subject to start practicing</p>
          </div>
        </div>

        {/* All subjects are now free - no payment restrictions */}
          <div className="mb-8 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-5 text-white">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-bold">Only the first {FREE_MATRIC_SUBJECT_LIMIT} matric subjects are free</h2>
                <p className="mt-1 text-sm text-white/75">
                  For each year and stream, only the first {FREE_MATRIC_SUBJECT_LIMIT} subjects are open. The rest are locked until payment is verified.
                </p>
              </div>
              <Button
                onClick={() => navigate("/payment")}
                className="bg-white text-slate-950 hover:bg-white/90"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Unlock All Matric Subjects
              </Button>
            </div>
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((subj, index) => {
            const hasQuestions = subj.questions.length > 0;
            const locked = false; // All subjects unlocked
            const SubjectIcon = subjectIcons[subj.subject] ?? BookOpen;

            return (
              <Card
                key={subj.subject}
                className={`bg-white/[0.04] backdrop-blur-xl border-white/[0.08] transition-all duration-300 ${
                  hasQuestions && !locked
                    ? 'hover:bg-white/[0.08] hover:border-white/[0.15] cursor-pointer group'
                    : 'opacity-60'
                }`}
                onClick={() => {
                  if (!hasQuestions) {
                    return;
                  }

                  if (locked) {
                    navigate("/payment");
                    return;
                  }

                  navigate(`/matric/${yearNum}/${streamKey}/${subj.subject}`);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <SubjectIcon className="h-6 w-6 text-white/70" />
                    <CardTitle className="text-white text-lg">{subj.subject}</CardTitle>
                    {/* Lock icon removed - all subjects unlocked */}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1.5 text-sm text-white/50 mb-3">
                    <BookOpen className="h-4 w-4" />
                    <span>{subj.questions.length} questions</span>
                  </div>
                  {hasQuestions ? (
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/matric/${yearNum}/${streamKey}/${subj.subject}`);
                      }}
                    >
                      Start Exam
                    </Button>
                  ) : hasQuestions ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/payment");
                      }}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Unlock Subject
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-white/30 text-xs">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>Coming soon</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatricYearPage;
