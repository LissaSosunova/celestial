'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { type UserProfile } from '@/lib/types/userProfile';

interface UserProfileContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  register: (data: any) => Promise<UserProfile>;
  login: (data: any) => Promise<UserProfile>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isOnboardingCompleted: boolean;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const userProfile = useUserProfile();

  const value: UserProfileContextType = {
    ...userProfile,
    isAuthenticated: !!userProfile.profile,
    isOnboardingCompleted: userProfile.profile?.onboardingCompleted || false,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProfileProvider');
  }
  return context;
}