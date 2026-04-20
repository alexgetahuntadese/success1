'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const MatricStreamPage = lazy(() => import('@/screens/MatricStreamPage'));

export default function MatricStreamPageRoute({ params }: { params: { year: string } }) {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <MatricStreamPage year={params.year} />
      </Suspense>
    </ProtectedRoute>
  );
}
