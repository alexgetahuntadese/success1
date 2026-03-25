
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, RotateCcw, ArrowLeft, BarChart3 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { saveQuizAttempt } from '@/lib/performanceUtils';
import { saveQuizAttemptToDb } from '@/lib/dbPerformanceUtils';
import { useLanguage } from '@/i18n/LanguageContext';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

interface ResultsProps {
  score: number;
  totalQuestions: number;
  timeTaken: string;
  onRetakeQuiz: () => void;
  questions: Question[];
  selectedAnswers: { [key: number]: string };
  grade?: string;
  subject?: string;
  chapter?: string;
  difficulty?: string;
}

const Results = ({ 
  score, 
  totalQuestions, 
  timeTaken, 
  onRetakeQuiz, 
  questions, 
  selectedAnswers,
  grade,
  subject,
  chapter,
  difficulty
}: ResultsProps) => {
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useLanguage();
  const percentage = Math.round((score / totalQuestions) * 100);
  
  useEffect(() => {
    const attemptGrade = grade || params.grade || 'Unknown';
    const attemptSubject = subject || params.subject || 'Unknown';
    const attemptChapter = chapter || params.chapterId || 'Unknown';
    const attemptDifficulty = difficulty || params.difficulty || 'medium';
    
    const attemptData = {
      grade: attemptGrade,
      subject: attemptSubject,
      chapter: attemptChapter,
      difficulty: attemptDifficulty,
      score: percentage,
      correct_answers: score,
      total_questions: totalQuestions,
      time_spent: timeTaken,
    };

    // Save to localStorage (offline fallback)
    saveQuizAttempt(attemptData);
    // Save to database (if authenticated)
    saveQuizAttemptToDb(attemptData);
  }, []);
  
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBadgeColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return t('results.excellentPerformance');
    if (percentage >= 80) return t('results.greatJob');
    if (percentage >= 70) return t('results.goodWork');
    if (percentage >= 60) return t('results.fairPerformance');
    if (percentage >= 50) return t('results.improving');
    return t('results.keepStudying');
  };

  const handleBackToChapters = () => {
    if (params.grade && params.subject) {
      navigate(`/grade/${params.grade}/subject/${params.subject}/chapters`);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/5 border-white/20 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold mb-4 text-white">{t('results.complete')}</CardTitle>
          <div className="space-y-4">
            <div className={`text-6xl font-bold ${getScoreColor(percentage)}`}>
              {percentage}%
            </div>
            <Badge 
              className={`${getScoreBadgeColor(percentage)} text-white text-lg px-4 py-2`}
            >
              {score} {t('results.outOf')} {totalQuestions} {t('results.correct').toLowerCase()}
            </Badge>
            <p className="text-lg text-white/60">
              {getPerformanceMessage(percentage)}
            </p>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-white/60">
            <Clock className="h-5 w-5" />
            <span>{t('results.timeTaken')}: {timeTaken}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onRetakeQuiz}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {t('results.retake')}
            </Button>
            <Button 
              onClick={() => navigate('/performance')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              {t('results.viewPerformance')}
            </Button>
            <Button 
              variant="outline"
              onClick={handleBackToChapters}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.backToChapters')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4">{t('results.questionReview')}</h3>
        {questions.map((question, index) => {
          const userAnswer = selectedAnswers[index];
          const isCorrect = userAnswer === question.correct;
          
          return (
            <Card key={question.id} className="bg-white/5 border-white/20 text-white">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-white/[0.08] text-white">
                    {t('quiz.question')} {index + 1}
                  </Badge>
                  {isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                </div>
                <CardTitle className="text-lg font-medium text-white">
                  {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.options && question.options.map((option, optionIndex) => {
                  let buttonClass = "w-full justify-start text-left h-auto p-3 ";
                  
                  if (option === question.correct) {
                    buttonClass += "bg-green-600 border-green-500 text-white";
                  } else if (option === userAnswer && !isCorrect) {
                    buttonClass += "bg-red-600 border-red-500 text-white";
                  } else {
                    buttonClass += "bg-white/[0.04] border-white/[0.08] text-white/60";
                  }

                  return (
                    <Button
                      key={optionIndex}
                      variant="outline"
                      className={buttonClass}
                      disabled
                    >
                      <span className="mr-3 font-semibold">
                        {String.fromCharCode(65 + optionIndex)}.
                      </span>
                      {option}
                    </Button>
                  );
                })}
                
                {question.explanation && (
                  <div className="mt-4 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                    <h4 className="font-semibold text-blue-300 mb-2">{t('results.explanation')}:</h4>
                    <p className="text-white/60">{question.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Results;
