'use client';

import { FormComponentProps } from '@/lib/types/purchase.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export function PersonalPackageForm({ register, errors, watch, setValue, userProfile }: FormComponentProps) {
  const useOwnData = watch('useOwnData');

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Personal Forecast Package</h3>
        <p className="text-sm text-gray-600">
          This package will create a personal forecast based on your birth data.
        </p>
      </div>

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
              Birth Date: userProfile.birthDate<br />
              Birth Time: userProfile.birthTime<br />
              Birth Location: userProfile.birthLocation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}