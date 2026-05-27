'use client';

import { UseFormReturn, Control } from 'react-hook-form';
import { PurchaseFormData } from '@/lib/schemas/purchaseSchemas';
import { Package } from '@/lib/types/package';
import { UserProfile } from '@/lib/types/userProfile';
import { PersonSelector } from './PersonSelector';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslations } from 'next-intl';

interface ForecastPackageFormProps {
    register: UseFormReturn<PurchaseFormData>['register'];
    errors: UseFormReturn<PurchaseFormData>['formState']['errors'];
    watch: UseFormReturn<PurchaseFormData>['watch'];
    setValue: UseFormReturn<PurchaseFormData>['setValue'];
    control: Control<PurchaseFormData>;
    isSubmitting: boolean;
    userProfile: UserProfile;
    packageItem: Package;
    packageType: 'forecast_6m' | 'forecast_1y';
}

// Тип для ошибок forecast формы
type ForecastErrors = {
    forecastTarget?: { message?: string };
    startDate?: { message?: string };
    person?: any;
    personSelectionType?: any;
    selectedPersonUuid?: any;
};

// Вспомогательная функция для форматирования BirthLocation в строку
const formatBirthLocation = (birthLocation: any): string => {
    if (!birthLocation) return 'Not specified';
    if (typeof birthLocation === 'string') return birthLocation;
    
    const parts = [];
    if (birthLocation.city) parts.push(birthLocation.city);
    if (birthLocation.state) parts.push(birthLocation.state);
    if (birthLocation.country) parts.push(birthLocation.country);
    
    return parts.length > 0 ? parts.join(', ') : 'Not specified';
};

export function ForecastPackageForm({
    register,
    errors,
    watch,
    setValue,
    control,
    packageType,
    userProfile,
    packageItem
}: ForecastPackageFormProps) {
    const duration = packageType === 'forecast_6m' ? '6 months' : '1 year';
    const t = useTranslations('packages');

    // Приводим errors к нужному типу
    const forecastErrors = errors as unknown as ForecastErrors;
    const forecastTarget = watch('forecastTarget') as 'self' | 'other' | undefined;

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dateString = e.target.value;
        if (dateString) {
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
                setValue('startDate', date);
            }
        } else {
            setValue('startDate', undefined);
        }
    };

    const handleForecastTargetChange = (value: string) => {
        setValue('forecastTarget', value as 'self' | 'other');
        // Сбрасываем person-related поля при смене выбора
        if (value === 'self') {
            setValue('person', null);
            setValue('selectedPersonUuid', undefined);
        }
    };

    return (
        <div className="space-y-6">
            <div className="shadow-sm border border-border-light bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                    {t(`GetВetailedЫstrological`)} {t(`${duration}`)}.
                </p>
            </div>

            {/* Выбор для кого прогноз с использованием RadioGroup */}
            <div className="space-y-4">
                <Label>{t(`WhoThisForecastFor`)}</Label>

                <RadioGroup
                    value={forecastTarget || 'self'}
                    onValueChange={handleForecastTargetChange}
                >
                    <RadioGroupItem
                        value="self"
                        id="forecast-self"
                        label={t(`Forecast for myself`)}
                        description={t(`Use your profile data for the forecast`)}
                    />

                    <RadioGroupItem
                        value="other"
                        id="forecast-other"
                        label={t(`Forecast for other person`)}
                        description={t(`Create forecast for a friend, family member, or partner`)}
                    />
                </RadioGroup>

                {forecastErrors.forecastTarget && (
                    <p className="text-red-500 text-sm">{t(`${forecastErrors.forecastTarget.message}`)}</p>
                )}
            </div>

            {/* Если прогноз для другого человека - показываем PersonSelector */}
            {forecastTarget === 'other' && (
                <PersonSelector
                    watch={watch}
                    setValue={setValue}
                    control={control}
                    userProfile={userProfile}
                    register={register}
                    errors={errors}
                    showSelfOption={true}
                    filterRelation={null}
                />
            )}

            {/* Если прогноз для себя - показываем данные профиля */}
            {forecastTarget === 'self' && userProfile && (
                <div className="shadow-sm border border-border-light bg-white p-4 rounded-lg space-y-1">
                    <p className="text-sm font-medium text-[#f79309]">{t(`Using profile data`)}:</p>
                    <p className="text-sm text-gray-600">
                        {t(`Name`)}: {userProfile.name}<br />
                        {t(`Birth Date`)}: {userProfile.birthDate}<br />
                        {t(`Birth Time`)}: {userProfile.birthTime || 'Not specified'}<br />
                        {t(`Birth Location`)}: {formatBirthLocation(userProfile.birthLocation)}
                    </p>
                </div>
            )}

            {/* Дата начала прогноза */}
            <div className="space-y-2">
                <Label htmlFor="startDate">{t('Start Date')} *</Label>
                <Calendar
                    selected={watch('startDate')}
                    onSelect={(date) => setValue('startDate', date)}
                    showTimeSelect={false}
                    minDate={new Date()}
                    placeholderText={t('Select the start date for your forecast')}
                />
                {forecastErrors.startDate && (
                    <p className="text-red-500 text-sm">{forecastErrors.startDate.message}</p>
                )}
            </div>
        </div>
    );
}