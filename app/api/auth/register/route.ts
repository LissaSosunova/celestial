import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const messages = {
  uk: {
    registrationFailed: 'Помилка реєстрації. Спробуйте ще раз.',
    userExists: 'Користувач з таким email вже існує',
    registrationSuccess: 'Реєстрація успішна!',
    serverError: 'Помилка сервера. Спробуйте пізніше.',
    invalidData: 'Невірні дані. Перевірте форму.',
  },
  ru: {
    registrationFailed: 'Ошибка регистрации. Попробуйте снова.',
    userExists: 'Пользователь с таким email уже существует',
    registrationSuccess: 'Регистрация успешна!',
    serverError: 'Ошибка сервера. Попробуйте позже.',
    invalidData: 'Неверные данные. Проверьте форму.',
  },
  en: {
    registrationFailed: 'Registration failed. Please try again.',
    userExists: 'User with this email already exists',
    registrationSuccess: 'Registration successful!',
    serverError: 'Server error. Please try again later.',
    invalidData: 'Invalid data. Please check the form.',
  },
};

function getMessage(locale: string, key: keyof typeof messages.en): string {
  return messages[locale as keyof typeof messages]?.[key] || messages.en[key];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, birthDate, birthTime, birthLocation, password, locale = 'en' } = body;
    
    // Демо-режим: создаем пользователя
    const userProfile = {
      uuid: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name,
      email: email,
      birthDate: birthDate,
      birthTime: birthTime || '12:00',
      birthLocation: birthLocation || 'Unknown',
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
      profile: userProfile,
      message: getMessage(locale, 'registrationSuccess')
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: getMessage('en', 'serverError')
      },
      { status: 500 }
    );
  }
}