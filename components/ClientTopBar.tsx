'use client';

import dynamic from 'next/dynamic';
import { useUser } from '@/lib/contexts/UserProfileProvider';

// Динамический импорт TopBar без SSR для предотвращения ошибок гидратации
const TopBar = dynamic(() => import('./TopBar').then(mod => mod.TopBar), {
  ssr: false,
  loading: () => (
    <div className="px-4 md:px-12 py-4 border-b border-border-light bg-white/50">
      <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
    </div>
  ),
});

export function ClientTopBar() {
  const { isLoading } = useUser();
  
  if (isLoading) {
    return (
      <div className="px-4 md:px-12 py-4 border-b border-border-light bg-white/50">
        <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }
  
  return <TopBar />;
}