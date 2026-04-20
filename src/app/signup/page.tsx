'use client';

import { lazy, Suspense } from 'react';
import PublicRoute from '@/components/PublicRoute';
import PageLoader from '@/components/PageLoader';

const SignUpPage = lazy(() => import('@/screens/SignUpPage'));

export default function SignUpPageRoute() {
  return (
    <PublicRoute>
      <Suspense fallback={<PageLoader />}>
        <SignUpPage />
      </Suspense>
    </PublicRoute>
  );
}
