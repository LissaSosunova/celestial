'use client';

import { FormComponentProps } from '@/lib/types/purchase.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ChipsBtn from '@/components/buttons/ChipsBtn';
import { PersonSelector } from './PersonSelector';
import { useEffect } from 'react';

export function ChildPackageForm({ register, errors, watch, setValue, userProfile, packageItem }: FormComponentProps) {
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

    // Автоматически устанавливаем relation как 'child'
    useEffect(() => {
        setValue('person.relation.name', 'child');
    }, [setValue]);

    return (
        <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Child Package</h3>
                <p className="text-sm text-gray-600">
                    Create a forecast for your child or another person.
                </p>
            </div>

            {/* PersonSelector для выбора или добавления ребенка */}
            <PersonSelector
                watch={watch}
                setValue={setValue}
                userProfile={userProfile}
                register={register}
                errors={errors}
                showSelfOption={false}
                filterRelation="child"
            />

            {/* Информационный блок о child package */}
            <div className="bg-yellow-50 p-3 rounded-lg text-sm">
                ℹ️ Child package includes special insights about education, talents, and development.
            </div>

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
                        <p className="text-sm text-green-600 bg-green-50 p-2 rounded">
                            🎉 Free preview includes: Basic personality overview and key traits for the child.
                        </p>
                    )}
                    {selectedVersion === 'full' && (
                        <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                            ✨ Full version includes: Detailed astrological analysis, educational insights,
                            talent development, and personalized guidance for the child's future.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}