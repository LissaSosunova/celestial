// components/ui/radio-group.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';

interface RadioGroupContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(undefined);

interface RadioGroupProps {
  children: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function RadioGroup({ children, value, onValueChange, className = '' }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value: value || '', onValueChange: onValueChange || (() => {}) }}>
      <div className={`space-y-3 ${className}`}>{children}</div>
    </RadioGroupContext.Provider>
  );
}

interface RadioGroupItemProps {
  value: string;
  id: string;
  className?: string;
  label?: string;
  description?: string;
}

export function RadioGroupItem({ value, id, className = '', label, description }: RadioGroupItemProps) {
  const context = useContext(RadioGroupContext);
  if (!context) throw new Error('RadioGroupItem must be used within RadioGroup');

  const isChecked = context.value === value;
  const accentColor = '#f79309';

  return (
    <label
      htmlFor={id}
      className={`flex items-start space-x-3 cursor-pointer group ${className}`}
    >
      <div className="relative flex items-center justify-center mt-0.5">
        <input
          type="radio"
          id={id}
          value={value}
          checked={isChecked}
          onChange={(e) => context.onValueChange(e.target.value)}
          className="sr-only" // Скрываем стандартный radio
        />
        {/* Кастомный radio button */}
        <div
          className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
            isChecked
              ? 'border-[#f79309] bg-[#f79309]'
              : 'border-gray-300 bg-white group-hover:border-[#f79309]/50'
          }`}
        >
          {isChecked && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1">
        {label && (
          <span className={`text-sm font-medium transition-colors ${
            isChecked ? 'text-[#f79309]' : 'text-gray-700 group-hover:text-[#f79309]/70'
          }`}>
            {label}
          </span>
        )}
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
}

// Альтернативная простая версия без label внутри
export function SimpleRadioGroupItem({ value, id, className = '' }: { value: string; id: string; className?: string }) {
  const context = useContext(RadioGroupContext);
  if (!context) throw new Error('RadioGroupItem must be used within RadioGroup');

  const isChecked = context.value === value;

  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={isChecked}
      onChange={(e) => context.onValueChange(e.target.value)}
      className={`appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-[#f79309] checked:bg-[#f79309] focus:outline-none focus:ring-2 focus:ring-[#f79309]/50 focus:ring-offset-1 transition-all duration-200 relative
        checked:after:content-[''] checked:after:block checked:after:w-2 checked:after:h-2 checked:after:rounded-full checked:after:bg-white checked:after:absolute checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2
        ${className}`}
    />
  );
}