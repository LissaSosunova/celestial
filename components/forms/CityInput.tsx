'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, Plus } from 'lucide-react';

interface City {
  name: string;
  name_native: string;
  timezone: string;
}

interface CityInputProps {
  countryCode: string;
  regionCode?: string;
  onSelect: (city: string, timezone: string, isCustom?: boolean) => void;
  selectedCity?: string;
  selectedTimezone?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function CityInput({ 
  countryCode, 
  regionCode, 
  onSelect, 
  selectedCity, 
  selectedTimezone,
  className = '',
  placeholder = 'Search or enter city...',
  disabled = false
}: CityInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(selectedCity || '');
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Сохраняем последний введенный текст для поиска
  const lastSearchTermRef = useRef<string>('');

  // Загрузка городов - НЕ зависит от searchTerm, а только от countryCode и regionCode
  useEffect(() => {
    if (!countryCode) {
      setCities([]);
      setFilteredCities([]);
      return;
    }
    
    setIsLoading(true);
    
    const loadCities = async () => {
      try {
        const url = new URL('/api/locations/cities', window.location.origin);
        url.searchParams.set('countryCode', countryCode);
        if (regionCode) url.searchParams.set('regionCode', regionCode);
        
        const response = await fetch(url);
        const data = await response.json();
        
        // Безопасная обработка данных
        let citiesData: City[] = [];
        if (Array.isArray(data)) {
          citiesData = data.map((item: any) => ({
            name: typeof item === 'string' ? item : (item.name || item.city || ''),
            name_native: typeof item === 'string' ? item : (item.name_native || item.nativeName || item.name || ''),
            timezone: typeof item === 'string' ? getTimezoneForCountry(countryCode) : (item.timezone || item.timeZone || getTimezoneForCountry(countryCode)),
          }));
        }
        
        setCities(citiesData);
      } catch (error) {
        console.error('Failed to load cities:', error);
        setCities([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCities();
  }, [countryCode, regionCode]); // Убрали searchTerm из зависимостей!

  // Фильтрация городов - происходит мгновенно на клиенте, без потери фокуса
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCities(cities.slice(0, 20));
      setIsCustomMode(false);
      return;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const filtered = cities.filter(city => 
      (city.name && city.name.toLowerCase().includes(searchLower)) ||
      (city.name_native && city.name_native.toLowerCase().includes(searchLower))
    );
    
    setFilteredCities(filtered.slice(0, 50));
    setIsCustomMode(filtered.length === 0 && searchTerm.length >= 2);
  }, [searchTerm, cities]);

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback((city: City) => {
    const cityName = city.name || '';
    const cityTimezone = city.timezone || getTimezoneForCountry(countryCode);
    setSearchTerm(cityName);
    onSelect(cityName, cityTimezone, false);
    setIsOpen(false);
    setIsCustomMode(false);
  }, [onSelect, countryCode]);

  const handleCustomCity = useCallback(() => {
    if (searchTerm.trim()) {
      const fallbackTimezone = getTimezoneForCountry(countryCode);
      onSelect(searchTerm.trim(), selectedTimezone || fallbackTimezone, true);
      setIsOpen(false);
      setIsCustomMode(false);
    }
  }, [searchTerm, onSelect, countryCode, selectedTimezone]);

  const handleClear = useCallback(() => {
    setSearchTerm('');
    onSelect('', '', false);
    setIsOpen(false);
    setIsCustomMode(false);
    inputRef.current?.focus();
  }, [onSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  }, []);

  // Обновляем searchTerm при изменении selectedCity извне
  useEffect(() => {
    if (selectedCity && selectedCity !== searchTerm) {
      setSearchTerm(selectedCity);
    }
  }, [selectedCity]);

  if (!countryCode) {
    return (
      <input
        type="text"
        disabled
        placeholder="Select country first"
        className={`w-full bg-gray-50 border border-gray-300 px-3 py-3 rounded-full text-sm text-gray-400 ${className}`}
      />
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/40" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={isLoading ? 'Loading cities...' : placeholder}
          disabled={disabled || isLoading}
          className={`w-full bg-white border border-gray-300 px-3 py-3 pl-12 pr-10 rounded-full focus:outline-none focus:ring-1 focus:ring-gold text-sm ${
            disabled || isLoading ? 'bg-gray-50 text-gray-400' : ''
          } ${className}`}
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-text/40" />
        )}
        {!isLoading && searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text/40 hover:text-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredCities.length > 0 && (
            <>
              {filteredCities.map((city, index) => (
                <button
                  key={`${city.name}-${index}`}
                  type="button"
                  onClick={() => handleSelect(city)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm flex items-center justify-between"
                >
                  <div className="flex-1">
                    <span>{city.name || 'Unknown'}</span>
                    {city.name_native && city.name_native !== city.name && (
                      <span className="text-xs text-gray-400 ml-2">({city.name_native})</span>
                    )}
                  </div>
                  {city.timezone && (
                    <span className="text-xs text-gray-400">{city.timezone.split('/').pop()}</span>
                  )}
                </button>
              ))}
            </>
          )}
          
          {isCustomMode && (
            <button
              type="button"
              onClick={handleCustomCity}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-t border-gray-100 flex items-center gap-2 text-blue-600"
            >
              <Plus className="w-4 h-4" />
              <span>Add "{searchTerm}" as custom city</span>
            </button>
          )}
          
          {filteredCities.length === 0 && !isCustomMode && searchTerm && (
            <div className="p-4 text-center text-sm text-gray-400">
              No cities found. Type at least 2 characters to add a custom city.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getTimezoneForCountry(countryCode: string): string {
  const timezones: Record<string, string> = {
    'UA': 'Europe/Kyiv',
    'BY': 'Europe/Minsk',
    'PL': 'Europe/Warsaw',
    'LT': 'Europe/Vilnius',
    'LV': 'Europe/Riga',
    'EE': 'Europe/Tallinn',
    'KZ': 'Asia/Almaty',
    'MD': 'Europe/Chisinau',
    'RU': 'Europe/Moscow',
    'DE': 'Europe/Berlin',
    'FR': 'Europe/Paris',
    'IT': 'Europe/Rome',
    'ES': 'Europe/Madrid',
    'GB': 'Europe/London',
    'US': 'America/New_York',
    'CA': 'America/Toronto',
    'AU': 'Australia/Sydney',
    'JP': 'Asia/Tokyo',
    'CN': 'Asia/Shanghai',
    'IN': 'Asia/Kolkata',
  };
  return timezones[countryCode] || 'Europe/London';
}