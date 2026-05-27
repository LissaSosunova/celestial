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
}

export function BirthLocationForm({ onSave, initialLocation, isSubmitting = false }: BirthLocationFormProps) {
    const [selectedCountry, setSelectedCountry] = useState<any>(null);
    const [selectedRegion, setSelectedRegion] = useState<any>(null);
    const [city, setCity] = useState(initialLocation?.city || '');
    const [timezone, setTimezone] = useState(initialLocation?.timeZone || '');
    const [isCustomCity, setIsCustomCity] = useState(false);
    const [manualTimezone, setManualTimezone] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const t = useTranslations('common');

    // Функция авто-сохранения
    const autoSave = useCallback((locationData: Partial<BirthLocation>) => {
        const newLocation: BirthLocation = {
            country: locationData.country ?? selectedCountry?.iso2 ?? '',
            city: locationData.city ?? city,
            timeZone: locationData.timeZone ?? timezone,
            region: locationData.region ?? selectedRegion?.code,
            isCustomCity: locationData.isCustomCity ?? isCustomCity,
        };
        
        // Сохраняем только если есть минимально необходимые данные
        if (newLocation.country && newLocation.city && newLocation.timeZone) {
            onSave(newLocation);
        }
    }, [selectedCountry, selectedRegion, city, timezone, isCustomCity, onSave]);

    // Обработчики изменений с авто-сохранением
    const handleCountrySelect = (country: any) => {
        setSelectedCountry(country);
        setSelectedRegion(null);
        setCity('');
        setTimezone('');
        setIsCustomCity(false);
        setManualTimezone('');
        setErrors({});
        
        // Авто-сохранение после выбора страны (пока без города)
        if (country.iso2) {
            onSave({
                country: country.iso2,
                city: '',
                timeZone: '',
                region: '',
                isCustomCity: false,
            });
        }
    };

    const handleRegionSelect = (region: any) => {
        setSelectedRegion(region);
        setCity('');
        setTimezone('');
        setIsCustomCity(false);
        setManualTimezone('');
        
        // Авто-сохранение при выборе региона
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
        
        // Авто-сохранение при выборе города
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

    const handleManualTimezoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTimezone = e.target.value;
        setManualTimezone(newTimezone);
        setTimezone(newTimezone);
        
        if (errors.timeZone) {
            setErrors(prev => ({ ...prev, timeZone: '' }));
        }
        
        // Авто-сохранение при изменении таймзоны для кастомного города
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

    // Инициализация при монтировании
    useEffect(() => {
        if (initialLocation?.country && !selectedCountry) {
            // Если есть начальные данные, нужно загрузить страну по коду
            // Для упрощения, пока просто устанавливаем значения
            setCity(initialLocation.city || '');
            setTimezone(initialLocation.timeZone || '');
            setIsCustomCity(initialLocation.isCustomCity || false);
            
            if (initialLocation.timeZone && initialLocation.city && initialLocation.country) {
                onSave({
                    country: initialLocation.country,
                    city: initialLocation.city,
                    timeZone: initialLocation.timeZone,
                    region: initialLocation.region,
                    isCustomCity: initialLocation.isCustomCity || false,
                });
            }
        }
    }, [initialLocation, selectedCountry, onSave]);

    return (
        <div className="space-y-4 w-full">
            <div className="text-xs text-gray-500 mb-2">
                ⓘ {t('Locations appear in English to ensure precise results in global astrological databases')}
            </div>
            
            <div>
                <label className="block text-sm font-medium mb-1">
                    Country <span className="text-red-500">*</span>
                </label>
                <CountrySelect
                    onSelect={handleCountrySelect}
                    selectedCountry={initialLocation?.country}
                    disabled={isSubmitting}
                />
                {errors.country && (
                    <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                )}
            </div>

            {selectedCountry?.hasRegions && selectedCountry.iso2 && (
                <div>
                    <label className="block text-sm font-medium mb-1">
                        {getRegionLabel(selectedCountry.iso2)}
                    </label>
                    <RegionSelect
                        countryCode={selectedCountry.iso2}
                        onSelect={handleRegionSelect}
                        selectedRegion={initialLocation?.region}
                        disabled={isSubmitting}
                    />
                </div>
            )}

            <div>
                <label className="block text-sm font-medium mb-1">
                    City <span className="text-red-500">*</span>
                </label>
                <CityInput
                    countryCode={selectedCountry?.iso2 || ''}
                    regionCode={selectedRegion?.code}
                    onSelect={handleCitySelect}
                    selectedCity={city}
                    selectedTimezone={timezone}
                    disabled={isSubmitting || !selectedCountry}
                />
                {errors.city && (
                    <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">
                    Time Zone {isCustomCity && <span className="text-red-500">*</span>}
                </label>
                {isCustomCity ? (
                    <input
                        type="text"
                        value={manualTimezone || suggestedTimezone}
                        onChange={handleManualTimezoneChange}
                        placeholder="e.g., Europe/Warsaw, Europe/Kyiv"
                        disabled={isSubmitting}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />
                ) : (
                    <input
                        type="text"
                        value={timezone}
                        readOnly
                        placeholder="Automatically detected from city"
                        className="w-full p-1 border rounded text-[10px] bg-gray-30 text-gray-500 focus:outline-none"
                    />
                )}
                {isCustomCity && (
                    <p className="text-xs text-gray-500 mt-1">
                        Enter IANA timezone format (e.g., Europe/Warsaw, America/New_York)
                    </p>
                )}
                {!isCustomCity && !timezone && suggestedTimezone && (
                    <p className="text-xs text-gray-500 mt-1">
                        Suggested: {suggestedTimezone}
                    </p>
                )}
                {errors.timeZone && (
                    <p className="text-red-500 text-xs mt-1">{errors.timeZone}</p>
                )}
            </div>
        </div>
    );
}