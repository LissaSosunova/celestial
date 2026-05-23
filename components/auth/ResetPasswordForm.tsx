'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ResetPasswordFormProps {
    email: string;
    onSubmit: (code: string, newPassword: string) => Promise<void>;
    onBack: () => void;
}

export function ResetPasswordForm({ email, onSubmit, onBack }: ResetPasswordFormProps) {
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const t = useTranslations('auth');
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!code) {
            newErrors.code = 'Verification code is required';
        } else if (code.length !== 6) {
            newErrors.code = 'Code must be 6 digits';
        }

        if (!newPassword) {
            newErrors.newPassword = 'Password is required';
        } else if (newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }

        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        await onSubmit(code, newPassword);
        setIsSubmitting(false);
    };

    // Демо-код для тестирования
    const handleDemoCode = () => {
        setCode('123456');
    };

    return (
        <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            <div className="text-center mb-8">
                <h3 className="text-lg font-semibold mb-2">{t(`Reset Password`)}</h3>
                <p className="text-sm text-text/60">
                    {t(`We sent a verification code to`)} <span className="font-medium text-gold">{email}</span>
                </p>
                {process.env.NODE_ENV === 'development' && (
                    <button
                        type="button"
                        onClick={handleDemoCode}
                        className="mt-2 text-xs text-gold/70 hover:text-gold"
                    >
                        Demo: Use code 123456
                    </button>
                )}
            </div>

            {/* Verification Code */}
            <div>
                <label className="text-[10px] uppercase tracking-ultra text-text mb-3 block font-bold">
                    {t(`Verification Code`)}
                </label>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                        setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                        if (errors.code) setErrors({ ...errors, code: '' });
                    }}
                    className={`w-full bg-white border ${errors.code ? 'border-red-500' : 'border-gray-300'
                        } p-3 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm text-center text-2xl tracking-widest`}
                    placeholder="000000"
                    maxLength={6}
                    disabled={isSubmitting}
                />
                {errors.code && <p className="mt-2 text-xs text-red-500">{errors.code}</p>}
            </div>

            {/* New Password */}
            <div>
                <label className="text-[10px] uppercase tracking-ultra text-text mb-3 block font-bold">
                    {t(`New Password`)}
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
                        }}
                        className={`w-full bg-white border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'
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
                {errors.newPassword && <p className="mt-2 text-xs text-red-500">{t(`${errors.newPassword}`)}</p>}
            </div>

            {/* Confirm Password */}
            <div>
                <label className="text-[10px] uppercase tracking-ultra text-text mb-3 block font-bold">
                    {t(`Confirm New Password`)}
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                        }}
                        className={`w-full bg-white border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            } p-3 pl-12 pr-12 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm`}
                        placeholder="••••••••"
                        disabled={isSubmitting}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text/40 hover:text-text"
                    >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                {errors.confirmPassword && <p className="mt-2 text-xs text-red-500">{t(`${errors.confirmPassword}`)}</p>}
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 items-center mt-8">
                <button
                    type="submit"
                    className="px-8 py-4 btn-dark text-white text-[10px] uppercase tracking-ultra rounded-full hover:bg-gold/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {t(`Resetting Password`)}
                        </>
                    ) : (
                        <span>{t(`Reset Password`)}</span>
                    )}
                </button>

                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center justify-center gap-2 text-sm text-gold hover:text-gold/80 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t(`Back to Sign In`)}
                </button>
            </div>
        </motion.form>
    );
}