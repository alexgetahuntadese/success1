'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const BooksPage = lazy(() => import('@/screens/BooksPage'));

export default function BooksPageRoute() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <BooksPage />
      </Suspense>
    </ProtectedRoute>
  );
}
