// components/forms/BirthLocationForm.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { CountrySelect } from './CountrySelect';
import { RegionSelect } from './RegionSelect';
import { CityInput } from './CityInput';
import { getRegionLabel } from '@/lib/utils/regionLabels';
import { getFallbackTimezone } from '@/lib/utils/countryUtils';
import { useTranslations } from 'next-intl';

interface BirthLocation {
    country: string;
    city: string;
    timeZone: string;
    region?: string;
    isCustomCity?: boolean;
}

interface BirthLocationFormProps {
    onSave: (location: BirthLocation) => void;
    initialLocation?: Partial<BirthLocation>;
    isSubmitting?: boolean;
    className?: string;
}

export function BirthLocationForm({ 
    onSave, 
    initialLocation, 
    isSubmitting = false,
    className = ''
}: BirthLocationFormProps) {
    const [selectedCountry, setSelectedCountry] = useState<any>(null);
    const [selectedRegion, setSelectedRegion] = useState<any>(null);
    const [city, setCity] = useState('');
    const [timezone, setTimezone] = useState('');
    const [isCustomCity, setIsCustomCity] = useState(false);
    const [manualTimezone, setManualTimezone] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const t = useTranslations('common');

    // Загрузка данных страны по коду из initialLocation
    useEffect(() => {
        if (initialLocation?.country && !selectedCountry) {
            // Если есть код страны, нужно загрузить данные страны
            // Для простоты, создаем объект страны с минимальными данными
            setSelectedCountry({
                iso2: initialLocation.country,
                hasRegions: false, // Будет обновлено при загрузке
            });
        }
    }, [initialLocation?.country]);

    // Синхронизация region из initialLocation
    useEffect(() => {
        if (initialLocation?.region && !selectedRegion) {
            setSelectedRegion({ code: initialLocation.region });
        }
    }, [initialLocation?.region]);

    // Синхронизация города
    useEffect(() => {
        if (initialLocation?.city) {
            setCity(initialLocation.city);
        }
    }, [initialLocation?.city]);

    // Синхронизация таймзоны
    useEffect(() => {
        if (initialLocation?.timeZone) {
            setTimezone(initialLocation.timeZone);
            setManualTimezone(initialLocation.timeZone);
        }
    }, [initialLocation?.timeZone]);

    // Функция сохранения при изменении любого поля
    const saveLocation = useCallback(() => {
        if (selectedCountry?.iso2 && city && timezone) {
            onSave({
                country: selectedCountry.iso2,
                city: city,
                timeZone: timezone,
                region: selectedRegion?.code || initialLocation?.region,
                isCustomCity: isCustomCity,
            });
        }
    }, [selectedCountry, selectedRegion, city, timezone, isCustomCity, initialLocation?.region, onSave]);

    // Обработчик выбора страны
    const handleCountrySelect = (country: any) => {
        setSelectedCountry(country);
        setSelectedRegion(null);
        setCity('');
        setTimezone('');
        setIsCustomCity(false);
        setManualTimezone('');
        setErrors({});
        
        onSave({
            country: country.iso2,
            city: '',
            timeZone: '',
            region: '',
            isCustomCity: false,
        });
    };

    // Обработчик выбора региона
    const handleRegionSelect = (region: any) => {
        setSelectedRegion(region);
        setCity('');
        setTimezone('');
        setIsCustomCity(false);
        setManualTimezone('');
        
        // Обновляем сохранение с новым регионом
        if (selectedCountry?.iso2) {
            onSave({
                country: selectedCountry.iso2,
                city: '',
                timeZone: '',
                region: region?.code,
                isCustomCity: false,
            });
        }
    };

    // Обработчик выбора города
    const handleCitySelect = (cityName: string, cityTimezone: string, isCustom: boolean = false) => {
        setCity(cityName);
        setTimezone(cityTimezone);
        setIsCustomCity(isCustom);
        if (isCustom) {
            setManualTimezone(cityTimezone);
        }
        
        if (errors.city) {
            setErrors(prev => ({ ...prev, city: '' }));
        }
        
        if (selectedCountry?.iso2 && cityName && cityTimezone) {
            onSave({
                country: selectedCountry.iso2,
                city: cityName,
                timeZone: cityTimezone,
                region: selectedRegion?.code,
                isCustomCity: isCustom,
            });
        }
    };

    // Обработчик изменения таймзоны для кастомного города
    const handleManualTimezoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTimezone = e.target.value;
        setManualTimezone(newTimezone);
        setTimezone(newTimezone);
        
        if (errors.timeZone) {
            setErrors(prev => ({ ...prev, timeZone: '' }));
        }
        
        if (selectedCountry?.iso2 && city && newTimezone) {
            onSave({
                country: selectedCountry.iso2,
                city: city,
                timeZone: newTimezone,
                region: selectedRegion?.code,
                isCustomCity: true,
            });
        }
    };

    const suggestedTimezone = selectedCountry
        ? getFallbackTimezone(selectedCountry.iso2)
        : '';

    // Определяем, показывать ли выбор региона
    const showRegionSelect = selectedCountry?.hasRegions && selectedCountry.iso2;

    return (
        <div className={`space-y-3 w-full ${className}`}>
            {/* Country Select */}
            <div>
                <CountrySelect
                    onSelect={handleCountrySelect}
                    selectedCountry={initialLocation?.country}
                    disabled={isSubmitting}
                />
                {errors.country && (
                    <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                )}
            </div>

            {/* Region Select - показываем только если у страны есть регионы */}
            {showRegionSelect && (
                <div>
                    <RegionSelect
                        countryCode={selectedCountry.iso2}
                        onSelect={handleRegionSelect}
                        selectedRegion={selectedRegion?.code || initialLocation?.region}
                        disabled={isSubmitting}
                    />
                </div>
            )}

            {/* City Input */}
            <div>
                <CityInput
                    countryCode={selectedCountry?.iso2 || ''}
                    regionCode={selectedRegion?.code}
                    onSelect={handleCitySelect}
                    selectedCity={city || initialLocation?.city || ''}
                    selectedTimezone={timezone}
                    disabled={isSubmitting || !selectedCountry}
                    placeholder={t('Search or enter city')}
                />
                {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
            </div>

            {/* Timezone display */}
            {isCustomCity ? (
                <div>
                    <input
                        type="text"
                        value={manualTimezone || timezone || suggestedTimezone}
                        onChange={handleManualTimezoneChange}
                        placeholder="e.g., Europe/Warsaw, Europe/Kyiv"
                        disabled={isSubmitting}
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f79309] disabled:bg-gray-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {t('IANA timezone format')}
                    </p>
                </div>
            ) : (timezone || initialLocation?.timeZone) ? (
                <div className="px-4 py-2 bg-gray-50 rounded-md text-xs text-gray-600">
                    {t('Timezone')}: {timezone || initialLocation?.timeZone}
                </div>
            ) : null}
            
            {errors.timeZone && (
                <p className="text-red-500 text-xs mt-1">{errors.timeZone}</p>
            )}
        </div>
    );
}