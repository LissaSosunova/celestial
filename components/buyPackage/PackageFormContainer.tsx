'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PurchaseFormSchema, PurchaseFormData } from '@/lib/schemas/purchaseSchemas';
import { PersonalPackageForm } from './forms/PersonalPackageForm';
import { ChildPackageForm } from './forms/ChildPackageForm';
import { ForecastPackageForm } from './forms/ForecastPackageForm';
import { SynastryPackageForm } from './forms/SynastryPackageForm';
import { Package } from '@/lib/types/package';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslations } from 'next-intl';
import { type PurchaseResult } from '@/lib/types/package';

interface PackageFormContainerProps {
    packageItem: Package;
    onPurchaseComplete?: (result: PurchaseResult) => void;
}

export function PackageFormContainer({ packageItem, onPurchaseComplete }: PackageFormContainerProps) {
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
            personSelectionType: packageItem.type === 'child' ? 'existing' : 'self',
            selectedPersonUuid: undefined,
            selectedPersonSecondUuid: undefined,
            secondPersonSelectionType: 'new', // Добавлено
            useOwnData: true,
            forecastTarget: packageItem.type === 'forecast_6m' || packageItem.type === 'forecast_1y' ? 'self' : undefined,
            startDate: undefined,
            person: null,
            firstPerson: null, // Добавлено
            secondPerson: null, // Добавлено
            relationType: undefined, // Добавлено
            selectedLang: locale === 'uk' ? 'uk' : 'ru',
            selectedVersion: packageItem.isFreePart ? 'free' : 'full',
        },
    });

    const watchPackageSlug = watch('packageSlug');
    const isForecast = watchPackageSlug === 'forecast_6m' || watchPackageSlug === 'forecast_1y';
    const isSynastry = watchPackageSlug === 'synastry';

    const onSubmit = async (data: PurchaseFormData) => {
        console.log('package info', data);
        onPurchaseComplete?.({ ...data, result: 'success' });
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

    const getDisplayPrice = () => {
        if (selectedVersion === 'free') {
            return 'Free';
        }
        return packageItem.isFreePart ? `₴${packageItem.price}` : `₴${packageItem.price}`;
    };

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

            case 'synastry':
                return <SynastryPackageForm {...commonProps} />;

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

            <div className="pt-6 space-y-4">
                <div className="border-t pt-6 space-y-4">
                    <Checkbox
                        id="agreeToTerms"
                        checked={watch('agreeToTerms')}
                        onChange={(e) => setValue('agreeToTerms', e.target.checked)}
                        label={t('IAgreeTermsAndConditions')}
                    />
                    {errors.agreeToTerms && (
                        <p className="text-red-500 text-sm">{t(`${errors.agreeToTerms.message}`)}</p>
                    )}
                </div>

                <div className="shadow-sm border border-border-light bg-white p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">{t('Total amount')}:</p>
                            <p className="text-2xl font-bold">
                                {getDisplayPrice()}
                            </p>
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-4 btn-dark text-white text-[10px] uppercase tracking-ultra rounded-full hover:bg-gold/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <span>{t('Processing')}</span> : <span>{t('Complete Purchase')}</span>}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}