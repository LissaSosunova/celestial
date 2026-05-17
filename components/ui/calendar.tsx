// components/ui/calendar.tsx
'use client';

import { useState } from 'react';
import { Button } from './button';

interface CalendarProps {
  mode?: 'single';
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
}

export function Calendar({ selected, onSelect, disabled, className = '' }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Добавляем пустые дни для начала месяца
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Добавляем дни месяца
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const changeMonth = (delta: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));
  };

  const isSelected = (date: Date) => {
    return selected && date.toDateString() === selected.toDateString();
  };

  const isDisabled = (date: Date) => {
    return disabled && disabled(date);
  };

  return (
    <div className={`p-3 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => changeMonth(-1)}
        >
          ←
        </Button>
        <span className="font-semibold">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => changeMonth(1)}
        >
          →
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => (
          <div key={index} className="aspect-square">
            {date && (
              <button
                type="button"
                onClick={() => onSelect?.(date)}
                disabled={isDisabled(date)}
                className={`w-full h-full rounded-md text-sm transition-colors
                  ${isSelected(date) 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'hover:bg-gray-100'
                  }
                  ${isDisabled(date) && 'opacity-50 cursor-not-allowed'}
                `}
              >
                {date.getDate()}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}