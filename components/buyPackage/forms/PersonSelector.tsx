// components/ui/buyPackage/PersonSelector.tsx
'use client';

import { UseFormSetValue, UseFormWatch, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { PurchaseFormData } from '@/lib/schemas/purchaseSchemas';
import { UserProfile } from '@/lib/types/userProfile';
import { Person } from '@/lib/types/person';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import ChipsBtn from '@/components/buttons/ChipsBtn';
import { PersonSelectionType } from '@/lib/types/purchase.types';
import { useTranslations } from 'next-intl';
import { Calendar } from '@/components/ui/calendar';
import { BirthLocationForm } from '@/components/forms/BirthLocationForm';
import { useState } from 'react';

interface PersonSelectorProps {
    watch: UseFormWatch<PurchaseFormData>;
    setValue: UseFormSetValue<PurchaseFormData>;
    control: Control<PurchaseFormData>;
    userProfile: UserProfile;
    userId?: string;
    register: any;
    errors: any;
    showSelfOption?: boolean;
    filterRelation?: 'child' | 'friend' | 'business' | 'relationship' | null;
}

// Вспомогательная функция для форматирования отображения BirthLocation
const formatBirthLocation = (birthLocation: any): string => {
    if (!birthLocation) return 'Not specified';
    if (typeof birthLocation === 'string') return birthLocation;

    const parts = [];
    if (birthLocation.city) parts.push(birthLocation.city);
    if (birthLocation.state) parts.push(birthLocation.state);
    if (birthLocation.country) parts.push(birthLocation.country);

    return parts.length > 0 ? parts.join(', ') : 'Not specified';
};

export function PersonSelector({
    watch,
    setValue,
    control,
    userProfile,
    userId,
    register,
    errors,
    showSelfOption = true,
    filterRelation = null
}: PersonSelectorProps) {
    const selectedType = watch('personSelectionType') || (showSelfOption ? 'self' : 'existing');
    const selectedPersonUuid = watch('selectedPersonUuid');
    const t = useTranslations('packages');

    // Состояния для формы новой персоны
    const [selectedCountry, setSelectedCountry] = useState<any>(null);
    const [selectedRegion, setSelectedRegion] = useState<any>(null);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedTimezone, setSelectedTimezone] = useState('');

    // Фильтруем персоны по отношению, если указан filterRelation
    const filteredPersons = filterRelation
        ? userProfile.persons?.filter(person => person.relation?.name === filterRelation)
        : userProfile.persons;

    // Опции для выбора типа
    const selectionOptions = [
        ...(showSelfOption ? [{ value: 'self', label: 'Myself' }] : []),
        ...(filteredPersons && filteredPersons.length > 0 ? [{ value: 'existing', label: 'Choose from saved' }] : []),
        { value: 'new', label: 'New person' },
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
            setSelectedCountry(null);
            setSelectedRegion(null);
            setSelectedCity('');
            setSelectedTimezone('');
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

    // Обновление birthLocation в форме при выборе локации
    const updatePersonBirthLocation = (field: keyof NonNullable<PurchaseFormData['person']>['birthLocation'], value: string) => {
        const currentLocation = watch('person.birthLocation') || {};
        
        // Создаем новый объект без использования delete
        const newLocation: Record<string, any> = {};
        
        // Копируем только непустые значения
        if (currentLocation.country && field !== 'country') newLocation.country = currentLocation.country;
        if (currentLocation.city && field !== 'city') newLocation.city = currentLocation.city;
        if (currentLocation.timeZone && field !== 'timeZone') newLocation.timeZone = currentLocation.timeZone;
        if (currentLocation.state && field !== 'state') newLocation.state = currentLocation.state;
        
        // Добавляем новое значение
        if (value) {
            newLocation[field] = value;
        }
        
        setValue('person.birthLocation', newLocation as any);
    };

    const handleCountrySelect = (country: any) => {
        setSelectedCountry(country);
        setSelectedRegion(null);
        setSelectedCity('');
        setSelectedTimezone('');

        updatePersonBirthLocation('country', country.iso2);
        updatePersonBirthLocation('state', '');
        updatePersonBirthLocation('city', '');
        updatePersonBirthLocation('timeZone', '');
    };

    const handleRegionSelect = (region: any) => {
        setSelectedRegion(region);
        setSelectedCity('');
        setSelectedTimezone('');

        updatePersonBirthLocation('state', region?.code || '');
        updatePersonBirthLocation('city', '');
        updatePersonBirthLocation('timeZone', '');
    };

    const handleCitySelect = (city: string, timezone: string) => {
        setSelectedCity(city);
        setSelectedTimezone(timezone);

        updatePersonBirthLocation('city', city);
        updatePersonBirthLocation('timeZone', timezone);
    };

    // Отображение данных выбранной персоны
    const renderSelectedPerson = () => {
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
        const allOptions = [
            { value: 'child', label: 'Child' },
            { value: 'friend', label: 'Friend' },
            { value: 'business', label: 'Business Partner' },
            { value: 'relationship', label: 'Partner' },
            { value: 'null', label: 'No relation' },
        ];

        if (filterRelation) {
            return allOptions.filter(option => option.value === filterRelation);
        }

        return allOptions;
    };

    const relationOptions = getRelationOptions();

    const handleRelationSelect = (value: string) => {
        if (value === 'null') {
            setValue('person.relation.name', null);
        } else {
            setValue('person.relation.name', value as any);
        }
    };

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

    // Функция для преобразования строки времени в Date объект
    const getTimeDateObject = (timeString?: string): Date | undefined => {
        if (!timeString) return undefined;
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return isNaN(date.getTime()) ? undefined : date;
    };

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
                                <p className="text-xs text-gray-400 truncate">
                                    {formatBirthLocation(person.birthLocation)}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {selectedType === 'existing' && (!filteredPersons || filteredPersons.length === 0) && (
                <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800">
                    {t('No saved persons found')}
                </div>
            )}

            {renderSelectedPerson()}

            {/* Форма для новой персоны */}
            {(selectedType === 'new' || (selectedType === 'existing' && (!filteredPersons || filteredPersons.length === 0))) && (
                <div className="space-y-4 p-4 border shadow-sm border-border-light rounded-lg bg-white">
                    <h4 className="font-semibold text-gray-900">{t('Add New')}</h4>

                    <div>
                        <Label htmlFor="personName" className="after:content-['*']">{t('Name')}</Label>
                        <Input
                            id="personName"
                            {...register('person.name')}
                            placeholder={t('Name')}
                        />
                        {errors.person?.name && (
                            <p className="text-red-500 text-sm mt-1">{t(`${errors.person.name.message}`)}</p>
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
                        {errors.person?.relation?.name && (
                            <p className="text-red-500 text-sm mt-1">{t(`${errors.person.relation.name.message}`)}</p>
                        )}
                    </div>

                    <div className='max-w-xs'>
                        <Label htmlFor="personBirthDate" className="after:content-['*']">
                            {t('Birth Date')}
                        </Label>
                        <Controller
                            name="person.birthDate"
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
                        {errors.person?.birthDate && (
                            <p className="text-red-500 text-sm mt-1">
                                {t(errors.person.birthDate.message as string)}
                            </p>
                        )}
                    </div>

                    <div className='max-w-xs'>
                        <Label htmlFor="personBirthTime" className="after:content-['*']">
                            {t('Birth Time')}
                        </Label>
                        <Controller
                            name="person.birthTime"
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
                        {errors.person?.birthTime && (
                            <p className="text-red-500 text-sm mt-1">
                                {t(errors.person.birthTime.message as string)}
                            </p>
                        )}
                    </div>

                    {/* Birth Location */}
                    <div>
                        <Label className="after:content-['*']">{t('Birth Location')}</Label>

                        <BirthLocationForm
                            onSave={(location) => {
                                setValue('person.birthLocation', location);
                            }}
                            initialLocation={watch('person.birthLocation')}
                            isSubmitting={false}
                        />

                        {errors.person?.birthLocation && (
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