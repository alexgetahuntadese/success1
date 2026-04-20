'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const GradesPage = lazy(() => import('@/screens/GradesPage'));

export const dynamic = 'force-dynamic';

export default function GradesPageRoute() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <GradesPage />
      </Suspense>
    </ProtectedRoute>
  );
}
