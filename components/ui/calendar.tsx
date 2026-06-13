'use client';

import { forwardRef, useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocale } from 'next-intl';
import { getMonthNames, getTimeCaption, getPlaceholderText } from '@/i18n/datepicker-locales';
import { registerLocale } from 'react-datepicker';
import { uk, ru, enUS } from 'date-fns/locale';

// Регистрируем локали
registerLocale('uk', uk);
registerLocale('ru', ru);
registerLocale('en', enUS);
registerLocale('en-US', enUS);
registerLocale('en-GB', enUS);

interface CalendarProps {
  mode?: 'single' | 'time';
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  inputClassName?: string;
  placeholderText?: string;
  showTimeSelect?: boolean;
  showTimeSelectOnly?: boolean;
  timeIntervals?: number;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  roundedFull?: boolean;
  popperClassName?: string;
}

// Кастомный header для выбора года и месяца
const CustomHeader = ({
  date,
  changeYear,
  changeMonth,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
  locale,
}: any) => {
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  
  const years = Array.from({ length: 150 }, (_, i) => 1900 + i);
  const months = getMonthNames(locale);

  return (
    <div className="flex items-center justify-between p-3 bg-white border-b rounded-t-lg">
      <button
        type="button"
        onClick={decreaseMonth}
        disabled={prevMonthButtonDisabled}
        className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 transition-colors"
      >
        ←
      </button>
      
      <div className="flex gap-2">
        <select
          value={currentYear}
          onChange={({ target: { value } }) => changeYear(parseInt(value))}
          className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f79309]"
        >
          {years.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={currentMonth}
          onChange={({ target: { value } }) => changeMonth(parseInt(value))}
          className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f79309]"
        >
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>
      </div>
      
      <button
        type="button"
        onClick={increaseMonth}
        disabled={nextMonthButtonDisabled}
        className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 transition-colors"
      >
        →
      </button>
    </div>
  );
};

// Функция валидации даты
const validateDate = (day: string, month: string, year: string): boolean => {
  const dayNum = parseInt(day);
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);
  
  if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) return false;
  
  if (yearNum < 1900 || yearNum > new Date().getFullYear() + 10) return false;
  if (monthNum < 1 || monthNum > 12) return false;
  
  const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
  if (dayNum < 1 || dayNum > daysInMonth) return false;
  
  return true;
};

// Функция форматирования даты в строку
const formatDateToString = (date: Date | undefined, locale: string): string => {
  if (!date) return '';
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  // Для английского используем формат YYYY-MM-DD, для других ДД.ММ.ГГГГ
  if (locale === 'en' || locale === 'en-US' || locale === 'en-GB') {
    return `${year}-${month}-${day}`;
  }
  return `${day}.${month}.${year}`;
};

// Функция парсинга даты из строки
const parseDateFromString = (value: string, locale: string): Date | null => {
  let day: number, month: number, year: number;
  
  if (locale === 'en' || locale === 'en-US' || locale === 'en-GB') {
    // Формат YYYY-MM-DD
    const parts = value.split('-');
    if (parts.length !== 3) return null;
    year = parseInt(parts[0]);
    month = parseInt(parts[1]);
    day = parseInt(parts[2]);
  } else {
    // Формат ДД.ММ.ГГГГ
    const parts = value.split('.');
    if (parts.length !== 3) return null;
    day = parseInt(parts[0]);
    month = parseInt(parts[1]);
    year = parseInt(parts[2]);
  }
  
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (year < 1900 || year > new Date().getFullYear() + 10) return null;
  if (month < 1 || month > 12) return null;
  
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return null;
  
  return new Date(year, month - 1, day);
};

