import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react';
import { getMatricSubjectsForYear } from '@/data/matricExams';
import TopBar from '@/components/TopBar';
import StarField from '@/components/StarField';

const subjectIcons: Record<string, string> = {
  Mathematics: '📐',
  Physics: '⚛️',
  Chemistry: '🧪',
  Biology: '🧬',
  English: '📝',
  Civics: '🏛️',
};

const MatricYearPage = () => {
  const { year } = useParams<{ year: string }>();
  const navigate = useNavigate();
  const yearNum = Number(year);
  const subjects = getMatricSubjectsForYear(yearNum);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 pt-14 px-4 pb-4 md:p-8 md:pt-14 overflow-hidden relative">
      <StarField starCount={40} shootingCount={2} />
      <TopBar />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/matric')}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{yearNum} E.C. National Exam</h1>
            <p className="text-white/50 text-sm mt-1">Select a subject to start practicing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((subj) => {
            const hasQuestions = subj.questions.length > 0;
            return (
              <Card
                key={subj.subject}
                className={`bg-white/[0.04] backdrop-blur-xl border-white/[0.08] transition-all duration-300 ${
                  hasQuestions
                    ? 'hover:bg-white/[0.08] hover:border-white/[0.15] cursor-pointer group'
                    : 'opacity-60'
                }`}
                onClick={() => hasQuestions && navigate(`/matric/${yearNum}/${subj.subject}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{subjectIcons[subj.subject] ?? '📚'}</span>
                    <CardTitle className="text-white text-lg">{subj.subject}</CardTitle>
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
                        navigate(`/matric/${yearNum}/${subj.subject}`);
                      }}
                    >
                      Start Exam
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
