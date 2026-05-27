// components/auth/RegisterForm.tsx
'use client';

import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Loader2, Mail, Lock, User, Calendar as CalendarIcon, Clock, MapPin, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { registrationSchema, type RegistrationFormData, type BirthLocationFormData } from '@/lib/schemas/authSchemas';
import { ZodError } from 'zod';
import { useTranslations } from 'next-intl';
import { Calendar } from '@/components/ui/calendar';
import { CountrySelect } from '../forms/CountrySelect';
import { RegionSelect } from '../forms/RegionSelect';
import { CityInput } from '../forms/CityInput';

interface RegisterFormProps {
    onSubmit: (data: RegistrationFormData) => Promise<void>;
    isSubmitting?: boolean;
}

// Начальное значение для birthLocation
const initialBirthLocation: BirthLocationFormData = {
    country: '',
    city: '',
    timeZone: '',
    state: undefined,
};

export function RegisterForm({ onSubmit, isSubmitting = false }: RegisterFormProps) {
    const [registerData, setRegisterData] = useState<RegistrationFormData>({
        name: '',
        birthDate: '',
        birthTime: '12:00',
        birthLocation: initialBirthLocation,
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
    const t = useTranslations('auth');

    const updateField = (field: keyof RegistrationFormData, value: any) => {
        setRegisterData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const updateBirthLocation = useCallback((field: keyof BirthLocationFormData, value: string) => {
    setRegisterData(prev => {
        const newData = {
            ...prev,
            birthLocation: { ...prev.birthLocation, [field]: value }
        };
        console.log('Updated birthLocation:', newData.birthLocation); // Для отладки
        return newData;
    });
}, []);

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
                        const path = err.path.join('.');
                        newErrors[path] = err.message;
                    }
                });
                setErrors(newErrors);
            }
        }
    };

    // Функция для преобразования строки времени в Date объект для календаря
    const getTimeDateObject = (timeString?: string): Date | undefined => {
        if (!timeString) return undefined;
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return isNaN(date.getTime()) ? undefined : date;
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
                <label className="text-[11px] uppercase tracking-ultra text-text mb-3 block font-bold">
                    {t('Name')}
                </label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                    <input
                        type="text"
                        value={registerData.name}
                        onChange={e => updateField('name', e.target.value)}
                        className="w-full bg-white border border-gray-300 px-3 py-3 pl-12 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm"
                        placeholder="Your name"
                        disabled={isSubmitting}
                    />
                </div>
                {errors.name && <p className="mt-2 text-xs text-red-500">{t(errors.name)}</p>}
            </div>

            {/* Birth Date & Time */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className='max-w-xs'>
                    <label className="text-[11px] uppercase tracking-ultra text-text mb-3 block font-bold">
                        <CalendarIcon className="inline h-3 mr-1" /> {t('Birth Date')}
                    </label>
                    <Calendar
                        selected={registerData.birthDate ? new Date(registerData.birthDate) : undefined}
                        onSelect={(date) => {
                            const formattedDate = date ? date.toISOString().split('T')[0] : '';
                            updateField('birthDate', formattedDate);
                        }}
                        maxDate={new Date()}
                        roundedFull={true}
                        inputClassName=""
                        placeholderText={t('Select birth date')}
                    />
                    {errors.birthDate && <p className="mt-2 text-xs text-red-500">{t(errors.birthDate)}</p>}
                </div>

                <div className='max-w-xs'>
                    <label className="text-[11px] uppercase tracking-ultra text-text mb-3 block font-bold">
                        <Clock className="inline h-3 mr-1" /> {t('Birth Time')}
                    </label>
                    <Calendar
                        mode="time"
                        selected={getTimeDateObject(registerData.birthTime)}
                        onSelect={(date) => {
                            const formattedTime = date ? date.toTimeString().slice(0, 5) : '12:00';
                            updateField('birthTime', formattedTime);
                        }}
                        showTimeSelectOnly={true}
                        timeIntervals={15}
                        roundedFull={true}
                        inputClassName=""
                        placeholderText={t('Select birth time')}
                    />
                    {errors.birthTime && <p className="mt-2 text-xs text-red-500">{t(errors.birthTime)}</p>}
                </div>
            </div>

            {/* Birth Location - Обновленный блок */}
            <div>
                <label className="text-[11px] uppercase tracking-ultra text-text mb-3 block font-bold">
                    <MapPin className="inline w-3 h-3 mr-1" /> {t('Birth Location')} <br />
                    <div className="bg-secondary p-2 text-[9px] uppercase text-muted block font-medium">ⓘ {t('Locations appear in English to ensure precise results in global astrological databases')}</div>
                </label>

                <div className="space-y-3">
                    {/* Country Select */}
                    <div className="relative">
                        <CountrySelect
                            onSelect={(country) => {
                                updateBirthLocation('country', country.iso2);
                                updateBirthLocation('state', '');
                                updateBirthLocation('city', '');
                                updateBirthLocation('timeZone', '');
                            }}
                            selectedCountry={registerData.birthLocation.country}
                            className="rounded-full pl-12"
                        />
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40 pointer-events-none z-10" />
                        {errors['birthLocation.country'] && (
                            <p className="mt-2 text-xs text-red-500">{t(errors['birthLocation.country'])}</p>
                        )}
                    </div>

                    {/* Region Select - используем RegionSelect с правильными пропсами */}
                    {registerData.birthLocation.country && (
                        <div className="relative">
                            <RegionSelect
                                countryCode={registerData.birthLocation.country}
                                onSelect={(region) => {
                                    updateBirthLocation('state', region?.code || '');
                                    updateBirthLocation('city', '');
                                    updateBirthLocation('timeZone', '');
                                }}
                                selectedRegion={registerData.birthLocation.state}
                                className="rounded-full pl-12"
                            />
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40 pointer-events-none z-10" />
                            {errors['birthLocation.state'] && (
                                <p className="mt-2 text-xs text-red-500">{t(errors['birthLocation.state'])}</p>
                            )}
                        </div>
                    )}

                    {/* City Input - используем regionCode вместо stateCode */}
                    <div className="relative">
                        <CityInput
                            countryCode={registerData.birthLocation.country}
                            regionCode={registerData.birthLocation.state}
                            onSelect={(city, timezone, isCustom) => {
                                updateBirthLocation('city', city);
                                updateBirthLocation('timeZone', timezone);
                                if (isCustom) {
                                    // Можно сохранить флаг, что город кастомный
                                    console.log('Custom city added:', city);
                                }
                            }}
                            selectedCity={registerData.birthLocation.city}
                            className="rounded-full pl-12"
                            placeholder="Search or enter city..."
                        />
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40 pointer-events-none z-10" />
                        {errors['birthLocation.city'] && (
                            <p className="mt-2 text-xs text-red-500">{t(errors['birthLocation.city'])}</p>
                        )}
                    </div>

                    {/* Timezone display */}
                    {registerData.birthLocation.timeZone && (
                        <div className="mt-2 px-4 py-2 bg-gray-50 rounded-full text-xs text-gray-600">
                            Timezone: {registerData.birthLocation.timeZone}
                        </div>
                    )}
                    {errors['birthLocation.timeZone'] && (
                        <p className="mt-2 text-xs text-red-500">{t(errors['birthLocation.timeZone'])}</p>
                    )}
                </div>
            </div>

            {/* Email */}
            <div>
                <label className="text-[11px] uppercase tracking-ultra text-text mb-3 block font-bold">
                    {t('Email Address')}
                </label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                    <input
                        type="email"
                        value={registerData.email}
                        onChange={e => updateField('email', e.target.value)}
                        className={`w-full bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'
                            } px-3 py-3 pl-12 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm`}
                        placeholder="your@email.com"
                        disabled={isSubmitting}
                    />
                </div>
                {errors.email && <p className="mt-2 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
                <label className="text-[11px] uppercase tracking-ultra text-text mb-3 block font-bold">
                    {t('Password')}
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerData.password}
                        onChange={e => updateField('password', e.target.value)}
                        className={`w-full bg-white border ${errors.password ? 'border-red-500' : 'border-gray-300'
                            } px-3 py-3 pl-12 pr-12 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm`}
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
                {errors.password && <p className="mt-2 text-xs text-red-500">{t(errors.password)}</p>}
            </div>

            {/* Confirm Password */}
            <div>
                <label className="text-[11px] uppercase tracking-ultra text-text mb-3 block font-bold">
                    {t('Confirm Password')}
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={registerData.confirmPassword}
                        onChange={e => updateField('confirmPassword', e.target.value)}
                        className={`w-full bg-white border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            } px-3 py-3 pl-12 pr-12 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm`}
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
                {errors.confirmPassword && <p className="mt-2 text-xs text-red-500">{t(errors.confirmPassword)}</p>}
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
                            {t('Creating Account')}
                        </>
                    ) : (
                        <span>{t('Create Account')}</span>
                    )}
                </button>
            </div>
        </motion.form>
    );
}