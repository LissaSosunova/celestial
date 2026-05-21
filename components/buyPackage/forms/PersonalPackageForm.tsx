// components/ui/buyPackage/forms/PersonalPackageForm.tsx
'use client';

import { Label } from '@/components/ui/label';
import ChipsBtn from '@/components/buttons/ChipsBtn';
import { UseFormReturn } from 'react-hook-form';
import { PurchaseFormData } from '@/lib/schemas/purchaseSchemas';
import { Package } from '@/lib/types/package';
import { UserProfile } from '@/lib/types/userProfile';
import { PersonSelector } from './PersonSelector';

interface PersonalPackageFormProps {
  register: UseFormReturn<PurchaseFormData>['register'];
  errors: UseFormReturn<PurchaseFormData>['formState']['errors'];
  watch: UseFormReturn<PurchaseFormData>['watch'];
  setValue: UseFormReturn<PurchaseFormData>['setValue'];
  isSubmitting: boolean;
  userProfile: UserProfile;
  packageItem: Package;
}

export function PersonalPackageForm({ 
  register, 
  errors, 
  watch, 
  setValue, 
  userProfile, 
  packageItem 
}: PersonalPackageFormProps) {
  const selectedVersion = watch('selectedVersion') || (packageItem.isFreePart ? 'free' : 'full');
  
  // Опции версий зависят от isFreePart
  const versionOptions = [
    ...(packageItem.isFreePart ? [{ value: 'free', label: 'Free Preview (Short Summary)' }] : []),
    { value: 'full', label: 'Full Version (Detailed Analysis)' },
  ];

  const handleVersionSelect = (value: string) => {
    setValue('selectedVersion', value as 'free' | 'full');
    // Обновляем typeOfPurchase в зависимости от выбранной версии
    if (value === 'free') {
      setValue('typeOfPurchase', 'free');
    } else {
      setValue('typeOfPurchase', 'price');
    }
  };

  return (
    <div className="space-y-6">
      <div className="shadow-sm border border-border-light bg-white p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Personal Natal Chart</h3>
        <p className="text-sm text-gray-600">
          Deep dive into your soul's blueprint and psychological makeup.
        </p>
      </div>

      {/* PersonSelector для выбора человека */}
      <PersonSelector
        watch={watch}
        setValue={setValue}
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
            <p className="text-sm text-green-600 bg-green-50 p-2 rounded shadow-sm border-border-light">
              🎉 Free preview includes: Basic personality overview and key traits.
              Upgrade to full version for detailed analysis, predictions, and personalized insights.
            </p>
          )}
          {selectedVersion === 'full' && (
            <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded shadow-sm border-border-light">
              ✨ Full version includes: Detailed astrological analysis, life predictions,
              career insights, relationship compatibility, and personalized recommendations.
            </p>
          )}
        </div>
      )}
    </div>
  );
}