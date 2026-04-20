'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const ChaptersPage = lazy(() => import('@/screens/ChaptersPage'));

export default function ChaptersPageRoute({ params }: { params: { grade: string; subject: string } }) {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <ChaptersPage grade={params.grade} subject={params.subject} />
      </Suspense>
    </ProtectedRoute>
  );
}
