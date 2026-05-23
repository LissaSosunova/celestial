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

export async function setUserProfile(profile: UserProfile) {
  try {
    const cookieStore = await cookies();
    cookieStore.set('userProfile', JSON.stringify(profile), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
  } catch (error) {
    console.error('Error setting profile cookie:', error);
  }
}

export async function removeUserProfile() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('userProfile');
  } catch (error) {
    console.error('Error removing profile cookie:', error);
  }
}