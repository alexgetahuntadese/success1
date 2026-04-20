'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const MatricYearPage = lazy(() => import('@/screens/MatricYearPage'));

export default function MatricYearPageRoute({ params }: { params: { year: string; stream: string } }) {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <MatricYearPage year={params.year} stream={params.stream} />
      </Suspense>
    </ProtectedRoute>
  );
}
