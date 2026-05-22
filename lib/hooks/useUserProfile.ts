'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { RegistrationFormData, LoginFormData } from '@/lib/schemas/authSchemas';
import { type UserProfile } from '@/lib/types/userProfile';

// Функции для работы с cookies
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
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
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
      // Сохраняем в cookie
      setCookie('userProfile', JSON.stringify(newProfile));
      setProfile(newProfile);
      
      // Также сохраняем в localStorage для резервного копирования
      if (typeof window !== 'undefined') {
        localStorage.setItem('userProfile', JSON.stringify(newProfile));
      }
      
      return newProfile;
    } catch (err) {
      console.error('Error saving profile:', err);
      throw err;
    }
  }, []);

  const register = useCallback(async (data: RegistrationFormData): Promise<UserProfile> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Создаем профиль пользователя
      const userProfile: UserProfile = {
        uuid: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        birthDate: data.birthDate,
        birthTime: data.birthTime || '12:00',
        birthLocation: data.birthLocation || 'Unknown',
        email: data.email,
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
      };
      
      // Сохраняем профиль
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

  const login = useCallback(async (data: LoginFormData): Promise<UserProfile> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // В демо-режиме ищем пользователя в cookies
      const cookieProfile = getCookie('userProfile');
      if (cookieProfile) {
        const profile = JSON.parse(cookieProfile);
        if (profile.email === data.email) {
          await saveProfile(profile);
          return profile;
        }
      }
      
      // Проверяем localStorage
      if (typeof window !== 'undefined') {
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          if (profile.email === data.email) {
            await saveProfile(profile);
            return profile;
          }
        }
      }
      
      throw new Error('Invalid email or password');
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userProfile');
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      clearProfile();
      
      // Используем router.push для навигации
      router.push(`/${locale}`);
      
      // Принудительно обновляем страницу, чтобы очистить серверный кэш
      setTimeout(() => {
        router.refresh();
      }, 100);
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out');
    }
  }, [router, locale, clearProfile]);

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
    isAuthenticated: !!profile,
    isOnboardingCompleted: profile?.onboardingCompleted || false
  };
}