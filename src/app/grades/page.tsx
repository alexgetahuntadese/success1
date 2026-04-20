'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const GradesPage = lazy(() => import('@/screens/GradesPage'));

export default function GradesPageRoute() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <GradesPage />
      </Suspense>
    </ProtectedRoute>
  );
}
