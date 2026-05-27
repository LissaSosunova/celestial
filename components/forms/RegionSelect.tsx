// components/forms/RegionSelect.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { getRegionLabel } from '@/lib/utils/regionLabels';

export interface Region {
  code: string;
  name: string;
  countryCode: string;
}

interface RegionSelectProps {
  countryCode: string;
  onSelect: (region: Region | null) => void;
  selectedRegion?: string;
  className?: string;
  disabled?: boolean;
}

export function RegionSelect({ 
  countryCode, 
  onSelect, 
  selectedRegion,
  className = '',
  disabled = false 
}: RegionSelectProps) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!countryCode) {
      setRegions([]);
      return;
    }

    setIsLoading(true);
    
    fetch(`/api/locations/regions?countryCode=${countryCode}`)
      .then(res => res.json())
      .then(data => {
        setRegions(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Failed to load regions:', error);
        setIsLoading(false);
      });
  }, [countryCode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!countryCode) return null;
  if (isLoading) return <div className="animate-pulse h-10 bg-gray-200 rounded-full"></div>;
  if (regions.length === 0) return null;

  const selected = regions.find(r => r.code === selectedRegion);
  const regionLabel = getRegionLabel(countryCode);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)} 
        className={`w-full bg-white border border-gray-300 px-3 py-3 rounded-full text-left flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-gold ${
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
        } ${className}`}
        disabled={disabled}
      >
        <span className={!selected ? 'text-gray-400' : ''}>
          {selected ? selected.name : `Select ${regionLabel}`}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {regions.map(region => (
            <button
              key={region.code}
              type="button"
              onClick={() => {
                onSelect(region);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
            >
              {region.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}