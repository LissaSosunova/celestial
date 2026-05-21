'use client';

import { forwardRef } from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', checked, onChange, id, ...props }, ref) => {
    return (
      <div className="flex items-start space-x-2">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={id}
            ref={ref}
            checked={checked}
            onChange={onChange}
            className="sr-only"
            {...props}
          />
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 cursor-pointer
              ${checked 
                ? 'bg-[#f79309] border-[#f79309]' 
                : 'bg-white border-gray-300 hover:border-[#f79309]/50'
              } ${className}`}
            onClick={() => onChange?.({ target: { checked: !checked } } as any)}
          >
            {checked && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        {label && (
          <label htmlFor={id} className="cursor-pointer text-sm text-gray-700 flex-1">
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';