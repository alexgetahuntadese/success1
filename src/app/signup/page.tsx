'use client';

import { lazy, Suspense } from 'react';
import PublicRoute from '@/components/PublicRoute';
import PageLoader from '@/components/PageLoader';

const SignUpPage = lazy(() => import('@/screens/SignUpPage'));

export const dynamic = 'force-dynamic';

export default function SignUpPageRoute() {
  return (
    <PublicRoute>
      <Suspense fallback={<PageLoader />}>
        <SignUpPage />
      </Suspense>
    </PublicRoute>
  );
}
