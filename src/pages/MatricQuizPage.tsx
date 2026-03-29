import { Fragment, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { getMatricQuestions, MatricExamQuestion } from '@/data/matricExams';
import TopBar from '@/components/TopBar';
import StarField from '@/components/StarField';

const MatricQuizPage = () => {
  const { year, stream, subject } = useParams<{ year: string; stream: string; subject: string }>();
  const navigate = useNavigate();
  const yearNum = Number(year);
  const streamKey = stream ?? 'natural';
  const streamLabel = streamKey === 'social' ? 'Social Science' : 'Natural Science';
  const questions = getMatricQuestions(yearNum, streamKey, subject ?? '');
  const scoreableQuestions = questions.filter((question) => question.correctAnswer >= 0).length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 pt-14 px-4 pb-4 overflow-hidden relative flex items-center justify-center">
        <StarField starCount={30} shootingCount={2} />
        <TopBar />
        <div className="text-center text-white relative z-10">
          <p className="text-xl mb-4">No questions available yet for {subject} ({yearNum} E.C.)</p>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => navigate(`/matric/${yearNum}/${streamKey}`)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion: MatricExamQuestion = questions[currentIndex];

  const renderRichText = (text: string, keyPrefix: string) => {
    const parts = text.split(/(\[Image:\s*[^\]]+\])/g).filter(Boolean);

    return parts.map((part, index) => {
      const match = part.match(/^\[Image:\s*([^\]]+)\]$/);
      if (!match) {
        return (
          <span key={`${keyPrefix}-text-${index}`} className="whitespace-pre-line">
            {part}
          </span>
        );
      }

      const source = match[1].trim();
      if (!/^https?:\/\//i.test(source)) {
        return (
          <span key={`${keyPrefix}-placeholder-${index}`} className="text-white/45 text-sm italic">
            {part}
          </span>
        );
      }

      return (
        <img
          key={`${keyPrefix}-image-${index}`}
          src={source}
          alt="Exam diagram"
          loading="lazy"
          className="w-full max-h-72 object-contain rounded-xl border border-white/10 bg-white p-2"
        />
      );
    });
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (currentQuestion.correctAnswer >= 0 && index === currentQuestion.correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  if (finished) {
    const percentage = scoreableQuestions > 0
      ? Math.round((score / scoreableQuestions) * 100)
      : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 pt-14 px-4 pb-4 overflow-hidden relative">
        <StarField starCount={30} shootingCount={2} />
        <TopBar />
        <div className="max-w-lg mx-auto relative z-10 mt-20 text-center">
          <Card className="bg-white/[0.06] backdrop-blur-xl border-white/[0.1]">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-white mb-2">Exam Complete!</h2>
              <p className="text-white/50 mb-6">{subject} - {streamLabel} - {yearNum} E.C.</p>
              <div className="text-6xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
                {percentage}%
              </div>
              <p className="text-white/60 mb-2">{score} / {scoreableQuestions || questions.length} correct</p>
              {scoreableQuestions === 0 && (
                <p className="text-white/40 text-sm mb-8">
                  This exam set does not include an official answer key in the source.
                </p>
              )}
              {scoreableQuestions > 0 && <div className="mb-8" />}
              <div className="flex gap-3 justify-center">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => navigate(`/matric/${yearNum}/${streamKey}`)}>
                  Back to Subjects
                </Button>
                <Button
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                  onClick={() => {
                    setCurrentIndex(0);
                    setSelectedAnswer(null);
                    setShowExplanation(false);
                    setScore(0);
                    setFinished(false);
                  }}
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 pt-14 px-4 pb-4 overflow-hidden relative">
      <StarField starCount={30} shootingCount={2} />
      <TopBar />

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/matric/${yearNum}/${streamKey}`)} className="text-white/60 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">{subject} - {streamLabel} - {yearNum} E.C.</h1>
            <p className="text-white/40 text-sm">Question {currentIndex + 1} of {questions.length}</p>
          </div>
        </div>

        <div className="w-full h-1.5 bg-white/10 rounded-full mb-8">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {(currentQuestion.sectionGroupTitle || currentQuestion.sectionTitle || currentQuestion.sectionDirection) && (
          <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            {currentQuestion.sectionGroupTitle && (
              <div className="text-sm text-white/50 font-semibold mb-1">{currentQuestion.sectionGroupTitle}</div>
            )}
            {currentQuestion.sectionTitle && (
              <div className="text-white font-bold text-lg mb-2">{currentQuestion.sectionTitle}</div>
            )}
            {currentQuestion.sectionDirection && (
              <div className="text-white/60 text-sm whitespace-pre-line">{currentQuestion.sectionDirection}</div>
            )}
          </div>
        )}

        <Card className="bg-white/[0.04] backdrop-blur-xl border-white/[0.08] mb-6">
          <CardContent className="p-6">
            <div className="text-white text-lg font-medium mb-6 space-y-3">
              <div>
                <span className="text-white/50 mr-2">{currentIndex + 1}.</span>
                {renderRichText(currentQuestion.question, `question-${currentQuestion.id}`).map((node, index) => (
                  <Fragment key={`question-fragment-${index}`}>{node}</Fragment>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                let borderClass = 'border-white/[0.08] hover:border-white/20';
                let bgClass = 'bg-white/[0.02] hover:bg-white/[0.06]';
                const hasAnswerKey = currentQuestion.correctAnswer >= 0;

                if (selectedAnswer !== null) {
                  if (hasAnswerKey && idx === currentQuestion.correctAnswer) {
                    borderClass = 'border-emerald-500/50';
                    bgClass = 'bg-emerald-500/10';
                  } else if (idx === selectedAnswer) {
                    borderClass = hasAnswerKey ? 'border-red-500/50' : 'border-amber-500/40';
                    bgClass = hasAnswerKey ? 'bg-red-500/10' : 'bg-amber-500/10';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 rounded-xl border ${borderClass} ${bgClass} transition-all duration-200 flex items-center gap-3`}
                  >
                    <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 text-sm font-medium shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <div className="text-white/80 text-sm flex-1 space-y-2">
                      {renderRichText(option, `option-${currentQuestion.id}-${idx}`).map((node, nodeIndex) => (
                        <Fragment key={`option-fragment-${nodeIndex}`}>{node}</Fragment>
                      ))}
                    </div>
                    {selectedAnswer !== null && hasAnswerKey && idx === currentQuestion.correctAnswer && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 ml-auto shrink-0" />
                    )}
                    {selectedAnswer === idx && hasAnswerKey && idx !== currentQuestion.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-400 ml-auto shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {showExplanation && (
          <Card className="bg-white/[0.04] backdrop-blur-xl border-white/[0.08] mb-6 animate-fade-in">
            <CardContent className="p-5">
              {currentQuestion.correctAnswer >= 0 ? (
                <p className="text-emerald-300 text-sm font-medium mb-2">
                  Correct answer: {String.fromCharCode(65 + currentQuestion.correctAnswer)}.{' '}
                  {currentQuestion.options[currentQuestion.correctAnswer]}
                </p>
              ) : (
                <p className="text-amber-300 text-sm font-medium mb-2">
                  Official answer key unavailable in the source.
                </p>
              )}
              <p className="text-white/70 text-sm">{currentQuestion.explanation}</p>
            </CardContent>
          </Card>
        )}

        {selectedAnswer !== null && (
          <div className="flex justify-end">
            <Button onClick={handleNext} className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white gap-2">
              {currentIndex + 1 >= questions.length ? 'Finish' : 'Next'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatricQuizPage;
