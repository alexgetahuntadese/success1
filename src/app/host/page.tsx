'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const HostPage = lazy(() => import('@/screens/HostPage'));

export default function HostPageRoute() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <HostPage />
      </Suspense>
    </ProtectedRoute>
  );
}
