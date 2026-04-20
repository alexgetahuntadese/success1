'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const PerformancePage = lazy(() => import('@/screens/PerformancePage'));

export default function PerformancePageRoute() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <PerformancePage />
      </Suspense>
    </ProtectedRoute>
  );
}
