'use client';

import { lazy, Suspense } from 'react';
import PublicRoute from '@/components/PublicRoute';
import PageLoader from '@/components/PageLoader';

const LoginPage = lazy(() => import('@/screens/LoginPage'));

export default function LoginPageRoute() {
  return (
    <PublicRoute>
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    </PublicRoute>
  );
}
