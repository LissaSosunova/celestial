'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UserProfile {
  uid: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  gender: string;
  onboardingCompleted: boolean;
}

// Демо профиль для первого запуска
const DEMO_PROFILE: UserProfile = {
  uid: 'demo-user-001',
  name: 'Soul Seeker',
  birthDate: '1990-01-01',
  birthTime: '12:00',
  birthLocation: 'Kyiv, Ukraine',
  gender: 'Woman',
  onboardingCompleted: true
};

interface UseUserProfileReturn {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  saveProfile: (profile: UserProfile) => Promise<void>;
  resetProfile: () => Promise<void>;
  clearProfile: () => void;
  isOnboardingCompleted: boolean;
}

export function useUserProfile(): UseUserProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка профиля из localStorage
  const loadProfile = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      
      const stored = localStorage.getItem('userProfile');
      
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
      } else {
        // Если нет сохраненного профиля, создаем демо
        localStorage.setItem('userProfile', JSON.stringify(DEMO_PROFILE));
        setProfile(DEMO_PROFILE);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
      setProfile(DEMO_PROFILE);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Сохранение профиля в localStorage
  const saveProfile = useCallback(async (newProfile: UserProfile) => {
    try {
      setIsLoading(true);
      setError(null);
      
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Частичное обновление профиля
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!profile) {
      throw new Error('No profile loaded');
    }
    
    const updatedProfile = { ...profile, ...updates };
    await saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  // Сброс к демо профилю
  const resetProfile = useCallback(async () => {
    await saveProfile(DEMO_PROFILE);
  }, [saveProfile]);

  // Полная очистка профиля
  const clearProfile = useCallback(() => {
    localStorage.removeItem('userProfile');
    setProfile(null);
  }, []);

  // Загрузка при монтировании
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    saveProfile,
    resetProfile,
    clearProfile,
    isOnboardingCompleted: profile?.onboardingCompleted || false
  };
}