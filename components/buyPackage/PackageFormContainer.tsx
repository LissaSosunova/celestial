'use client';

import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PurchaseFormSchema, PurchaseFormData } from '@/lib/schemas/purchaseSchemas';
import { PersonalPackageForm } from './forms/PersonalPackageForm';
import { ChildPackageForm } from './forms/ChildPackageForm';
import { ForecastPackageForm } from './forms/ForecastPackageForm';
import { Package } from '@/lib/types/package';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslations } from 'next-intl';

interface PackageFormContainerProps {
    packageItem: Package;
}

export function PackageFormContainer({ packageItem }: PackageFormContainerProps) {
    const { profile, isLoading: isProfileLoading } = useUserProfile();
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('packages');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
        control,
        getValues,
    } = useForm<PurchaseFormData>({
        resolver: zodResolver(PurchaseFormSchema) as any,
        defaultValues: {
            packageSlug: packageItem.slug as any,
            typeOfPurchase: packageItem.isFreePart ? 'free' : 'price',
            isPeriodical: false,
            agreeToTerms: false,
            acceptFreePart: false,
            personSelectionType: packageItem.type === 'child' ? 'existing' : 'self',
            selectedPersonUuid: undefined,
            useOwnData: true,
            forecastTarget: packageItem.type === 'forecast_6m' || packageItem.type === 'forecast_1y' ? 'self' : undefined,
            startDate: undefined,
            person: null,
            selectedLang: locale === 'uk' ? 'uk' : 'ru',
            selectedVersion: packageItem.isFreePart ? 'free' : 'full',
        },
    });

    const watchPackageSlug = watch('packageSlug');
    const isForecast = watchPackageSlug === 'forecast_6m' || watchPackageSlug === 'forecast_1y';

    // Обработка отправки формы
    const onSubmit = async (data: PurchaseFormData) => {
        console.log('package info', data);
        // Преобразование дат перед отправкой
        // const formattedData = {
        //     ...data,
        //     startDate: data.startDate ? data.startDate.toISOString() : undefined,
        //     person: data.person ? {
        //         ...data.person,
        //         birthDate: data.person.birthDate,
        //     } : null,
        // };

        // try {
        //     const response = await fetch('/api/purchases', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(formattedData),
        //     });

        //     if (response.ok) {
        //         router.push('/payment/success');
        //     } else {
        //         const errorData = await response.json();
        //         console.error('Purchase failed:', errorData);
        //     }
        // } catch (error) {
        //     console.error('Purchase failed:', error);
        // }
    };

    // Сброс forecastTarget если пакет не forecast
    useEffect(() => {
        if (!isForecast) {
            const currentForecastTarget = getValues('forecastTarget');
            if (currentForecastTarget !== undefined) {
                setValue('forecastTarget', undefined as any);
            }
            if (getValues('startDate')) {
                setValue('startDate', undefined);
            }
        }
    }, [isForecast, setValue, getValues]);

    const selectedVersion = watch('selectedVersion');

    // Вычисляем цену для отображения
    const getDisplayPrice = () => {
        if (selectedVersion === 'free') {
            return 'Free';
        }
        return packageItem.isFreePart ? `₴${packageItem.price}` : `₴${packageItem.price}`;
    };

    // Состояние загрузки профиля
    if (isProfileLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    // Если пользователь не авторизован
    if (!profile) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Authentication Required</h3>
                <p className="text-yellow-700 mb-4">Please log in to purchase this package</p>
                <Button onClick={() => router.push('/onboarding')}>
                    Go to Login
                </Button>
            </div>
        );
    }

    const renderFormByType = () => {
        const commonProps = {
            register,
            errors,
            watch,
            setValue,
            control,
            isSubmitting,
            userProfile: profile,
            packageItem,
        };

        switch (packageItem.type) {
            case 'personal':
                return <PersonalPackageForm {...commonProps} />;

            case 'child':
                return <ChildPackageForm {...commonProps} />;

            case 'forecast_6m':
                return <ForecastPackageForm {...commonProps} packageType="forecast_6m" />;

            case 'forecast_1y':
                return <ForecastPackageForm {...commonProps} packageType="forecast_1y" />;

            default:
                return <PersonalPackageForm {...commonProps} />;
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <input type="hidden" {...register('packageSlug')} />
            <input type="hidden" {...register('typeOfPurchase')} />
            <input type="hidden" {...register('selectedLang')} />

            {renderFormByType()}

            <div className="border-t pt-6 space-y-4">
                <div className="border-t pt-6 space-y-4">
                    <Checkbox
                        id="agreeToTerms"
                        checked={watch('agreeToTerms')}
                        onChange={(e) => setValue('agreeToTerms', e.target.checked)}
                        label={t(`IAgreeTermsAndConditions`)}
                    />
                    {errors.agreeToTerms && (
                        <p className="text-red-500 text-sm">{errors.agreeToTerms.message}</p>
                    )}

                    {packageItem.isFreePart && (
                        <Checkbox
                            id="acceptFreePart"
                            checked={watch('acceptFreePart')}
                            onChange={(e) => setValue('acceptFreePart', e.target.checked)}
                            label={t(`IUnderstandThisFreePreview`)}
                        />
                    )}
                </div>

                <div className="shadow-sm border border-border-light bg-white p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">{t(`Total amount`)}:</p>
                            <p className="text-2xl font-bold">
                                {getDisplayPrice()}
                            </p>
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-4 btn-dark text-white text-[10px] uppercase tracking-ultra rounded-full hover:bg-gold/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <span>{t(`Processing`)}</span> : <span>{t(`Complete Purchase`)}</span>}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}