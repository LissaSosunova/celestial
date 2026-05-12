'use client';

import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { UnauthenticatedContent } from './UnauthenticatedContent';
import { AuthenticatedContent } from './AuthenticatedContent';

export function HomePageWrapper() {
  const { profile, isLoading, signOut } = useUserProfile();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  const hasProfile = !!(profile && profile.onboardingCompleted === true);
  
  return (
    <>
      {hasProfile 
        ? <AuthenticatedContent />
        : <UnauthenticatedContent />}
    </>
  );
}