'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const BookSubjectsPage = lazy(() => import('@/screens/BookSubjectsPage'));

export default function BookSubjectsPageRoute({ params }: { params: { grade: string } }) {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <BookSubjectsPage grade={params.grade} />
      </Suspense>
    </ProtectedRoute>
  );
}
