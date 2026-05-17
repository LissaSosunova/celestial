'use client';

import { createContext, useContext, ReactNode } from 'react';

interface RadioGroupContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(undefined);

export function RadioGroup({ children, value, onValueChange }: { children: ReactNode; value?: string; onValueChange?: (value: string) => void }) {
  return (
    <RadioGroupContext.Provider value={{ value: value || '', onValueChange: onValueChange || (() => {}) }}>
      <div className="space-y-2">{children}</div>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem({ value, id, className = '' }: { value: string; id: string; className?: string }) {
  const context = useContext(RadioGroupContext);
  if (!context) throw new Error('RadioGroupItem must be used within RadioGroup');

  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={context.value === value}
      onChange={(e) => context.onValueChange(e.target.value)}
      className={`h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
    />
  );
}