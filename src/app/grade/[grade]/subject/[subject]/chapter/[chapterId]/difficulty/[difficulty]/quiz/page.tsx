'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const QuizPage = lazy(() => import('@/screens/QuizPage'));

export default function QuizPageRoute({ 
  params 
}: { 
  params: { 
    grade: string; 
    subject: string; 
    chapterId: string; 
    difficulty: string 
  } 
}) {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <QuizPage 
          grade={params.grade}
          subject={params.subject}
          chapterId={params.chapterId}
          difficulty={params.difficulty}
        />
      </Suspense>
    </ProtectedRoute>
  );
}
