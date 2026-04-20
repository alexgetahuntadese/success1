'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const MatricQuizPage = lazy(() => import('@/screens/MatricQuizPage'));

export default function MatricQuizPageRoute({ params }: { params: { year: string; stream: string; subject: string } }) {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <MatricQuizPage year={params.year} stream={params.stream} subject={params.subject} />
      </Suspense>
    </ProtectedRoute>
  );
}
