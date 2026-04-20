'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const PaymentPage = lazy(() => import('@/screens/PaymentPage'));

export default function PaymentPageRoute() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <PaymentPage />
      </Suspense>
    </ProtectedRoute>
  );
}
