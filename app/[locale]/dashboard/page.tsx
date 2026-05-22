import { getUserProfile } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import { Dashboard } from '@/components/Dashboard';
import { Suspense } from 'react';

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  const profile = await getUserProfile();
  
  if (!profile) {
    redirect(`/${locale}/`);
  }
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard profile={profile} />
    </Suspense>
  );
}