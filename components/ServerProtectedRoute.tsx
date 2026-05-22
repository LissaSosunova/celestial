import { getUserProfile } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

interface ServerProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  locale: string;
}

export async function ServerProtectedRoute({ 
  children, 
  redirectTo = '/', 
  locale 
}: ServerProtectedRouteProps) {
  const profile = await getUserProfile();
  
  if (!profile) {
    redirect(`/${locale}${redirectTo}`);
  }
  
  return <>{children}</>;
}