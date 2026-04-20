'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const DashboardPage = lazy(() => import('@/screens/DashboardPage'));

export default function DashboardPageRoute() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <DashboardPage />
      </Suspense>
    </ProtectedRoute>
  );
}
