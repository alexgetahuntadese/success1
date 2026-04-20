'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const MatricExamPage = lazy(() => import('@/screens/MatricExamPage'));

export default function MatricPageRoute() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <MatricExamPage />
      </Suspense>
    </ProtectedRoute>
  );
}
