// components/ui/buyPackage/forms/PersonalPackageForm.tsx
'use client';

import { FormComponentProps } from '@/lib/types/purchase.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import ChipsBtn from '@/components/buttons/ChipsBtn';

export function PersonalPackageForm({ register, errors, watch, setValue, userProfile, packageItem }: FormComponentProps) {
  const useOwnData = watch('useOwnData');
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
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Personal Forecast Package</h3>
        <p className="text-sm text-gray-600">
          This package will create a personal forecast based on your birth data.
        </p>
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
              🎉 Free preview includes: Basic personality overview and key traits. 
              Upgrade to full version for detailed analysis, predictions, and personalized insights.
            </p>
          )}
          {selectedVersion === 'full' && (
            <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              ✨ Full version includes: Detailed astrological analysis, life predictions, 
              career insights, relationship compatibility, and personalized recommendations.
            </p>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="useOwnData"
            checked={useOwnData}
            onChange={(e) => setValue('useOwnData', e.target.checked)}
          />
          <Label htmlFor="useOwnData" className="cursor-pointer mb-0">
            Use my profile data
          </Label>
        </div>

        {!useOwnData && (
          <div className="space-y-4 pl-6 border-l-2 border-gray-200">
            <div>
              <Label htmlFor="personalName">Full Name *</Label>
              <Input
                id="personalName"
                {...register('person.name')}
                placeholder="Enter your full name"
              />
              {errors.person?.name && (
                <p className="text-red-500 text-sm mt-1">{errors.person.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="personalBirthDate">Birth Date *</Label>
              <Input
                id="personalBirthDate"
                type="date"
                {...register('person.birthDate')}
              />
              {errors.person?.birthDate && (
                <p className="text-red-500 text-sm mt-1">{errors.person.birthDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="personalBirthTime">Birth Time *</Label>
              <Input
                id="personalBirthTime"
                type="time"
                {...register('person.birthTime')}
              />
              {errors.person?.birthTime && (
                <p className="text-red-500 text-sm mt-1">{errors.person.birthTime.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="personalBirthLocation">Birth Location *</Label>
              <Input
                id="personalBirthLocation"
                {...register('person.birthLocation')}
                placeholder="City, Country"
              />
              {errors.person?.birthLocation && (
                <p className="text-red-500 text-sm mt-1">{errors.person.birthLocation.message}</p>
              )}
            </div>
          </div>
        )}

        {useOwnData && userProfile && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-1">
            <p className="text-sm font-medium">Using profile data:</p>
            <p className="text-sm text-gray-600">
              Name: {userProfile.name}<br />
              Birth Date: {userProfile.birthDate}<br />
              Birth Time: {userProfile.birthTime}<br />
              Birth Location: {userProfile.birthLocation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}