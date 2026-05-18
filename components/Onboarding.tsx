'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Mail, Lock, User, Calendar, Clock, MapPin, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useUserProfile, type UserProfile } from '@/lib/hooks/useUserProfile';
import { registrationSchema, loginSchema, type RegistrationFormData, type LoginFormData } from '@/lib/schemas/authSchemas';
import { ZodError } from 'zod';

interface OnboardingProps {
  onComplete?: (profile: UserProfile) => void;
}

type AuthMode = 'login' | 'register';

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { login, register, saveProfile } = useUserProfile();
  const router = useRouter();
  const locale = useLocale();

  // Форма входа
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  // Форма регистрации
  const [registerData, setRegisterData] = useState<RegistrationFormData>({
    name: '',
    birthDate: '',
    birthTime: '12:00',
    birthLocation: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async () => {
    try {
      setIsSubmitting(true);
      setErrors({});
      
      // Валидация данных входа
      const validatedData = loginSchema.parse(loginData);
      
      // Вызываем функцию входа из хука
      const userProfile = await login(validatedData);
      
      if (onComplete) {
        onComplete(userProfile);
      }
      
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        setErrors({ general: error instanceof Error ? error.message : 'Login failed' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async () => {
    try {
      setIsSubmitting(true);
      setErrors({});
      
      // Валидация данных регистрации
      const validatedData = registrationSchema.parse(registerData);
      
      // Вызываем функцию регистрации из хука
      const userProfile = await register(validatedData);
      
      if (onComplete) {
        onComplete(userProfile);
      }
      
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        setErrors({ general: error instanceof Error ? error.message : 'Registration failed' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  const updateLoginField = (field: keyof LoginFormData, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateRegisterField = (field: keyof RegistrationFormData, value: string) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
          <div className="col-span-6 md:col-span-8 lg:col-span-8 lg:col-start-3">
            {/* Переключение режимов */}
            <div className="flex gap-4 mb-8 border-b border-border-light">
              <button
                onClick={() => {
                  setMode('login');
                  setErrors({});
                }}
                className={`pb-4 px-2 text-sm uppercase tracking-ultra transition-all ${
                  mode === 'login' 
                    ? 'text-gold border-b-2 border-gold' 
                    : 'text-text/60 hover:text-text'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMode('register');
                  setErrors({});
                }}
                className={`pb-4 px-2 text-sm uppercase tracking-ultra transition-all ${
                  mode === 'register' 
                    ? 'text-gold border-b-2 border-gold' 
                    : 'text-text/60 hover:text-text'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Общая ошибка */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {mode === 'login' ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {/* Email */}
                    <div>
                      <label className="text-[10px] uppercase tracking-ultra text-text mb-3 block font-bold">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                        <input
                          type="email"
                          value={loginData.email}
                          onChange={e => updateLoginField('email', e.target.value)}
                          className={`w-full bg-white border ${
                            errors.email ? 'border-red-500' : 'border-border-light'
                          } p-4 pl-12 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm`}
                          placeholder="your@email.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-2 text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="text-[10px] uppercase tracking-ultra text-text mb-3 block font-bold">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={loginData.password}
                          onChange={e => updateLoginField('password', e.target.value)}
                          className={`w-full bg-white border ${
                            errors.password ? 'border-red-500' : 'border-border-light'
                          } p-4 pl-12 pr-12 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-text/40 hover:text-text"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-2 text-xs text-red-500">{errors.password}</p>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Name */}
                    <div>
                      <label className="text-[10px] uppercase tracking-ultra text-text mb-3 block font-bold">
                        Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                        <input
                          type="text"
                          value={registerData.name}
                          onChange={e => updateRegisterField('name', e.target.value)}
                          className="w-full bg-white border border-border-light p-4 pl-12 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm"
                          placeholder="Your name"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-2 text-xs text-red-500">{errors.name}</p>
                      )}
                    </div>

                    {/* Birth Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-ultra text-text mb-3 block font-bold">
                          <Calendar className="inline w-3 h-3 mr-1" /> Birth Date
                        </label>
                        <input
                          type="date"
                          value={registerData.birthDate}
                          onChange={e => updateRegisterField('birthDate', e.target.value)}
                          max={new Date().toISOString().split('T')[0]}
                          className={`w-full bg-white border ${
                            errors.birthDate ? 'border-red-500' : 'border-border-light'
                          } p-4 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm`}
                        />
                        {errors.birthDate && (
                          <p className="mt-2 text-xs text-red-500">{errors.birthDate}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-ultra text-text mb-3 block font-bold">
                          <Clock className="inline w-3 h-3 mr-1" /> Birth Time
                        </label>
                        <input
                          type="time"
                          value={registerData.birthTime}
                          onChange={e => updateRegisterField('birthTime', e.target.value)}
                          className={`w-full bg-white border ${
                            errors.birthTime ? 'border-red-500' : 'border-border-light'
                          } p-4 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm`}
                        />
                        {errors.birthTime && (
                          <p className="mt-2 text-xs text-red-500">{errors.birthTime}</p>
                        )}
                      </div>
                    </div>

                    {/* Birth Location */}
                    <div>
                      <label className="text-[10px] uppercase tracking-ultra text-text mb-3 block font-bold">
                        <MapPin className="inline w-3 h-3 mr-1" /> Birth Location
                      </label>
                      <input
                        type="text"
                        value={registerData.birthLocation}
                        onChange={e => updateRegisterField('birthLocation', e.target.value)}
                        className={`w-full bg-white border ${
                          errors.birthLocation ? 'border-red-500' : 'border-border-light'
                        } p-4 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm`}
                        placeholder="City, Country"
                      />
                      {errors.birthLocation && (
                        <p className="mt-2 text-xs text-red-500">{errors.birthLocation}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-[10px] uppercase tracking-ultra text-text mb-3 block font-bold">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                        <input
                          type="email"
                          value={registerData.email}
                          onChange={e => updateRegisterField('email', e.target.value)}
                          className={`w-full bg-white border ${
                            errors.email ? 'border-red-500' : 'border-border-light'
                          } p-4 pl-12 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm`}
                          placeholder="your@email.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-2 text-xs text-red-500">{errors.email}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="text-[10px] uppercase tracking-ultra text-text mb-3 block font-bold">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={registerData.password}
                          onChange={e => updateRegisterField('password', e.target.value)}
                          className={`w-full bg-white border ${
                            errors.password ? 'border-red-500' : 'border-border-light'
                          } p-4 pl-12 pr-12 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-text/40 hover:text-text"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-2 text-xs text-red-500">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="text-[10px] uppercase tracking-ultra text-text mb-3 block font-bold">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={registerData.confirmPassword}
                          onChange={e => updateRegisterField('confirmPassword', e.target.value)}
                          className={`w-full bg-white border ${
                            errors.confirmPassword ? 'border-red-500' : 'border-border-light'
                          } p-4 pl-12 pr-12 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-text/40 hover:text-text"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-2 text-xs text-red-500">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <div className="flex items-center gap-4 mt-12">
                <button
                  type="submit"
                  className="px-8 py-4 btn-dark text-white text-[10px] uppercase tracking-ultra rounded-full hover:bg-gold/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                    </>
                  ) : (
                    mode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </motion.div>
  );
}