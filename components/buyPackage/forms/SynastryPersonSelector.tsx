// components/ui/buyPackage/SynastryPersonSelector.tsx
'use client';

import { UseFormSetValue, UseFormWatch, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { PurchaseFormData } from '@/lib/schemas/purchaseSchemas';
import { UserProfile } from '@/lib/types/userProfile';
import { Person } from '@/lib/types/person';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ChipsBtn from '@/components/buttons/ChipsBtn';
import { useTranslations } from 'next-intl';
import { Calendar } from '@/components/ui/calendar';
import { BirthLocationForm } from '@/components/forms/BirthLocationForm';
import { useState, useEffect } from 'react';

interface SynastryPersonSelectorProps {
    watch: UseFormWatch<PurchaseFormData>;
    setValue: UseFormSetValue<PurchaseFormData>;
    control: Control<PurchaseFormData>;
    userProfile: UserProfile;
    register: any;
    errors: any;
    personField: 'firstPerson' | 'secondPerson';
    selectionTypeField: 'personSelectionType' | 'secondPersonSelectionType';
    selectedUuidField: 'selectedPersonUuid' | 'selectedPersonSecondUuid';
    relationTypeFromParent?: 'business' | 'friend' | 'relationship' | null;
    excludeUuid?: string;
    showSelfOption?: boolean;
}

interface BirthLocationType {
    country: string;
    city: string;
    timeZone: string;
    state?: string;
}

interface PersonType {
    name?: string;
    birthDate?: string;
    birthTime?: string;
    birthLocation?: BirthLocationType;
    relation?: {
        name?: 'business' | 'friend' | 'relationship' | null;
    };
}

const formatBirthLocation = (birthLocation: any): string => {
    if (!birthLocation) return 'Not specified';
    if (typeof birthLocation === 'string') return birthLocation;

    const parts = [];
    if (birthLocation.city) parts.push(birthLocation.city);
    if (birthLocation.state) parts.push(birthLocation.state);
    if (birthLocation.country) parts.push(birthLocation.country);

    return parts.length > 0 ? parts.join(', ') : 'Not specified';
};

export function SynastryPersonSelector({
    watch,
    setValue,
    control,
    userProfile,
    register,
    errors,
    personField,
    selectionTypeField,
    selectedUuidField,
    relationTypeFromParent = null,
    excludeUuid,
    showSelfOption = false
}: SynastryPersonSelectorProps) {
    const t = useTranslations('packages');

    const selectedType = (() => {
        const value = watch(selectionTypeField as any);
        if (showSelfOption) {
            return value === 'self' || value === 'existing' || value === 'new' ? value : 'self';
        }
        return value === 'existing' || value === 'new' ? value : 'new';
    })();

    const selectedPersonUuid = watch(selectedUuidField as any);
    const currentPerson = watch(personField as any) as PersonType | null | undefined;

    // Фильтруем персоны
    let filteredPersons = userProfile.persons || [];
    
    if (relationTypeFromParent) {
        filteredPersons = filteredPersons.filter(person => person.relation?.name === relationTypeFromParent);
    }
    
    if (excludeUuid) {
        filteredPersons = filteredPersons.filter(person => person.uuid !== excludeUuid);
    }

    // Опции для выбора типа
    const selectionOptions = [
        ...(showSelfOption ? [{ value: 'self', label: 'Myself' }] : []),
        ...(filteredPersons.length > 0 ? [{ value: 'existing', label: 'Choose from saved' }] : []),
        { value: 'new', label: 'New person' },
    ];

    const handleTypeSelect = (value: string) => {
        setValue(selectionTypeField as any, value);
        if (value === 'self') {
            setValue(selectedUuidField as any, undefined);
            setValue(personField as any, null);
        } else if (value === 'existing') {
            setValue(personField as any, null);
        } else {
            setValue(selectedUuidField as any, undefined);
        }
    };

    const handlePersonSelect = (person: Person) => {
        setValue(selectedUuidField as any, person.uuid);
        setValue(personField as any, {
            name: person.name,
            relation: person.relation,
            birthDate: person.birthDate,
            birthTime: person.birthTime,
            birthLocation: person.birthLocation,
        });
    };

    const updatePersonBirthLocation = (location: BirthLocationType) => {
        if (currentPerson) {
            setValue(personField as any, {
                ...currentPerson,
                birthLocation: location,
            });
        } else {
            setValue(personField as any, {
                birthLocation: location,
            });
        }
    };

    // Отображение данных выбранной персоны
    const renderSelectedPerson = () => {
        // Отображение данных текущего пользователя (self)
        if (selectedType === 'self' && userProfile) {
            return (
                <div className="shadow-sm border border-border-light bg-white p-4 rounded-lg space-y-1">
                    <p className="text-sm font-medium text-gray-900">{t('Using profile data')}</p>
                    <p className="text-sm text-gray-700">
                        {t('Name')}: {userProfile.name}<br />
                        {t('Birth Date')}: {userProfile.birthDate}<br />
                        {t('Birth Time')}: {userProfile.birthTime}<br />
                        {t('Birth Location')}: {formatBirthLocation(userProfile.birthLocation)}
                    </p>
                </div>
            );
        }

        // Отображение выбранной сохраненной персоны
        if (selectedType === 'existing' && selectedPersonUuid) {
            const selectedPerson = filteredPersons?.find(p => p.uuid === selectedPersonUuid);
            if (selectedPerson) {
                return (
                    <div className="bg-green-50 p-4 rounded-lg space-y-1">
                        <p className="text-sm font-medium text-green-900">{t('Selected person')}:</p>
                        <p className="text-sm text-green-700">
                            {t('Name')}: {selectedPerson.name}<br />
                            {t('Relation')}: {selectedPerson.relation?.name || 'No relation'}<br />
                            {t('Birth Date')}: {selectedPerson.birthDate}<br />
                            {t('Birth Time')}: {selectedPerson.birthTime}<br />
                            {t('Birth Location')}: {formatBirthLocation(selectedPerson.birthLocation)}
                        </p>
                    </div>
                );
            }
        }
        return null;
    };

    const getRelationOptions = () => {
        if (relationTypeFromParent) {
            return [
                { value: relationTypeFromParent, label: relationTypeFromParent === 'relationship' ? 'Partner' : relationTypeFromParent === 'friend' ? 'Friend' : 'Business Partner' },
            ];
        }
        return [];
    };

    const relationOptions = getRelationOptions();

    const handleRelationSelect = (value: string) => {
        if (currentPerson) {
            setValue(personField as any, {
                ...currentPerson,
                relation: { name: value },
            });
        } else {
            setValue(personField as any, {
                relation: { name: value },
            });
        }
    };

    const isRelationSelected = (value: string) => {
        return currentPerson?.relation?.name === value;
    };

    useEffect(() => {
        if (relationTypeFromParent && selectedType === 'new' && !currentPerson?.relation?.name) {
            setTimeout(() => {
                if (!currentPerson?.relation?.name) {
                    if (currentPerson) {
                        setValue(personField as any, {
                            ...currentPerson,
                            relation: { name: relationTypeFromParent },
                        });
                    } else {
                        setValue(personField as any, {
                            relation: { name: relationTypeFromParent },
                        });
                    }
                }
            }, 0);
        }
    }, [relationTypeFromParent, selectedType, currentPerson]);

    const getTimeDateObject = (timeString?: string): Date | undefined => {
        if (!timeString) return undefined;
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return isNaN(date.getTime()) ? undefined : date;
    };

    const handleBirthLocationSave = (location: any) => {
        const formattedLocation: BirthLocationType = {
            country: location.country,
            city: location.city,
            timeZone: location.timeZone,
            state: location.region || location.state,
        };
        updatePersonBirthLocation(formattedLocation);
    };

    const personErrors = errors[personField as keyof typeof errors];

    return (
        <div className="space-y-4">
            <div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectionOptions.map((option) => (
                        <ChipsBtn
                            key={option.value}
                            name={t(`${option.label}`)}
                            value={option.value}
                            isSelected={selectedType === option.value}
                            onClick={handleTypeSelect}
                        />
                    ))}
                </div>
            </div>

            {selectedType === 'existing' && filteredPersons.length > 0 && (
                <div className="space-y-3">
                    <Label>Select a person:</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredPersons.map((person) => (
                            <button
                                key={person.uuid}
                                type="button"
                                onClick={() => handlePersonSelect(person)}
                                className={`p-3 border rounded-lg text-left transition-all ${selectedPersonUuid === person.uuid
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-300'
                                    }`}
                            >
                                <p className="font-semibold">{person.name}</p>
                                <p className="text-sm text-gray-600 capitalize">
                                    {person.relation?.name || 'No relation'}
                                </p>
                                <p className="text-xs text-gray-500">{person.birthDate}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {renderSelectedPerson()}

            {selectedType === 'new' && (
                <div className="space-y-4 p-4 border shadow-sm border-border-light rounded-lg bg-white">
                    <h4 className="font-semibold text-gray-900">{t('Add New Person')}</h4>

                    <div>
                        <Label htmlFor={`${personField}Name`} className="after:content-['*']">{t('Name')}</Label>
                        <Input
                            id={`${personField}Name`}
                            {...register(`${personField}.name`)}
                            placeholder={t('Name')}
                        />
                        {personErrors?.name && (
                            <p className="text-red-500 text-sm mt-1">{t(`${personErrors.name.message}`)}</p>
                        )}
                    </div>

                    <div>
                        <Label className="after:content-['*']">{t('Relation')}</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {relationOptions.map((option) => (
                                <ChipsBtn
                                    key={option.value}
                                    name={t(`${option.label}`)}
                                    value={option.value}
                                    isSelected={isRelationSelected(option.value)}
                                    onClick={handleRelationSelect}
                                />
                            ))}
                        </div>
                        {personErrors?.relation?.name && (
                            <p className="text-red-500 text-sm mt-1">{t(`${personErrors.relation.name.message}`)}</p>
                        )}
                    </div>

                    <div className='max-w-xs'>
                        <Label htmlFor={`${personField}BirthDate`} className="after:content-['*']">
                            {t('Birth Date')}
                        </Label>
                        <Controller
                            name={`${personField}.birthDate` as any}
                            control={control}
                            render={({ field }) => (
                                <Calendar
                                    selected={field.value ? new Date(field.value) : undefined}
                                    onSelect={(date) => {
                                        const formattedDate = date ? date.toISOString().split('T')[0] : '';
                                        field.onChange(formattedDate);
                                    }}
                                    maxDate={new Date()}
                                />
                            )}
                        />
                        {personErrors?.birthDate && (
                            <p className="text-red-500 text-sm mt-1">
                                {t(personErrors.birthDate.message as string)}
                            </p>
                        )}
                    </div>

                    <div className='max-w-xs'>
                        <Label htmlFor={`${personField}BirthTime`} className="after:content-['*']">
                            {t('Birth Time')}
                        </Label>
                        <Controller
                            name={`${personField}.birthTime` as any}
                            control={control}
                            render={({ field }) => (
                                <Calendar
                                    mode="time"
                                    selected={getTimeDateObject(field.value)}
                                    onSelect={(date) => {
                                        const formattedTime = date ? date.toTimeString().slice(0, 5) : '';
                                        field.onChange(formattedTime);
                                    }}
                                    showTimeSelectOnly={true}
                                    timeIntervals={15}
                                    placeholderText={t('Select time')}
                                />
                            )}
                        />
                        {personErrors?.birthTime && (
                            <p className="text-red-500 text-sm mt-1">
                                {t(personErrors.birthTime.message as string)}
                            </p>
                        )}
                    </div>

                    <div>
                        <Label className="after:content-['*']">{t('Birth Location')}</Label>
                        <BirthLocationForm
                            onSave={handleBirthLocationSave}
                            initialLocation={currentPerson?.birthLocation as any}
                            isSubmitting={false}
                        />
                        {personErrors?.birthLocation && (
                            <p className="text-red-500 text-sm mt-1">
                                {t('Birth location is required')}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}