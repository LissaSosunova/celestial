'use client';

import { Footer } from './Footer';
import { useUserProfile } from '@/lib/hooks/useUserProfile';

export function ClientFooter() {
  const { profile, signOut } = useUserProfile();
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  const hasProfile = !!(profile && profile.onboardingCompleted === true);
  
  return <Footer onSignOut={handleSignOut} showSignOut={hasProfile} />;
}