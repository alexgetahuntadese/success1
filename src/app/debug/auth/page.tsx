'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const AuthDebug = lazy(() => import('@/components/debug/AuthDebug'));
const PaymentDebug = lazy(() => import('@/components/debug/PaymentDebug'));

const DebugAuthPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-slate-950 pt-14 px-4">
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white mb-4">Auth Debug</h1>
      <Suspense fallback={<PageLoader />}>
        <AuthDebug />
      </Suspense>
      <Suspense fallback={<PageLoader />}>
        <PaymentDebug />
      </Suspense>
    </div>
  </div>
);

export const dynamic = 'force-dynamic';

export default function DebugAuthPageRoute() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <DebugAuthPage />
      </Suspense>
    </ProtectedRoute>
  );
}
