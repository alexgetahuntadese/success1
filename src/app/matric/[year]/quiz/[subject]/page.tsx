'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const MatricQuizPage = lazy(() => import('@/screens/MatricQuizPage'));

export default function MatricQuizBySubjectPageRoute({ params }: { params: { year: string; subject: string } }) {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <MatricQuizPage year={params.year} subject={params.subject} />
      </Suspense>
    </ProtectedRoute>
  );
}
