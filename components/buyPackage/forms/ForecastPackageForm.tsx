// components/ui/buyPackage/forms/ForecastPackageForm.tsx
'use client';

import { FormComponentProps } from '@/lib/types/purchase.types';
import { PersonSelector } from './PersonSelector';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

interface ForecastPackageFormProps extends FormComponentProps {
  packageType: 'forecast_6m' | 'forecast_1y';
}

export function ForecastPackageForm({ 
  register, 
  errors, 
  watch, 
  setValue, 
  packageType,
  userProfile 
}: ForecastPackageFormProps) {
  const [startDate, setStartDate] = useState<Date>();
  const duration = packageType === 'forecast_6m' ? '6 months' : '1 year';

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
        <Label>Start Date (Optional)</Label>
        <Popover>
          <PopoverTrigger>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, 'PPP') : 'Select start date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => {
                setStartDate(date);
                setValue('startDate', date);
              }}
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
        <p className="text-xs text-gray-500 mt-1">
          If not selected, forecast will start from today
        </p>
      </div>
    </div>
  );
}