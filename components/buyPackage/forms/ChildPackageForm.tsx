// components/ui/buyPackage/forms/ChildPackageForm.tsx
'use client';

import { UseFormReturn, Control } from 'react-hook-form';
import { PurchaseFormData } from '@/lib/schemas/purchaseSchemas';
import { Package } from '@/lib/types/package';
import { UserProfile } from '@/lib/types/userProfile';
import { Label } from '@/components/ui/label';
import ChipsBtn from '@/components/buttons/ChipsBtn';
import { PersonSelector } from './PersonSelector';
import { useEffect } from 'react';

interface ChildPackageFormProps {
    register: UseFormReturn<PurchaseFormData>['register'];
    errors: UseFormReturn<PurchaseFormData>['formState']['errors'];
    watch: UseFormReturn<PurchaseFormData>['watch'];
    setValue: UseFormReturn<PurchaseFormData>['setValue'];
    control: Control<PurchaseFormData>;
    isSubmitting: boolean;
    userProfile: UserProfile;
    packageItem: Package;
}

export function ChildPackageForm({
    register,
    errors,
    watch,
    setValue,
    control,
    userProfile,
    packageItem
}: ChildPackageFormProps) {
    const selectedVersion = watch('selectedVersion') || (packageItem.isFreePart ? 'free' : 'full');

    // Опции версий зависят от isFreePart
    const versionOptions = [
        ...(packageItem.isFreePart ? [{ value: 'free', label: 'Free Preview (Short Summary)' }] : []),
        { value: 'full', label: 'Full Version (Detailed Analysis)' },
    ];

    const handleVersionSelect = (value: string) => {
        setValue('selectedVersion', value as 'free' | 'full');
        if (value === 'free') {
            setValue('typeOfPurchase', 'free');
        } else {
            setValue('typeOfPurchase', 'price');
        }
    };

    // Следим за personSelectionType и автоматически устанавливаем relation как 'child'
    const personSelectionType = watch('personSelectionType');

    useEffect(() => {
        // Когда создаем нового человека, устанавливаем relation как 'child'
        if (personSelectionType === 'new') {
            const currentRelation = watch('person.relation.name');
            if (currentRelation !== 'child') {
                setValue('person.relation.name', 'child');
            }
        }
    }, [personSelectionType, setValue, watch]);

    return (
        <div className="space-y-6">
            <div className="shadow-sm border border-border-light bg-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Child's Natal Chart</h3>
                <p className="text-sm text-gray-600">
                    Understand your child's unique nature to support their growth.
                </p>
            </div>

            {/* PersonSelector для выбора ребенка с filterRelation='child' */}
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

            {/* Выбор версии (только если isFreePart === true) */}
            {packageItem.isFreePart && (
                <div className="space-y-3">
                    <Label>Select Version *</Label>
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
                        <p className="text-sm text-green-600 bg-green-50 shadow-sm border border-border-light p-2 rounded">
                            🎉 Free preview includes: Basic personality overview and key traits for the child.
                        </p>
                    )}
                    {selectedVersion === 'full' && (
                        <p className="text-sm text-blue-600 bg-blue-50 shadow-sm border border-border-light p-2 rounded">
                            ✨ Full version includes: Detailed astrological analysis, educational insights,
                            talent development, and personalized guidance for the child's future.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}