import { cookies } from 'next/headers';

export interface UserProfile {
  uid: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  gender: string;
  onboardingCompleted: boolean;
}

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