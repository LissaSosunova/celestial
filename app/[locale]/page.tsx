import { Suspense } from 'react';
import { HomePageWrapper } from '@/components/home/HomePageWrapper';

export default function HomePage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="flex-1 px-4 py-4 md:px-12 md:py-12 max-w-7xl mx-auto w-full">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <HomePageWrapper />
        </Suspense>
      </div>
    </main>
  );
}