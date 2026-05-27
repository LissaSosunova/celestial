'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/lib/schemas/authSchemas';
import { ZodError } from 'zod';
import { useTranslations } from 'next-intl';

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => Promise<void>;
    onForgotPassword: () => void;
    isSubmitting?: boolean;
}

export function LoginForm({ onSubmit, onForgotPassword, isSubmitting = false }: LoginFormProps) {
    const [loginData, setLoginData] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const t = useTranslations('auth');
    const updateField = (field: keyof LoginFormData, value: string) => {
        setLoginData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const validatedData = loginSchema.parse(loginData);
            await onSubmit(validatedData);
        } catch (error) {
            if (error instanceof ZodError) {
                const newErrors: Record<string, string> = {};
                error.issues.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0].toString()] = err.message;
                    }
                });
                setErrors(newErrors);
            }
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* Email */}
            <div>
                <label className="text-[11px] uppercase tracking-ultra text-text mb-3 block font-bold">
                    {t(`Email Address`)}
                </label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                    <input
                        type="email"
                        value={loginData.email}
                        onChange={e => updateField('email', e.target.value)}
                        className={`w-full bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'
                            } p-3 pl-12 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm`}
                        placeholder="your@email.com"
                        disabled={isSubmitting}
                    />
                </div>
                {errors.email && <p className="mt-2 text-xs text-red-500">{t(`${errors.email}`)}</p>}
            </div>

            {/* Password */}
            <div>
                <label className="text-[11px] uppercase tracking-ultra text-text mb-3 block font-bold">
                    {t(`Password`)}
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={e => updateField('password', e.target.value)}
                        className={`w-full bg-white border ${errors.password ? 'border-red-500' : 'border-gray-300'
                            } p-3 pl-12 pr-12 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm`}
                        placeholder="••••••••"
                        disabled={isSubmitting}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text/40 hover:text-text"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                {errors.password && <p className="mt-2 text-xs text-red-500">{t(`${errors.password}`)}</p>}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
                <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-xs text-link transition-colors"
                >
                    {t(`Forgot Password?`)}
                </button>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-4 mt-12">
                <button
                    type="submit"
                    className="px-8 py-4 btn-dark text-white text-[11px] uppercase tracking-ultra rounded-full hover:bg-gold/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t(`Signing In`)}
                        </>
                    ) : (
                        <span>{t(`Sign In`)}</span>
                    )}
                </button>
            </div>
        </motion.form>
    );
}