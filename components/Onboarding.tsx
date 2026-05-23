'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { type UserProfile } from '@/lib/types/userProfile';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { useTranslations } from 'next-intl';

interface OnboardingProps {
  onComplete?: (profile: UserProfile) => void;
}

type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resetEmail, setResetEmail] = useState('');
  const t = useTranslations('auth');
  const { login, register } = useUserProfile();
  const router = useRouter();
  const locale = useLocale();

  const handleLogin = async (data: any) => {
    try {
      setIsSubmitting(true);
      setErrors({});
      const userProfile = await login(data);

      if (onComplete) {
        onComplete(userProfile);
      }
      window.location.href = `/${locale}/dashboard`;
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Login failed' });
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (data: any) => {
    try {
      setIsSubmitting(true);
      setErrors({});
      const userProfile = await register(data);

      if (onComplete) {
        onComplete(userProfile);
      }
      window.location.href = `/${locale}/dashboard`;
    } catch (error) {
      setErrors({ general: error instanceof Error ? error.message : 'Registration failed' });
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    setResetEmail(email);
    setMode('reset');
  };

  const handleResetPassword = async (code: string, newPassword: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (code !== '123456') {
      throw new Error('Invalid verification code');
    }

    alert(t(`Password reset successfully! Please login with your new password`));
    setMode('login');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen relative overflow-hidden bg-primary text-text font-sans antialiased"
    >
      <main className="flex-1 px-10 md:px-12 pb-12 flex flex-col relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 flex-1 pt-5">
          <div className="col-span-6 md:col-span-8 lg:col-span-6 lg:col-start-4 md:col-start-3">
            {mode !== 'forgot' && mode !== 'reset' && (
              <div className="flex gap-4 mb-8 border-b border-border-light">
                <button
                  onClick={() => {
                    setMode('login');
                    setErrors({});
                  }}
                  className={`pb-4 px-2 text-sm uppercase tracking-ultra transition-all ${mode === 'login'
                    ? 'text-link border-b-2 border-gold'
                    : 'text-text/50 hover:text-text'
                    }`}
                >
                  {t(`Sign In`)}
                </button>
                <button
                  onClick={() => {
                    setMode('register');
                    setErrors({});
                  }}
                  className={`pb-4 px-2 text-sm uppercase tracking-ultra transition-all ${mode === 'register'
                    ? 'text-gold border-b-2 border-gold'
                    : 'text-text/60 hover:text-text'
                    }`}
                >
                  {t(`Create Account`)}
                </button>
              </div>
            )}

            {errors.general && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                {errors.general}
              </div>
            )}

            <AnimatePresence mode="wait">
              {mode === 'login' && (
                <LoginForm
                  key="login"
                  onSubmit={handleLogin}
                  onForgotPassword={() => setMode('forgot')}
                  isSubmitting={isSubmitting}
                />
              )}

              {mode === 'register' && (
                <RegisterForm
                  key="register"
                  onSubmit={handleRegister}
                  isSubmitting={isSubmitting}
                />
              )}

              {mode === 'forgot' && (
                <ForgotPasswordForm
                  key="forgot"
                  onSubmit={handleForgotPassword}
                  onBack={() => setMode('login')}
                />
              )}

              {mode === 'reset' && (
                <ResetPasswordForm
                  key="reset"
                  email={resetEmail}
                  onSubmit={handleResetPassword}
                  onBack={() => setMode('login')}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </motion.div>
  );
}