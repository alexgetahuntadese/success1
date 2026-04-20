'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const GradeSelection = lazy(() => import('@/screens/GradeSelection'));

export default function GradeSelectionPage({ params }: { params: { grade: string } }) {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <GradeSelection grade={params.grade} />
      </Suspense>
    </ProtectedRoute>
  );
}
