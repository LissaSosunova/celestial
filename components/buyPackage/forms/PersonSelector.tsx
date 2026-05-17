// components/ui/buyPackage/PersonSelector.tsx
'use client';

import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { PurchaseFormData } from '@/lib/schemas/purchaseSchemas';
import { UserProfile } from '@/lib/types/userProfile';
import { Person } from '@/lib/types/person';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ChipsBtn from '@/components/buttons/ChipsBtn';
import { PersonSelectionType } from '@/lib/types/purchase.types';


interface PersonSelectorProps {
  watch: UseFormWatch<PurchaseFormData>;
  setValue: UseFormSetValue<PurchaseFormData>;
  userProfile: UserProfile;
  register: any;
  errors: any;
  showSelfOption?: boolean;
}

export function PersonSelector({ 
  watch, 
  setValue, 
  userProfile, 
  register, 
  errors,
  showSelfOption = true 
}: PersonSelectorProps) {
  const selectedType = watch('personSelectionType') || (showSelfOption ? 'self' : 'existing');
  const selectedPersonUuid = watch('selectedPersonUuid');
  const customPerson = watch('person');

  // Опции для выбора типа
  const selectionOptions = [
    ...(showSelfOption ? [{ value: 'self', label: 'Myself' }] : []),
    { value: 'existing', label: 'Choose from saved' },
    { value: 'new', label: 'Add new person' },
  ];

  const handleTypeSelect = (value: string) => {
    setValue('personSelectionType', value as PersonSelectionType);
    if (value === 'self') {
      // Очищаем выбранную персону
      setValue('selectedPersonUuid', undefined);
      setValue('person', null);
    } else if (value === 'existing') {
      setValue('person', null);
    } else {
      setValue('selectedPersonUuid', undefined);
    }
  };

  const handlePersonSelect = (person: Person) => {
    setValue('selectedPersonUuid', person.uuid);
    setValue('person', {
      name: person.name,
      relation: person.relation,
      birthDate: person.birthDate,
      birthTime: person.birthTime,
      birthLocation: person.birthLocation,
    });
  };

  // Отображение данных выбранной персоны
  const renderSelectedPerson = () => {
    if (selectedType === 'self' && userProfile) {
      return (
        <div className="bg-blue-50 p-4 rounded-lg space-y-1">
          <p className="text-sm font-medium text-blue-900">Your profile data:</p>
          <p className="text-sm text-blue-700">
            Name: {userProfile.name}<br />
            Birth Date: {userProfile.birthDate}<br />
            Birth Time: {userProfile.birthTime}<br />
            Birth Location: {userProfile.birthLocation}
          </p>
        </div>
      );
    }

    if (selectedType === 'existing' && selectedPersonUuid) {
      const selectedPerson = userProfile.persons?.find(p => p.uuid === selectedPersonUuid);
      if (selectedPerson) {
        return (
          <div className="bg-green-50 p-4 rounded-lg space-y-1">
            <p className="text-sm font-medium text-green-900">Selected person:</p>
            <p className="text-sm text-green-700">
              Name: {selectedPerson.name}<br />
              Relation: {selectedPerson.relation.name}<br />
              Birth Date: {selectedPerson.birthDate}<br />
              Birth Time: {selectedPerson.birthTime}<br />
              Birth Location: {selectedPerson.birthLocation}
            </p>
          </div>
        );
      }
    }

    return null;
  };

  const relationOptions = [
    { value: 'child', label: 'Child' },
    { value: 'friend', label: 'Friend' },
    { value: 'business', label: 'Business Partner' },
    { value: 'relationship', label: 'Partner' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <Label>Who is this forecast for? *</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {selectionOptions.map((option) => (
            <ChipsBtn
              key={option.value}
              name={option.label}
              value={option.value}
              isSelected={selectedType === option.value}
              onClick={handleTypeSelect}
            />
          ))}
        </div>
      </div>

      {/* Выбор из существующих персон */}
      {selectedType === 'existing' && userProfile.persons && userProfile.persons.length > 0 && (
        <div className="space-y-3">
          <Label>Select a person:</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userProfile.persons.map((person) => (
              <button
                key={person.uuid}
                type="button"
                onClick={() => handlePersonSelect(person)}
                className={`p-3 border rounded-lg text-left transition-all ${
                  selectedPersonUuid === person.uuid
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <p className="font-semibold">{person.name}</p>
                <p className="text-sm text-gray-600 capitalize">{person.relation.name}</p>
                <p className="text-xs text-gray-500">{person.birthDate}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedType === 'existing' && (!userProfile.persons || userProfile.persons.length === 0) && (
        <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800">
          No saved persons found. Please add a new person.
        </div>
      )}

      {renderSelectedPerson()}

      {/* Форма для новой персоны */}
      {(selectedType === 'new' || (selectedType === 'existing' && (!userProfile.persons || userProfile.persons.length === 0))) && (
        <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h4 className="font-semibold text-gray-900">Add New Person</h4>
          
          <div>
            <Label htmlFor="personName">Full Name *</Label>
            <Input
              id="personName"
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
                  isSelected={watch('person.relation.name') === option.value}
                  onClick={(value) => setValue('person.relation.name', value as any)}
                />
              ))}
            </div>
            {errors.person?.relation?.name && (
              <p className="text-red-500 text-sm mt-1">{errors.person.relation.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="personBirthDate">Birth Date *</Label>
            <Input
              id="personBirthDate"
              type="date"
              {...register('person.birthDate')}
            />
            {errors.person?.birthDate && (
              <p className="text-red-500 text-sm mt-1">{errors.person.birthDate.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="personBirthTime">Birth Time *</Label>
            <Input
              id="personBirthTime"
              type="time"
              {...register('person.birthTime')}
            />
            {errors.person?.birthTime && (
              <p className="text-red-500 text-sm mt-1">{errors.person.birthTime.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="personBirthLocation">Birth Location *</Label>
            <Input
              id="personBirthLocation"
              {...register('person.birthLocation')}
              placeholder="City, Country"
            />
            {errors.person?.birthLocation && (
              <p className="text-red-500 text-sm mt-1">{errors.person.birthLocation.message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}