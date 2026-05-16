'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { RegistrationFormData, LoginFormData } from '@/lib/schemas/authSchemas';

export interface UserProfile {
  uuid: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  email: string;
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

// Функция для регистрации
async function registerUser(data: RegistrationFormData): Promise<UserProfile> {
  // Здесь должен быть реальный API запрос
  // Имитируем асинхронную операцию
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const userProfile: UserProfile = {
    uuid: `user-${Date.now()}`,
    name: data.name || 'Seeker',
    birthDate: data.birthDate,
    birthTime: data.birthTime || '12:00',
    birthLocation: data.birthLocation || 'Unknown',
    email: data.email,
    onboardingCompleted: true
  };
  
  return userProfile;
}

// Функция для входа
async function loginUser(data: LoginFormData): Promise<UserProfile> {
  // Здесь должен быть реальный API запрос
  // Имитируем асинхронную операцию
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Для демонстрации ищем пользователя в cookies
  const cookieProfile = getCookie('userProfile');
  if (cookieProfile) {
    const profile = JSON.parse(cookieProfile);
    if (profile.email === data.email) {
      return profile;
    }
  }
  
  throw new Error('Invalid email or password');
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

  const register = useCallback(async (data: RegistrationFormData) => {
    try {
      setIsLoading(true);
      const userProfile = await registerUser(data);
      await saveProfile(userProfile);
      return userProfile;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [saveProfile]);

  const login = useCallback(async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const userProfile = await loginUser(data);
      await saveProfile(userProfile);
      return userProfile;
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [saveProfile]);

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
    register,
    login,
    updateProfile,
    saveProfile,
    clearProfile,
    signOut,
    isOnboardingCompleted: profile?.onboardingCompleted || false
  };
}