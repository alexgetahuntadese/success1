
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import QuestionExplanation from './QuestionExplanation';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: string;
  onAnswerSelect: (answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
  showAnswer?: boolean;
  userAnswer?: string;
}

const QuestionCard = ({ 
  question, 
  selectedAnswer, 
  onAnswerSelect, 
  questionNumber, 
  totalQuestions,
  showAnswer = false,
  userAnswer = ''
}: QuestionCardProps) => {
  // Ensure we have valid question data
  if (!question || !question.question || !Array.isArray(question.options) || question.options.length < 2) {
    return (
      <Card className="bg-red-900/20 border-red-500/30 text-white mb-6">
        <CardContent className="p-6">
          <p className="text-red-400">Invalid question data. Please try refreshing the quiz.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/20 text-white mb-6">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="bg-blue-500 text-white">
            Question {questionNumber} of {totalQuestions}
          </Badge>
        </div>
        <CardTitle className="text-lg font-medium text-white leading-relaxed">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {question.options.map((option, index) => {
            let buttonClass = `w-full justify-start text-left h-auto p-4 transition-all duration-200 `;
            
            if (showAnswer) {
              // When answer is revealed, highlight correct and incorrect answers
              if (option === question.correct) {
                buttonClass += "bg-green-600 hover:bg-green-700 text-white border-green-600";
              } else if (option === selectedAnswer && option !== question.correct) {
                buttonClass += "bg-red-600 hover:bg-red-700 text-white border-red-600";
              } else {
                buttonClass += "bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30";
              }
            } else {
              // Normal state when answer is not revealed
              if (selectedAnswer === option) {
                buttonClass += "bg-blue-600 hover:bg-blue-700 text-white border-blue-600";
              } else {
                buttonClass += "bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30";
              }
            }

            return (
              <Button
                key={`${question.id}-option-${index}`}
                variant="outline"
                className={buttonClass}
                onClick={() => !showAnswer && onAnswerSelect(option)}
                disabled={showAnswer}
              >
                <span className="mr-3 font-semibold flex-shrink-0">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="flex-1">{option}</span>
              </Button>
            );
          })}
        </div>

        {showAnswer && (
          <QuestionExplanation
            isCorrect={userAnswer === question.correct}
            correctAnswer={question.correct}
            explanation={question.explanation}
            userAnswer={userAnswer}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
