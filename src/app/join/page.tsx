'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const JoinPage = lazy(() => import('@/screens/JoinPage'));

export default function JoinPageRoute() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <JoinPage />
      </Suspense>
    </ProtectedRoute>
  );
}
