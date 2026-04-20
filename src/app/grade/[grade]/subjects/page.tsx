'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const SubjectsPage = lazy(() => import('@/screens/SubjectsPage'));

export default function SubjectsPageRoute({ params }: { params: { grade: string } }) {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <SubjectsPage grade={params.grade} />
      </Suspense>
    </ProtectedRoute>
  );
}