// Функция форматирования времени в строку
const formatTimeToString = (date: Date | undefined): string => {
  if (!date) return '';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Кастомный input для ДАТЫ с маской
const DateInput = forwardRef<HTMLInputElement, any>(({ 
  value, 
  onClick, 
  onChange,
  placeholder, 
  className, 
  roundedFull,
  selectedDate,
  onDateChange,
  locale
}, ref) => {
  const [inputValue, setInputValue] = useState('');
  const isInternalChange = useRef(false);
  const isEnglish = locale === 'en' || locale === 'en-US' || locale === 'en-GB';

  useEffect(() => {
    if (!isInternalChange.current) {
      const formattedDate = formatDateToString(selectedDate, locale);
      setInputValue(formattedDate);
    }
    isInternalChange.current = false;
  }, [selectedDate, locale]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value;
    
    if (isEnglish) {
      // Английский формат YYYY-MM-DD
      let maskedValue = rawValue.replace(/[^0-9]/g, '');
      if (maskedValue.length > 4) {
        maskedValue = maskedValue.slice(0, 4) + '-' + maskedValue.slice(4);
      }
      if (maskedValue.length > 7) {
        maskedValue = maskedValue.slice(0, 7) + '-' + maskedValue.slice(7);
      }
      maskedValue = maskedValue.slice(0, 10);
      setInputValue(maskedValue);
      isInternalChange.current = true;
      
      if (maskedValue.length === 10) {
        const date = parseDateFromString(maskedValue, locale);
        if (date) {
          onDateChange?.(date);
          onChange?.(date);
        }
      }
    } else {
      // Украинский/русский формат ДД.ММ.ГГГГ
      const numbers = rawValue.replace(/\D/g, '');
      const limitedNumbers = numbers.slice(0, 8);
      
      let maskedValue = '';
      for (let i = 0; i < limitedNumbers.length; i++) {
        if (i === 2 || i === 4) {
          maskedValue += '.';
        }
        maskedValue += limitedNumbers[i];
      }
      
      setInputValue(maskedValue);
      isInternalChange.current = true;
      
      if (maskedValue.length === 10) {
        const [day, month, year] = maskedValue.split('.');
        if (validateDate(day, month, year)) {
          const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          if (!isNaN(date.getTime())) {
            onDateChange?.(date);
            onChange?.(date);
          }
        }
      } else if (maskedValue.length < 10 && inputValue.length > maskedValue.length) {
        onDateChange?.(null);
        onChange?.(null);
      }
    }
  };

  const handleBlur = () => {
    const expectedLength = isEnglish ? 10 : 10;
    if (inputValue.length !== expectedLength) {
      setInputValue('');
      onDateChange?.(null);
      onChange?.(null);
    } else if (!isEnglish) {
      const [day, month, year] = inputValue.split('.');
      if (!validateDate(day, month, year)) {
        setInputValue('');
        onDateChange?.(null);
        onChange?.(null);
      }
    }
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return isEnglish ? 'YYYY-MM-DD' : 'ДД.ММ.ГГГГ';
  };

  return (
    <input
      ref={ref}
      type="text"
      value={inputValue}
      onClick={onClick}
      onChange={handleInputChange}
      onBlur={handleBlur}
      placeholder={getPlaceholder()}
      className={`w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f79309] focus:border-transparent ${
        roundedFull ? 'rounded-full px-3 py-3 text-sm' : 'rounded-md'
      } ${className}`}
    />
  );
});

// Кастомный input для ВРЕМЕНИ
const TimeInput = forwardRef<HTMLInputElement, any>(({ 
  value, 
  onClick, 
  onChange,
  placeholder, 
  className, 
  roundedFull,
  selectedDate,
  onDateChange
}, ref) => {
  const [inputValue, setInputValue] = useState('');
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (!isInternalChange.current) {
      const formattedTime = formatTimeToString(selectedDate);
      setInputValue(formattedTime);
    }
    isInternalChange.current = false;
  }, [selectedDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value;
    const numbers = rawValue.replace(/\D/g, '');
    const limitedNumbers = numbers.slice(0, 4);
    
    let maskedValue = '';
    for (let i = 0; i < limitedNumbers.length; i++) {
      if (i === 2) {
        maskedValue += ':';
      }
      maskedValue += limitedNumbers[i];
    }
    
    let isValid = false;
    if (maskedValue.length === 5) {
      const [hours, minutes] = maskedValue.split(':');
      const hoursNum = parseInt(hours);
      const minutesNum = parseInt(minutes);
      
      if (hoursNum >= 0 && hoursNum <= 23 && minutesNum >= 0 && minutesNum <= 59) {
        isValid = true;
        const date = selectedDate || new Date();
        date.setHours(hoursNum, minutesNum);
        onDateChange?.(date);
        onChange?.(date);
      }
    }
    
    setInputValue(maskedValue);
    isInternalChange.current = true;
    
    if (!isValid && maskedValue.length === 5) {
      setTimeout(() => {
        const input = document.querySelector('.time-input-error');
        if (input) input.classList.add('border-red-500');
        setTimeout(() => input?.classList.remove('border-red-500'), 1000);
      }, 0);
    }
  };

  const handleBlur = () => {
    if (inputValue.length !== 5) {
      setInputValue('');
      onDateChange?.(null);
      onChange?.(null);
    } else {
      const [hours, minutes] = inputValue.split(':');
      const hoursNum = parseInt(hours);
      const minutesNum = parseInt(minutes);
      
      if (hoursNum >= 0 && hoursNum <= 23 && minutesNum >= 0 && minutesNum <= 59) {
        // Валидное время
      } else {
        setInputValue('');
        onDateChange?.(null);
        onChange?.(null);
      }
    }
  };

  const getPlaceholder = () => {
    return placeholder || 'HH:MM';
  };

  return (
    <input
      ref={ref}
      type="text"
      value={inputValue}
      onClick={onClick}
      onChange={handleInputChange}
      onBlur={handleBlur}
      placeholder={getPlaceholder()}
      className={`w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#f79309] focus:border-transparent ${
        roundedFull ? 'rounded-full px-3 py-3 text-sm' : 'rounded-md'
      } ${className}`}
    />
  );
});

