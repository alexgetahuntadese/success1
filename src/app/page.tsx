'use client';

import { lazy, Suspense } from 'react';
import PageLoader from '@/components/PageLoader';

const Index = lazy(() => import('@/screens/Index'));

export default function Home() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Index />
    </Suspense>
  );
}
