'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PurchaseFormSchema, PurchaseFormData } from '@/lib/schemas/purchaseSchemas';
import { PersonalPackageForm } from './forms/PersonalPackageForm';
import { ChildPackageForm } from './forms/ChildPackageForm';
import { ForecastPackageForm } from './forms/ForecastPackageForm';
import { Package } from '@/lib/types/package';
import { useUserProfile } from '@/lib/hooks/useUserProfile';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLocale } from 'next-intl';

interface PackageFormContainerProps {
    packageItem: Package;
}

export function PackageFormContainer({ packageItem }: PackageFormContainerProps) {
    const { profile, isLoading: isProfileLoading } = useUserProfile();
    const router = useRouter();
    const locale = useLocale();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
    } = useForm<PurchaseFormData>({
        resolver: zodResolver(PurchaseFormSchema) as any,
        defaultValues: {
            packageSlug: packageItem.slug,
            typeOfPurchase: packageItem.isFreePart ? 'free' : 'price',
            isPeriodical: false,
            agreeToTerms: false,
            acceptFreePart: false,
            personSelectionType: packageItem.type === 'child' ? 'existing' : 'self',
            selectedPersonUuid: undefined,
            useOwnData: true,
            forecastTarget: 'self',
            startDate: undefined,
            person: null,
            selectedLang: locale === 'uk' ? 'Ukranian' : 'Russian'
        },
    });

    const onSubmit = async (data: PurchaseFormData) => {
        console.log('package info', data)
        // try {
        //     const response = await fetch('/api/purchases', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(data),
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
    const selectedVersion = watch('selectedVersion');

    // Вычисляем цену для отображения
    const getDisplayPrice = () => {
        if (selectedVersion === 'free') {
            return 'Free';
        }
        return packageItem.isFreePart ? `₴${packageItem.price}` : `₴${packageItem.price}`;
    };

    const getButtonText = () => {
        if (isSubmitting) return 'Processing...';
        if (selectedVersion === 'free') return 'Get Free Preview';
        return 'Purchase Full Version';
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
                <Button onClick={() => router.push('/login')}>
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

            {renderFormByType()}

            <div className="border-t pt-6 space-y-4">
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="agreeToTerms"
                        {...register('agreeToTerms')}
                        className="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <Label htmlFor="agreeToTerms" className="cursor-pointer mb-0">
                        I agree to the terms and conditions *
                    </Label>
                </div>
                {errors.agreeToTerms && (
                    <p className="text-red-500 text-sm">{errors.agreeToTerms.message}</p>
                )}

                {packageItem.isFreePart && (
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="acceptFreePart"
                            {...register('acceptFreePart')}
                            className="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <Label htmlFor="acceptFreePart" className="cursor-pointer mb-0">
                            I understand this is a free preview
                        </Label>
                    </div>
                )}

                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">Total amount:</p>
                            <p className="text-2xl font-bold">
                                {getDisplayPrice()}
                            </p>
                        </div>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Processing...' : 'Complete Purchase'}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}