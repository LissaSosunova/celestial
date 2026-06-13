// components/ui/buyPackage/forms/SynastryPackageForm.tsx
'use client';

import { UseFormReturn, Control } from 'react-hook-form';
import { PurchaseFormData } from '@/lib/schemas/purchaseSchemas';
import { Package } from '@/lib/types/package';
import { UserProfile } from '@/lib/types/userProfile';
import { Label } from '@/components/ui/label';
import ChipsBtn from '@/components/buttons/ChipsBtn';
import { SynastryPersonSelector } from './SynastryPersonSelector';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface SynastryPackageFormProps {
    register: UseFormReturn<PurchaseFormData>['register'];
    errors: UseFormReturn<PurchaseFormData>['formState']['errors'];
    watch: UseFormReturn<PurchaseFormData>['watch'];
    setValue: UseFormReturn<PurchaseFormData>['setValue'];
    control: Control<PurchaseFormData>;
    isSubmitting: boolean;
    userProfile: UserProfile;
    packageItem: Package;
}

// Тип для ошибок synastry
type SynastryErrors = {
    relationType?: { message?: string };
    firstPerson?: any;
    secondPerson?: any;
    personSelectionType?: { message?: string };
    secondPersonSelectionType?: { message?: string };
    selectedPersonUuid?: { message?: string };
    selectedPersonSecondUuid?: { message?: string };
};

export function SynastryPackageForm({
    register,
    errors,
    watch,
    setValue,
    control,
    userProfile,
    packageItem
}: SynastryPackageFormProps) {
    const selectedVersion = watch('selectedVersion') || (packageItem.isFreePart ? 'free' : 'full');
    const t = useTranslations('packages');

    const synastryErrors = errors as unknown as SynastryErrors;

    const [selectedRelationType, setSelectedRelationType] = useState<string>(() => {
        const value = watch('relationType');
        return typeof value === 'string' ? value : '';
    });

    const firstPersonUuid = watch('selectedPersonUuid');

    const relationTypeOptions = [
        { value: 'relationship', label: t('Partner') },
        { value: 'friend', label: t('Friend') },
        { value: 'business', label: t('Business Partner') },
    ];

    const optionsLabel = { free: t(`Free Preview (Short Summary)`), full: t(`Full Version (Detailed Analysis)`) };
    const versionOptions = [
        ...(packageItem.isFreePart ? [{ value: 'free', label: optionsLabel.free }] : []),
        { value: 'full', label: optionsLabel.full },
    ];

    const handleVersionSelect = (value: string) => {
        setValue('selectedVersion', value as 'free' | 'full');
        if (value === 'free') {
            setValue('typeOfPurchase', 'free');
        } else {
            setValue('typeOfPurchase', 'price');
        }
    };

    const handleRelationTypeSelect = (value: string) => {
        setSelectedRelationType(value);
        setValue('relationType', value as 'business' | 'friend' | 'relationship');
    };

    return (
        <div className="space-y-6">
            <div className="shadow-sm border border-border-light bg-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{t('Synastry Chart')}</h3>
                <p className="text-sm text-gray-600">
                    {t('Discover the cosmic connection between two souls')}
                </p>
            </div>

            <div className="space-y-3">
                <Label className="after:content-['*']">{t('Relation Type')}</Label>
                <div className="flex flex-wrap gap-2">
                    {relationTypeOptions.map((option) => (
                        <ChipsBtn
                            key={option.value}
                            name={option.label}
                            value={option.value}
                            isSelected={selectedRelationType === option.value}
                            onClick={handleRelationTypeSelect}
                        />
                    ))}
                </div>
                {synastryErrors.relationType && (
                    <p className="text-red-500 text-sm">{t(`${synastryErrors.relationType.message}`)}</p>
                )}
            </div>

            {/* Первая персона - с опцией "Myself" */}
            <div className="space-y-4 p-4 border border-border-light rounded-lg bg-gray-50">
                <h4 className="font-semibold text-gray-900">{t('First Person')}</h4>
                <SynastryPersonSelector
                    watch={watch}
                    setValue={setValue}
                    control={control}
                    userProfile={userProfile}
                    register={register}
                    errors={errors}
                    personField="firstPerson"
                    selectionTypeField="personSelectionType"
                    selectedUuidField="selectedPersonUuid"
                    relationTypeFromParent={selectedRelationType as 'business' | 'friend' | 'relationship' | null}
                    showSelfOption={true}
                />
            </div>

            {/* Вторая персона - без опции "Myself" */}
            <div className="space-y-4 p-4 border border-border-light rounded-lg bg-gray-50">
                <h4 className="font-semibold text-gray-900">{t('Second Person')}</h4>
                <SynastryPersonSelector
                    watch={watch}
                    setValue={setValue}
                    control={control}
                    userProfile={userProfile}
                    register={register}
                    errors={errors}
                    personField="secondPerson"
                    selectionTypeField="secondPersonSelectionType"
                    selectedUuidField="selectedPersonSecondUuid"
                    relationTypeFromParent={selectedRelationType as 'business' | 'friend' | 'relationship' | null}
                    excludeUuid={firstPersonUuid}
                    showSelfOption={false}
                />
            </div>

            {packageItem.isFreePart && (
                <div className="space-y-3">
                    <Label className="after:content-['*']">{t('Select Version')}</Label>
                    <div className="flex flex-wrap gap-2">
                        {versionOptions.map((option) => (
                            <ChipsBtn
                                key={option.value}
                                name={option.label}
                                value={option.value}
                                isSelected={selectedVersion === option.value}
                                onClick={handleVersionSelect}
                            />
                        ))}
                    </div>
                    {selectedVersion === 'free' && (
                        <p className="text-sm text-green-600 bg-green-50 p-2 rounded shadow-sm border-border-light">
                            🎉 {t('freeSynastryDetails')}
                        </p>
                    )}
                    {selectedVersion === 'full' && (
                        <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded shadow-sm border-border-light">
                            ✨ {t('fullSynastryDetails')}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}