'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const MatricStudyRoomPage = lazy(() => import('@/screens/MatricStudyRoomPage'));

export const dynamic = 'force-dynamic';

export default function MatricStudyRoomPageRoute() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <MatricStudyRoomPage />
      </Suspense>
    </ProtectedRoute>
  );
}
