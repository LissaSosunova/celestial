'use client';

import { TopBar } from './TopBar';
import { useUserProfile } from '@/lib/hooks/useUserProfile';

export function ClientTopBar() {
  const { profile, signOut } = useUserProfile();
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  const hasProfile = !!(profile && profile.onboardingCompleted === true);
  
  return <TopBar onSignOut={handleSignOut} showSignOut={hasProfile} />;
}