'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export interface UserProfile {
  uid: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  gender: string;
  onboardingCompleted: boolean;
}

// Вспомогательные функции для работы с cookies
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number = 30) {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function removeCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();

  const loadProfile = useCallback(() => {
    try {
      setIsLoading(true);
      const cookieProfile = getCookie('userProfile');
      
      if (cookieProfile) {
        const parsedProfile = JSON.parse(cookieProfile);
        setProfile(parsedProfile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProfile = useCallback(async (newProfile: UserProfile) => {
    try {
      setCookie('userProfile', JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (err) {
      console.error('Error saving profile:', err);
      throw err;
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!profile) throw new Error('No profile loaded');
    const updatedProfile = { ...profile, ...updates };
    await saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  const clearProfile = useCallback(() => {
    removeCookie('userProfile');
    setProfile(null);
  }, []);

  const signOut = useCallback(async () => {
    try {
      removeCookie('userProfile');
      setProfile(null);
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userProfile');
      }
      
      router.push(`/${locale}`);
      router.refresh();
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out');
    }
  }, [router, locale]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    saveProfile,
    clearProfile,
    signOut,
    isOnboardingCompleted: profile?.onboardingCompleted || false
  };
}