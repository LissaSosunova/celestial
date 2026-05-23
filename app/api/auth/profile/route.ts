import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const profileCookie = cookieStore.get('userProfile');
    
    if (profileCookie) {
      const profile = JSON.parse(profileCookie.value);
      return NextResponse.json({ success: true, profile });
    }
    
    return NextResponse.json({ success: false, profile: null });
    
  } catch (error) {
    console.error('Profile check error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get profile' },
      { status: 500 }
    );
  }
}