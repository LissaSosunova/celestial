'use client';

import { FormComponentProps } from '@/lib/types/purchase.types';
import { PersonSelector } from './PersonSelector';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ForecastPackageFormProps extends FormComponentProps {
  packageType: 'forecast_6m' | 'forecast_1y';
}

export function ForecastPackageForm({ 
  register, 
  errors, 
  watch, 
  setValue, 
  packageType,
  userProfile,
  packageItem 
}: ForecastPackageFormProps) {
  const duration = packageType === 'forecast_6m' ? '6 months' : '1 year';

  // Для forecast пакетов нет бесплатной версии, всегда полная
  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Forecast Package ({duration})</h3>
        <p className="text-sm text-gray-600">
          Get detailed astrological forecast for the next {duration}.
        </p>
      </div>

      <PersonSelector
        watch={watch}
        setValue={setValue}
        userProfile={userProfile}
        register={register}
        errors={errors}
        showSelfOption={true}
      />

      <div>
        <Label htmlFor="startDate">Start Date (Optional)</Label>
        <Input
          id="startDate"
          type="date"
          {...register('startDate')}
          min={new Date().toISOString().split('T')[0]}
        />
        <p className="text-xs text-gray-500 mt-1">
          If not selected, forecast will start from today
        </p>
      </div>
    </div>
  );
}