'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const SessionPage = lazy(() => import('@/screens/SessionPage'));

export default function SessionPageRoute({ params }: { params: { sessionCode: string } }) {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <SessionPage sessionCode={params.sessionCode} />
      </Suspense>
    </ProtectedRoute>
  );
}
