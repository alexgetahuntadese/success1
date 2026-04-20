'use client';

import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageLoader from '@/components/PageLoader';

const ProfilePage = lazy(() => import('@/screens/ProfilePage'));

export default function ProfilePageRoute() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <ProfilePage />
      </Suspense>
    </ProtectedRoute>
  );
}
