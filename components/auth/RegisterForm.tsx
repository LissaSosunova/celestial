'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, Mail, Lock, User, Calendar, Clock, MapPin, Eye, EyeOff } from 'lucide-react';
import { registrationSchema, type RegistrationFormData } from '@/lib/schemas/authSchemas';
import { ZodError } from 'zod';
import { useTranslations } from 'next-intl';

interface RegisterFormProps {
    onSubmit: (data: RegistrationFormData) => Promise<void>;
    isSubmitting?: boolean;
}

export function RegisterForm({ onSubmit, isSubmitting = false }: RegisterFormProps) {
    const [registerData, setRegisterData] = useState<RegistrationFormData>({
        name: '',
        birthDate: '',
        birthTime: '12:00',
        birthLocation: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const t = useTranslations('auth');
    const updateField = (field: keyof RegistrationFormData, value: string) => {
        setRegisterData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const validatedData = registrationSchema.parse(registerData);
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* Name */}
            <div>
                <label className="text-[10px] uppercase tracking-ultra text-text mb-3 block font-bold">
                    {t(`Name`)}
                </label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                    <input
                        type="text"
                        value={registerData.name}
                        onChange={e => updateField('name', e.target.value)}
                        className="w-full bg-white border border-border-light p-4 pl-12 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm"
                        placeholder="Your name"
                        disabled={isSubmitting}
                    />
                </div>
                {errors.name && <p className="mt-2 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Birth Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] uppercase tracking-ultra text-text mb-3 block font-bold">
                        <Calendar className="inline h-3 mr-1" /> {t(`Birth Date`)}
                    </label>
                    <input
                        type="date"
                        value={registerData.birthDate}
                        onChange={e => updateField('birthDate', e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className={`w-full bg-white border ${errors.birthDate ? 'border-red-500' : 'border-border-light'
                            } p-4 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm`}
                        disabled={isSubmitting}
                    />
                    {errors.birthDate && <p className="mt-2 text-xs text-red-500">{errors.birthDate}</p>}
                </div>
                <div>
                    <label className="text-[10px] uppercase tracking-ultra text-text mb-3 block font-bold">
                        <Clock className="inline h-3 mr-1" /> {t(`Birth Time`)}
                    </label>
                    <input
                        type="time"
                        value={registerData.birthTime}
                        onChange={e => updateField('birthTime', e.target.value)}
                        className={`w-full bg-white border ${errors.birthTime ? 'border-red-500' : 'border-border-light'
                            } p-4 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm`}
                        disabled={isSubmitting}
                    />
                    {errors.birthTime && <p className="mt-2 text-xs text-red-500">{errors.birthTime}</p>}
                </div>
            </div>

            {/* Birth Location */}
            <div>
                <label className="text-[10px] uppercase tracking-ultra text-text mb-3 block font-bold">
                    <MapPin className="inline w-3 h-3 mr-1" /> {t(`Birth Location`)}
                </label>
                <input
                    type="text"
                    value={registerData.birthLocation}
                    onChange={e => updateField('birthLocation', e.target.value)}
                    className={`w-full bg-white border ${errors.birthLocation ? 'border-red-500' : 'border-border-light'
                        } p-4 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm`}
                    placeholder="City, Country"
                    disabled={isSubmitting}
                />
                {errors.birthLocation && <p className="mt-2 text-xs text-red-500">{errors.birthLocation}</p>}
            </div>

            {/* Email */}
            <div>
                <label className="text-[10px] uppercase tracking-ultra text-text mb-3 block font-bold">
                    {t(`Email Address`)}
                </label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                    <input
                        type="email"
                        value={registerData.email}
                        onChange={e => updateField('email', e.target.value)}
                        className={`w-full bg-white border ${errors.email ? 'border-red-500' : 'border-border-light'
                            } p-4 pl-12 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm`}
                        placeholder="your@email.com"
                        disabled={isSubmitting}
                    />
                </div>
                {errors.email && <p className="mt-2 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
                <label className="text-[10px] uppercase tracking-ultra text-text mb-3 block font-bold">
                    {t(`Password`)}
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerData.password}
                        onChange={e => updateField('password', e.target.value)}
                        className={`w-full bg-white border ${errors.password ? 'border-red-500' : 'border-border-light'
                            } p-4 pl-12 pr-12 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm`}
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
                {errors.password && <p className="mt-2 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
                <label className="text-[10px] uppercase tracking-ultra text-text mb-3 block font-bold">
                    {t(`Confirm Password`)}
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={registerData.confirmPassword}
                        onChange={e => updateField('confirmPassword', e.target.value)}
                        className={`w-full bg-white border ${errors.confirmPassword ? 'border-red-500' : 'border-border-light'
                            } p-4 pl-12 pr-12 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm`}
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
                {errors.confirmPassword && <p className="mt-2 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

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
                            {t(`Creating Account`)}
                        </>
                    ) : (
                        <span>{t(`Create Account`)}</span>
                    )}
                </button>
            </div>
        </motion.form>
    );
}