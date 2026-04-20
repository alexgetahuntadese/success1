'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const NotesSubjectsPage = lazy(() => import('@/screens/NotesSubjectsPage'));

export default function NotesSubjectsPageRoute({ params }: { params: { grade: string } }) {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <NotesSubjectsPage grade={params.grade} />
      </Suspense>
    </ProtectedRoute>
  );
}
