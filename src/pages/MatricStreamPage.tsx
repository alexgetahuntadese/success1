import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, FlaskConical, Landmark } from 'lucide-react';
import { getMatricStreamsForYear } from '@/data/matricExams';
import TopBar from '@/components/TopBar';
import StarField from '@/components/StarField';

const streamIcons = {
  natural: FlaskConical,
  social: Landmark,
} as const;

const MatricStreamPage = () => {
  const { year } = useParams<{ year: string }>();
  const navigate = useNavigate();
  const yearNum = Number(year);
  const streams = getMatricStreamsForYear(yearNum);

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
            <p className="text-white/50 text-sm mt-1">Choose a stream to view the right exam subjects</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {streams.map((stream) => {
            const StreamIcon = streamIcons[stream.key as keyof typeof streamIcons] ?? BookOpen;
            const totalQuestions = stream.subjects.reduce((sum, subject) => sum + subject.questions.length, 0);

            return (
              <Card
                key={stream.key}
                className="bg-white/[0.04] backdrop-blur-xl border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/matric/${yearNum}/${stream.key}`)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <StreamIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-xl">{stream.label}</CardTitle>
                      <CardDescription className="text-white/40">{yearNum} E.C. exam stream</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-white/50">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      <span>{stream.subjects.length} subjects</span>
                    </div>
                    <span>{totalQuestions} questions</span>
                  </div>
                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/matric/${yearNum}/${stream.key}`);
                    }}
                  >
                    View Subjects
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatricStreamPage;
