// components/forms/CountrySelect.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

interface Country {
  iso2: string;
  name: string;
  nativeName: string;
  emoji: string;
  hasRegions: boolean;
}

interface CountrySelectProps {
  onSelect: (country: Country) => void;
  selectedCountry?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;  // ← Добавлен пропс disabled
}

export function CountrySelect({ 
  onSelect, 
  selectedCountry, 
  className = '',
  placeholder = 'Select country',
  disabled = false  // ← Значение по умолчанию
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Загрузка стран
  useEffect(() => {
    const loadCountries = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/locations/countries');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setCountries(data);
          setFilteredCountries(data);
        } else {
          setCountries([]);
          setFilteredCountries([]);
        }
      } catch (error) {
        console.error('Failed to load countries:', error);
        setCountries([]);
        setFilteredCountries([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadCountries();
  }, []);

  // Фильтрация при изменении поиска
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCountries(countries);
      return;
    }
    
    const searchLower = searchTerm.toLowerCase();
    const filtered = countries.filter(country => {
      const name = country?.name || '';
      const nativeName = country?.nativeName || '';
      const iso2 = country?.iso2 || '';
      
      return name.toLowerCase().includes(searchLower) ||
             nativeName.toLowerCase().includes(searchLower) ||
             iso2.toLowerCase().includes(searchLower);
    });
    
    setFilteredCountries(filtered);
  }, [searchTerm, countries]);

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Фокус на поиск при открытии
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSelect = useCallback((country: Country) => {
    onSelect(country);
    setIsOpen(false);
    setSearchTerm('');
  }, [onSelect]);

  const handleClear = useCallback(() => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  }, []);

  const selected = countries.find(c => c?.iso2 === selectedCountry);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}  // ← Не открываем если disabled
        className={`w-full bg-white border border-gray-300 px-3 py-3 rounded-full text-left flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-gold ${
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
        } ${className}`}
        disabled={disabled || isLoading}
      >
        <span className="flex items-center gap-2">
          {selected ? (
            <>
              <span>{selected.emoji}</span>
              <span>{selected.name}</span>
              {selected.nativeName && selected.nativeName !== selected.name && (
                <span className="text-xs text-gray-400 ml-2">({selected.nativeName})</span>
              )}
            </>
          ) : (
            <span className="text-gray-400">
              {isLoading ? 'Loading...' : placeholder}
            </span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (  // ← Не показываем список если disabled
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="relative border-b border-gray-200">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 focus:outline-none text-sm"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="max-h-60 overflow-auto">
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-400">
                No countries found
              </div>
            ) : (
              filteredCountries.map((country, index) => (
                <button
                  key={country?.iso2 || `country-${index}`}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <span className="text-lg">{country?.emoji || '🌍'}</span>
                  <div className="flex-1">
                    <span className="text-sm">{country?.name || 'Unknown'}</span>
                    {country?.nativeName && country.nativeName !== country.name && (
                      <span className="text-xs text-gray-400 ml-2">
                        ({country.nativeName})
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{country?.iso2 || ''}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}