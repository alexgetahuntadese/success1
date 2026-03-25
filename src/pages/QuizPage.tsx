import React, { useState, useEffect } from 'react';
import StarField from '@/components/StarField';
import { useParams, useNavigate } from 'react-router-dom';
import { grade12Mathematics } from '@/data/grade12Mathematics';
import { grade12PhysicsQuestions } from '@/data/grade12PhysicsQuestions';
import { grade12ChemistryQuestions } from '@/data/grade12ChemistryQuestions';
import { grade12BiologyQuestions } from '@/data/grade12BiologyQuestions';
import { grade12EnglishQuestions } from '@/data/grade12EnglishQuestions';
import { grade12CivicsQuestions } from '@/data/grade12CivicsQuestions';
import { grade12HistoryQuestions } from '@/data/grade12HistoryQuestions';
import { grade12ITQuestions } from '@/data/grade12ITQuestions';
import { grade12AgricultureQuestions } from '@/data/grade12AgricultureQuestions';
import { getGrade12GeographyQuestions } from '@/data/grade12GeographyQuestions';
import { getGrade11BiologyQuestions } from '@/data/grade11Biology';
import { getGrade11PhysicsQuestions } from '@/data/grade11Physics';
import { getGrade11ChemistryQuestions } from '@/data/grade11Chemistry';
import { getGrade11AgricultureQuestions } from '@/data/grade11AgricultureQuestions';
import { getGrade11MathematicsQuestions } from '@/data/grade11MathematicsQuestions';
import { grade11CivicsQuestions } from '@/data/grade11CivicsQuestions';
import { getGrade10BiologyQuestions } from '@/data/grade10BiologyQuestions';
import { grade10MathematicsQuestions } from '@/data/grade10MathematicsQuestions';
import { grade10PhysicsQuestions } from '@/data/grade10PhysicsQuestions';
import { grade10ChemistryQuestions } from '@/data/grade10ChemistryQuestions';
import { grade10EnglishQuestions } from '@/data/grade10EnglishQuestions';
import { grade10CivicsQuestions } from '@/data/grade10CivicsQuestions';
import { grade10GeographyQuestions } from '@/data/grade10GeographyQuestions';
import { grade10EconomicsQuestions } from '@/data/grade10EconomicsQuestions';

import QuestionCard from '@/components/QuestionCard';
import Results from '@/components/Results';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Eye } from 'lucide-react';
import TopBar from "@/components/TopBar";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

