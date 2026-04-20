'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const MatricStudyRoomPage = lazy(() => import('@/screens/MatricStudyRoomPage'));

export const dynamic = 'force-dynamic';

export default function MatricStudyRoomByIdPageRoute({ params }: { params: { roomId: string } }) {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <MatricStudyRoomPage roomId={params.roomId} />
      </Suspense>
    </ProtectedRoute>
  );
}
