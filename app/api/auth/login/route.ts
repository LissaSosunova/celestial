import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Словари с переводами
const messages = {
  uk: {
    loginFailed: 'Помилка входу. Спробуйте ще раз.',
    userNotFound: 'Користувача не знайдено, створюємо нового...',
    creatingUser: 'Створюємо нового користувача для',
    invalidCredentials: 'Невірний email або пароль',
    serverError: 'Помилка сервера. Спробуйте пізніше.',
  },
  ru: {
    loginFailed: 'Ошибка входа. Попробуйте снова.',
    userNotFound: 'Пользователь не найден, создаем нового...',
    creatingUser: 'Создаем нового пользователя для',
    invalidCredentials: 'Неверный email или пароль',
    serverError: 'Ошибка сервера. Попробуйте позже.',
  },
  en: {
    loginFailed: 'Login failed. Please try again.',
    userNotFound: 'User not found, creating new demo user...',
    creatingUser: 'Creating new user for',
    invalidCredentials: 'Invalid email or password',
    serverError: 'Server error. Please try again later.',
  },
};

function getMessage(locale: string, key: keyof typeof messages.uk): string {
  return messages[locale as keyof typeof messages]?.[key] || messages.en[key];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, locale = 'en' } = body; // Получаем locale из запроса
    
    console.log(getMessage(locale, 'creatingUser'), email);
    
    // Демо-режим: создаем/получаем пользователя по email
    const userProfile = {
      uuid: `demo-user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: email.split('@')[0] || 'Demo User',
      email: email,
      birthDate: '1990-01-01',
      birthTime: '12:00',
      birthLocation: 'Earth',
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    };
    
    const cookieStore = await cookies();
    cookieStore.set('userProfile', JSON.stringify(userProfile), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    
    return NextResponse.json({ 
      success: true, 
      profile: userProfile 
    });
    
  } catch (error) {
    console.error('Login error:', error);
    const locale = 'en'; // Значение по умолчанию
    
    return NextResponse.json(
      { 
        success: false, 
        error: getMessage(locale, 'serverError') 
      },
      { status: 500 }
    );
  }
}