const getQuestionsForSubject = (subject: string, chapter: string, difficulty: string, grade: string, count: number = 10): Question[] => {
  let allQuestions: any[] = [];
  
  console.log('Getting questions for:', { subject, chapter, difficulty, grade });
  
  try {
    // Handle Grade 11 subjects
    // Handle Grade 9 - no questions yet
    if (grade === '9') {
      console.warn(`Grade 9 questions not yet available for ${subject}`);
      return [];
    }

    // Handle Grade 10
    if (grade === '10') {
      const difficultyLevel = difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
      const subjectLower = subject.toLowerCase();
      
      if (subjectLower === 'biology') {
        allQuestions = getGrade10BiologyQuestions(chapter, difficultyLevel, count);
        return allQuestions;
      }
      
      // Handle Math and Physics via their data objects
      const grade10DataMap: Record<string, Record<string, any[]>> = {
        'mathematics': grade10MathematicsQuestions,
        'physics': grade10PhysicsQuestions,
        'chemistry': grade10ChemistryQuestions,
        'english': grade10EnglishQuestions,
        'civic education': grade10CivicsQuestions,
        'civics': grade10CivicsQuestions,
        'geography': grade10GeographyQuestions,
        'economics': grade10EconomicsQuestions,
      };
      
      const subjectQuestions = grade10DataMap[subjectLower];
      if (subjectQuestions) {
        const chapterData = subjectQuestions[chapter];
        if (chapterData && Array.isArray(chapterData)) {
          const filtered = chapterData.filter((q: any) => q.difficulty?.toLowerCase() === difficultyLevel).slice(0, count);
          return filtered.map((q: any, index: number) => ({
            id: q.id || `q-${index}`,
            question: q.question,
            options: q.options,
            correct: q.correct,
            explanation: q.explanation || 'No explanation provided.'
          }));
        }
      }
      
      console.warn(`Grade 10 ${subject} questions not yet available`);
      return [];
    }

    if (grade === '11') {
      const difficultyLevel = difficulty.toLowerCase() as 'easy' | 'medium' | 'hard';
      
      switch (subject) {
        case 'Biology':
          const grade11BioQuestions = getGrade11BiologyQuestions(chapter, difficultyLevel, count);
          return grade11BioQuestions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correct: q.correct,
            explanation: q.explanation
          }));
          
        case 'Physics':
          const grade11PhyQuestions = getGrade11PhysicsQuestions(chapter, difficultyLevel, count);
          return grade11PhyQuestions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correct: q.correct,
            explanation: q.explanation
          }));
          
        case 'Chemistry':
          const grade11ChemQuestions = getGrade11ChemistryQuestions(chapter, difficultyLevel, count);
          return grade11ChemQuestions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correct: q.correct,
            explanation: q.explanation
          }));
          
        case 'Agriculture':
          const grade11AgriQuestions = getGrade11AgricultureQuestions(chapter, difficultyLevel, count);
          return grade11AgriQuestions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correct: q.correct,
            explanation: q.explanation
          }));
          
        case 'Mathematics':
          const allMathQuestions = getGrade11MathematicsQuestions(chapter);
          const grade11MathQuestions = (difficultyLevel && difficultyLevel !== 'all' as string 
            ? allMathQuestions.filter(q => q.difficulty.toLowerCase() === difficultyLevel.toLowerCase()) 
            : allMathQuestions).slice(0, count);
          return grade11MathQuestions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correct: q.correct,
            explanation: q.explanation
          }));

        case 'Civics':
        case 'Civic Education':
          const civicsData = grade11CivicsQuestions[chapter];
          if (!civicsData) return [];
          const filteredCivics = civicsData.filter(q => q.difficulty.toLowerCase() === difficultyLevel).slice(0, count);
          return filteredCivics.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correct: q.correct,
            explanation: q.explanation
          }));
          
        default:
          console.warn('Grade 11 subject not implemented:', subject);
          return [];
      }
    }
    
    // Handle Grade 12 subjects (existing logic)
    switch (subject) {
      case 'Mathematics':
        const mathData = grade12Mathematics[chapter];
        allQuestions = Array.isArray(mathData) ? mathData : [];
        break;
      case 'Physics':
        const physicsData = grade12PhysicsQuestions[chapter];
        allQuestions = Array.isArray(physicsData) ? physicsData : [];
        break;
      case 'Chemistry':
        const chemData = grade12ChemistryQuestions[chapter];
        allQuestions = Array.isArray(chemData) ? chemData : [];
        break;
      case 'Biology':
        const bioData = grade12BiologyQuestions[chapter];
        allQuestions = Array.isArray(bioData) ? bioData : [];
        break;
      case 'English':
        const engData = grade12EnglishQuestions[chapter];
        allQuestions = Array.isArray(engData) ? engData : [];
        break;
      case 'Civics':
      case 'Civic Education':
        const civicsData = grade12CivicsQuestions[chapter];
        allQuestions = Array.isArray(civicsData) ? civicsData : [];
        break;
      case 'History':
        const histData = grade12HistoryQuestions[chapter];
        allQuestions = Array.isArray(histData) ? histData : [];
        break;
      case 'IT':
      case 'Information Technology':
        const itData = grade12ITQuestions[chapter];
        allQuestions = Array.isArray(itData) ? itData : [];
        break;
      case 'Agriculture':
        const agriData = grade12AgricultureQuestions[chapter];
        allQuestions = Array.isArray(agriData) ? agriData : [];
        break;
      case 'Geography':
        return getGrade12GeographyQuestions(chapter, difficulty.toLowerCase() as 'easy' | 'medium' | 'hard', count);
      default:
        console.warn('Unknown subject:', subject);
        return [];
    }

    console.log('Raw questions found:', allQuestions.length);

    // Filter by difficulty if the questions have difficulty property
    const filteredQuestions = allQuestions.filter(q => {
      if (q.difficulty) {
        return q.difficulty.toLowerCase() === difficulty.toLowerCase();
      }
      return true;
    });

    console.log('Filtered questions by difficulty:', filteredQuestions.length);

    // Convert to standard Question format
    const convertedQuestions = filteredQuestions.map((q, index) => ({
      id: q.id?.toString() || `question-${index}-${Math.random().toString(36).substr(2, 9)}`,
      question: q.question || 'Question not available',
      options: Array.isArray(q.options) ? q.options : [],
      correct: q.correct || '',
      explanation: q.explanation || "No explanation provided."
    }));

    // Filter out invalid questions
    const validQuestions = convertedQuestions.filter(q => 
      q.question !== 'Question not available' && 
      q.options.length >= 2 && 
      q.correct && 
      q.options.includes(q.correct)
    );

    console.log('Valid questions:', validQuestions.length);

    // Shuffle and return requested count
    const shuffled = validQuestions.sort(() => Math.random() - 0.5);
    const finalQuestions = shuffled.slice(0, Math.min(count, shuffled.length));
    
    console.log('Final questions to return:', finalQuestions.length);
    
    return finalQuestions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
};

const QuizPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const subject = params.subject;
  const chapterId = params.chapterId ? decodeURIComponent(params.chapterId) : null;
  const difficulty = params.difficulty;
  const grade = params.grade;
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnswerForQuestion, setShowAnswerForQuestion] = useState<number | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());

  const initializeQuestions = () => {
    console.log('Initializing questions with params:', { subject, chapterId, difficulty, grade });
    
    if (!subject || !chapterId || !difficulty || !grade) {
      setError('Missing required quiz parameters');
      setIsLoading(false);
      return;
    }
    
    try {
      const fetchedQuestions = getQuestionsForSubject(subject, chapterId, difficulty, grade, 10);
      
      if (fetchedQuestions.length > 0) {
        console.log('Questions loaded successfully:', fetchedQuestions.length);
        setQuestions(fetchedQuestions);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setShowResults(false);
        setStartTime(Date.now());
        setElapsedTime(0);
        setError(null);
      } else {
        console.error('No questions found for:', { subject, chapter: chapterId, difficulty, grade });
        setError(`No questions available for Grade ${grade} ${subject} - ${chapterId} (${difficulty} level)`);
        setQuestions([]);
      }
    } catch (err) {
      console.error('Error initializing questions:', err);
      setError('Failed to load quiz questions. Please try again.');
      setQuestions([]);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    initializeQuestions();
  }, [subject, chapterId, difficulty]);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (!showResults && !isLoading && startTime > 0 && questions.length > 0) {
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [showResults, startTime, isLoading, questions.length]);

  const handleAnswerSelect = (answer: string) => {
    console.log('Answer selected:', answer, 'for question index:', currentQuestionIndex);
    setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: answer });
  };

  const handleShowAnswer = () => {
    console.log('Show answer clicked for question index:', currentQuestionIndex);
    setShowAnswerForQuestion(currentQuestionIndex);
    setRevealedAnswers(prev => new Set([...prev, currentQuestionIndex]));
  };

  const handleNextQuestion = () => {
    console.log('Next question clicked, current index:', currentQuestionIndex, 'total:', questions.length);
    setShowAnswerForQuestion(null); // Hide explanation when moving to next question
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = (): number => {
    let correctAnswersCount = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correctAnswersCount++;
      }
    });
    return correctAnswersCount;
  };

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
  
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  };

  const handleRetakeQuiz = () => {
    setShowAnswerForQuestion(null);
    setRevealedAnswers(new Set());
    initializeQuestions();
  };

  const handleBackToChapters = () => {
    if (grade && subject) {
      navigate(`/grade/${grade}/subject/${subject}/chapters`);
    } else {
      navigate(-1);
    }
  };

  if (isLoading) {
    return (
    <div className="container mx-auto pt-14 px-4 pb-4 min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 overflow-hidden relative">
      <StarField starCount={30} shootingCount={2} />
      <TopBar />
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToChapters}
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h2 className="text-2xl font-semibold text-white">
            Loading Quiz...
          </h2>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-[250px] bg-white/[0.08]" />
          <Skeleton className="h-4 w-[400px] bg-white/[0.08]" />
          <Skeleton className="h-10 bg-white/[0.08]" />
          <Skeleton className="h-10 bg-white/[0.08]" />
          <Skeleton className="h-10 bg-white/[0.08]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
    <div className="container mx-auto pt-14 px-4 pb-4 min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 overflow-hidden relative">
      <StarField starCount={30} shootingCount={2} />
      <TopBar />
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToChapters}
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h2 className="text-2xl font-semibold text-white">
            Quiz Error
          </h2>
        </div>
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <div className="space-x-4">
            <Button 
              onClick={initializeQuestions}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
            >
              Try Again
            </Button>
            <Button 
              variant="outline"
              onClick={handleBackToChapters}
              className="border-white/[0.08] text-white hover:bg-white/10"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!subject || !chapterId || !difficulty) {
    return (
    <div className="container mx-auto pt-14 px-4 pb-4 min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 overflow-hidden relative">
      <StarField starCount={30} shootingCount={2} />
      <TopBar />
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToChapters}
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h2 className="text-2xl font-semibold text-white">
            Invalid Quiz Parameters
          </h2>
        </div>
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
          <p className="text-yellow-400">Missing required parameters. Please navigate from the subjects page.</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
    <div className="container mx-auto pt-14 px-4 pb-4 min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 overflow-hidden relative">
      <StarField starCount={30} shootingCount={2} />
      <TopBar />
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToChapters}
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h2 className="text-2xl font-semibold text-white">
            {subject} - {chapterId} ({difficulty})
          </h2>
        </div>
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
          <p className="text-blue-400 text-lg mb-4">No questions available for this chapter and difficulty level.</p>
          <Button 
            variant="outline"
            onClick={handleBackToChapters}
            className="border-white/[0.08] text-white hover:bg-white/10"
          >
            Choose Different Chapter
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
    <div className="container mx-auto pt-14 px-4 pb-4 min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 overflow-hidden relative">
      <StarField starCount={30} shootingCount={2} />
      <TopBar />
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToChapters}
            className="text-white hover:bg-white/10 mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h2 className="text-2xl font-semibold text-white">
            Quiz Error
          </h2>
        </div>
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
          <p className="text-red-400">Unable to load the current question. Please try refreshing the page.</p>
          <Button 
            onClick={initializeQuestions}
            className="mt-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-14 px-4 pb-4 min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950 overflow-hidden relative">
      <StarField starCount={30} shootingCount={2} />
      <TopBar />
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBackToChapters}
          className="text-white hover:bg-white/10 mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h2 className="text-lg sm:text-2xl font-semibold text-white">
          Grade {grade} {subject} - {chapterId} ({difficulty})
        </h2>
      </div>

      {showResults ? (
        <Results 
          score={calculateScore()} 
          totalQuestions={questions.length} 
          timeTaken={formatTime(elapsedTime)}
          onRetakeQuiz={handleRetakeQuiz}
          questions={questions}
          selectedAnswers={selectedAnswers}
        />
      ) : (
        <div className="space-y-6">
          <p className="text-white/50 mb-2">
            Time Elapsed: <span className="font-bold text-white">{formatTime(elapsedTime)}</span>
          </p>
          
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={selectedAnswers[currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            showAnswer={showAnswerForQuestion === currentQuestionIndex}
            userAnswer={selectedAnswers[currentQuestionIndex]}
          />
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="text-sm text-white/40">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="flex gap-3">
              {!revealedAnswers.has(currentQuestionIndex) && (
                <Button
                  onClick={handleShowAnswer}
                  variant="outline"
                  size="sm"
                  className="border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-400"
                >
                  <Eye className="mr-1 h-4 w-4" />
                  Show Answer
                </Button>
              )}
              <Button 
                onClick={handleNextQuestion} 
                disabled={!selectedAnswers[currentQuestionIndex]}
                size="sm"
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white disabled:opacity-50"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
