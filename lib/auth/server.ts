import { cookies } from 'next/headers';
import { type UserProfile } from '@/lib/types/userProfile';

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const cookieStore = await cookies();
    const profileCookie = cookieStore.get('userProfile');
    
    if (profileCookie?.value) {
      return JSON.parse(profileCookie.value);
    }
    
    return null;
  } catch (error) {
    console.error('Error reading profile from cookies:', error);
    return null;
  }
}

// Функция для проверки авторизации в серверных компонентах
export async function requireAuth(redirectTo: string = '/') {
  const profile = await getUserProfile();
  if (!profile) {
    throw new Error('Unauthorized');
  }
  return profile;
}