// components/ui/buyPackage/forms/ChildPackageForm.tsx
'use client';

import { FormComponentProps } from '@/lib/types/purchase.types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ChipsBtn from '@/components/buttons/ChipsBtn';

export function ChildPackageForm({ register, errors, setValue, watch }: FormComponentProps) {
  const relationType = watch('person.relation.name');
  const selectedRelation = relationType || '';

  const relationOptions = [
    { value: 'child', label: 'Child' },
    { value: 'friend', label: 'Friend' },
    { value: 'business', label: 'Business Partner' },
    { value: 'relationship', label: 'Partner' },
  ];

  const handleRelationSelect = (value: string) => {
    setValue('person.relation.name', value as any);
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Child Package</h3>
        <p className="text-sm text-gray-600">
          Create a forecast for your child or another person.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="childName">Person's Name *</Label>
          <Input
            id="childName"
            {...register('person.name')}
            placeholder="Enter person's full name"
          />
          {errors.person?.name && (
            <p className="text-red-500 text-sm mt-1">{errors.person.name.message}</p>
          )}
        </div>

        <div>
          <Label>Relationship *</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {relationOptions.map((option) => (
              <ChipsBtn
                key={option.value}
                name={option.label}
                value={option.value}
                isSelected={selectedRelation === option.value}
                onClick={handleRelationSelect}
              />
            ))}
          </div>
          {errors.person?.relation?.name && (
            <p className="text-red-500 text-sm mt-1">{errors.person.relation.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="childBirthDate">Birth Date *</Label>
          <Input
            id="childBirthDate"
            type="date"
            {...register('person.birthDate')}
          />
          {errors.person?.birthDate && (
            <p className="text-red-500 text-sm mt-1">{errors.person.birthDate.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="childBirthTime">Birth Time *</Label>
          <Input
            id="childBirthTime"
            type="time"
            {...register('person.birthTime')}
          />
          {errors.person?.birthTime && (
            <p className="text-red-500 text-sm mt-1">{errors.person.birthTime.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="childBirthLocation">Birth Location *</Label>
          <Input
            id="childBirthLocation"
            {...register('person.birthLocation')}
            placeholder="City, Country"
          />
          {errors.person?.birthLocation && (
            <p className="text-red-500 text-sm mt-1">{errors.person.birthLocation.message}</p>
          )}
        </div>

        {selectedRelation === 'child' && (
          <div className="bg-yellow-50 p-3 rounded-lg text-sm">
            ℹ️ Child package includes special insights about education, talents, and development.
          </div>
        )}
      </div>
    </div>
  );
}