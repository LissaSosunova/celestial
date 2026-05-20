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
  filterRelation?: 'child' | 'friend' | 'business' | 'relationship' | null;
}

export function PersonSelector({ 
  watch, 
  setValue, 
  userProfile, 
  register, 
  errors,
  showSelfOption = true,
  filterRelation = null
}: PersonSelectorProps) {
  const selectedType = watch('personSelectionType') || (showSelfOption ? 'self' : 'existing');
  const selectedPersonUuid = watch('selectedPersonUuid');
  const customPerson = watch('person');

  // Фильтруем персоны по отношению, если указан filterRelation
  const filteredPersons = filterRelation 
    ? userProfile.persons?.filter(person => person.relation.name === filterRelation)
    : userProfile.persons;

  // Опции для выбора типа
  const selectionOptions = [
    ...(showSelfOption ? [{ value: 'self', label: 'Myself' }] : []),
    ...(filteredPersons && filteredPersons.length > 0 ? [{ value: 'existing', label: 'Choose from saved' }] : []),
    { value: 'new', label: 'Add new person' },
  ];

  const handleTypeSelect = (value: string) => {
    setValue('personSelectionType', value as PersonSelectionType);
    if (value === 'self') {
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
      const selectedPerson = filteredPersons?.find(p => p.uuid === selectedPersonUuid);
      if (selectedPerson) {
        return (
          <div className="bg-green-50 p-4 rounded-lg space-y-1">
            <p className="text-sm font-medium text-green-900">Selected person:</p>
            <p className="text-sm text-green-700">
              Name: {selectedPerson.name}<br />
              Relation: {selectedPerson.relation.name || 'No relation'}<br />
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

  // Опции для отношения с добавлением опции "No relation"
  const getRelationOptions = () => {
    const allOptions = [
      { value: 'child', label: 'Child' },
      { value: 'friend', label: 'Friend' },
      { value: 'business', label: 'Business Partner' },
      { value: 'relationship', label: 'Partner' },
      { value: 'null', label: 'No relation' }, // Добавляем опцию "No relation"
    ];

    if (filterRelation) {
      return allOptions.filter(option => option.value === filterRelation);
    }
    
    return allOptions;
  };

  const relationOptions = getRelationOptions();

  // Функция для установки отношения с поддержкой null
  const handleRelationSelect = (value: string) => {
    if (value === 'null') {
      setValue('person.relation.name', null);
    } else {
      setValue('person.relation.name', value as any);
    }
  };

  // Проверка выбранного отношения для отображения активного состояния
  const isRelationSelected = (value: string) => {
    const currentRelation = watch('person.relation.name');
    if (value === 'null') {
      return currentRelation === null;
    }
    return currentRelation === value;
  };

  // Если есть фильтр и только одна опция, автоматически устанавливаем её
  if (filterRelation && relationOptions.length === 1 && !watch('person.relation.name')) {
    setTimeout(() => {
      if (!watch('person.relation.name')) {
        if (!filterRelation) {
          setValue('person.relation.name', null);
        } else {
          setValue('person.relation.name', filterRelation as any);
        }
      }
    }, 0);
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Who is this forecast or natal card for? *</Label>
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
      {selectedType === 'existing' && filteredPersons && filteredPersons.length > 0 && (
        <div className="space-y-3">
          <Label>Select a {filterRelation ? filterRelation : 'person'}:</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredPersons.map((person) => (
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
                <p className="text-sm text-gray-600 capitalize">
                  {person.relation.name || 'No relation'}
                </p>
                <p className="text-xs text-gray-500">{person.birthDate}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedType === 'existing' && (!filteredPersons || filteredPersons.length === 0) && (
        <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800">
          {filterRelation 
            ? `No saved ${filterRelation}s found. Please add a new ${filterRelation}.`
            : 'No saved persons found. Please add a new person.'}
        </div>
      )}

      {renderSelectedPerson()}

      {/* Форма для новой персоны */}
      {(selectedType === 'new' || (selectedType === 'existing' && (!filteredPersons || filteredPersons.length === 0))) && (
        <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-white">
          <h4 className="font-semibold text-gray-900">Add New {filterRelation ? filterRelation : 'Person'}</h4>
          
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
                  isSelected={isRelationSelected(option.value)}
                  onClick={handleRelationSelect}
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