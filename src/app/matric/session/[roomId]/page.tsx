'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const MatricExamSessionPage = lazy(() => import('@/screens/MatricExamSessionPage'));

export default function MatricExamSessionPageRoute({ params }: { params: { roomId: string } }) {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <MatricExamSessionPage roomId={params.roomId} />
      </Suspense>
    </ProtectedRoute>
  );
}
