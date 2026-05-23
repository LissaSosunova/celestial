import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const messages = {
  uk: {
    logoutSuccess: 'Вихід виконано успішно',
    logoutFailed: 'Помилка при виході',
  },
  ru: {
    logoutSuccess: 'Выход выполнен успешно',
    logoutFailed: 'Ошибка при выходе',
  },
  en: {
    logoutSuccess: 'Logout successful',
    logoutFailed: 'Logout failed',
  },
};

function getMessage(locale: string, key: keyof typeof messages.en): string {
  return messages[locale as keyof typeof messages]?.[key] || messages.en[key];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { locale = 'en' } = body;
    
    const cookieStore = await cookies();
    cookieStore.delete('userProfile');
    
    return NextResponse.json({ 
      success: true, 
      message: getMessage(locale, 'logoutSuccess')
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: getMessage('en', 'logoutFailed')
      },
      { status: 500 }
    );
  }
}