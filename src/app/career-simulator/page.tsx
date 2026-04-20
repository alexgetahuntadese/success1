'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const CareerSimulatorPage = lazy(() => import('@/screens/CareerSimulatorPage'));

export const dynamic = 'force-dynamic';

export default function CareerSimulatorPageRoute() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <CareerSimulatorPage />
      </Suspense>
    </ProtectedRoute>
  );
}