DateInput.displayName = 'DateInput';
TimeInput.displayName = 'TimeInput';

export function Calendar({
  mode = 'single',
  selected,
  onSelect,
  disabled,
  className = '',
  inputClassName = '',
  placeholderText,
  showTimeSelect = false,
  showTimeSelectOnly = false,
  timeIntervals = 30,
  dateFormat,
  minDate,
  maxDate,
  roundedFull = true,
  popperClassName = '',
}: CalendarProps) {
  const locale = useLocale();
  // Определяем язык для календаря
  let currentLocale = 'ru';
  if (locale === 'uk') currentLocale = 'uk';
  else if (locale === 'ru') currentLocale = 'ru';
  else currentLocale = 'en';
  
  const [internalDate, setInternalDate] = useState<Date | undefined>(selected);

  useEffect(() => {
    setInternalDate(selected);
  }, [selected]);

  const getDateFormat = () => {
    if (dateFormat) return dateFormat;
    if (showTimeSelectOnly) return 'HH:mm';
    if (showTimeSelect) {
      return currentLocale === 'en' ? 'yyyy-MM-dd HH:mm' : 'dd.MM.yyyy HH:mm';
    }
    return currentLocale === 'en' ? 'yyyy-MM-dd' : 'dd.MM.yyyy';
  };

  const getDefaultPlaceholder = () => {
    if (placeholderText) return placeholderText;
    if (showTimeSelectOnly) return getPlaceholderText('time', currentLocale);
    if (showTimeSelect) return getPlaceholderText('datetime', currentLocale);
    return getPlaceholderText('date', currentLocale);
  };

  const filterDate = (date: Date) => {
    if (disabled) return !disabled(date);
    return true;
  };

  const handleDateChange = (date: Date | null) => {
    setInternalDate(date || undefined);
    onSelect?.(date || undefined);
  };

  // Выбираем правильный кастомный input
  const getCustomInput = () => {
    if (showTimeSelectOnly) {
      return <TimeInput 
        className={inputClassName} 
        roundedFull={roundedFull}
        selectedDate={internalDate}
        onDateChange={handleDateChange}
      />;
    }
    return <DateInput 
      className={inputClassName} 
      roundedFull={roundedFull}
      selectedDate={internalDate}
      onDateChange={handleDateChange}
      locale={currentLocale}
    />;
  };

  const datePickerProps = {
    selected: internalDate,
    onChange: handleDateChange,
    dateFormat: getDateFormat(),
    placeholderText: getDefaultPlaceholder(),
    locale: currentLocale,
    popperClassName: `react-datepicker-popper z-[9999] ${popperClassName}`,
    popperPlacement: 'bottom-start' as const,
    customInput: getCustomInput(),
  };

  // Для выбора только времени
  if (showTimeSelectOnly) {
    return (
      <DatePicker
        {...datePickerProps}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={timeIntervals}
        timeCaption={getTimeCaption(currentLocale)}
      />
    );
  }

  // Для выбора даты с возможностью времени
  return (
    <DatePicker
      {...datePickerProps}
      showTimeSelect={showTimeSelect}
      timeIntervals={timeIntervals}
      timeCaption={getTimeCaption(currentLocale)}
      renderCustomHeader={(props) => <CustomHeader {...props} locale={currentLocale} />}
      filterDate={filterDate}
      minDate={minDate}
      maxDate={maxDate}
    />
  );
}