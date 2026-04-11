'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import Index from '@/pages/Index';

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-950">
    <div className="flex flex-col items-center gap-4 text-white">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span className="text-sm">Loading...</span>
    </div>
  </div>
);

export default function Home() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Index />
    </Suspense>
  );
}
