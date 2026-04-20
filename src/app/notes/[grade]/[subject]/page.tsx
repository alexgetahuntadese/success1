'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const NotesChaptersPage = lazy(() => import('@/screens/NotesChaptersPage'));

export default function NotesChaptersPageRoute({ params }: { params: { grade: string; subject: string } }) {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <NotesChaptersPage grade={params.grade} subject={params.subject} />
      </Suspense>
    </ProtectedRoute>
  );
}
