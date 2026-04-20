'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const NotesPage = lazy(() => import('@/screens/NotesPage'));

export default function NotesPageRoute() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <NotesPage />
      </Suspense>
    </ProtectedRoute>
  );
}
