// lib/utils/datePickerLocale.ts
import { registerLocale } from 'react-datepicker';
import { uk, ru, enUS } from 'date-fns/locale';

registerLocale('uk', uk);
registerLocale('ru', ru);
registerLocale('en', enUS);
registerLocale('en-US', enUS);
registerLocale('en-GB', enUS);

export const getMonthNames = (locale: string) => {
  if (locale === 'uk') {
    return [
      'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
      'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
    ];
  }
  if (locale === 'ru') {
    return [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
  }
  // English (default)
  return [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
};

export const getDayNames = (locale: string) => {
  if (locale === 'uk') {
    return ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  }
  if (locale === 'ru') {
    return ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  }
  // English (default)
  return ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
};

export const getTimeCaption = (locale: string) => {
  if (locale === 'uk') return 'Час';
  if (locale === 'ru') return 'Время';
  return 'Time';
};

export const getPlaceholderText = (mode: 'date' | 'time' | 'datetime', locale: string) => {
  const texts = {
    date: {
      uk: 'Виберіть дату',
      ru: 'Выберите дату',
      en: 'Select date'
    },
    time: {
      uk: 'Виберіть час',
      ru: 'Выберите время',
      en: 'Select time'
    },
    datetime: {
      uk: 'Виберіть дату та час',
      ru: 'Выберите дату и время',
      en: 'Select date and time'
    }
  };
  
  const lang = locale === 'uk' ? 'uk' : locale === 'ru' ? 'ru' : 'en';
  return texts[mode][lang];
};

// Функция для получения локали для react-datepicker
export const getDatePickerLocale = (locale: string) => {
  if (locale === 'uk') return uk;
  if (locale === 'ru') return ru;
  return enUS;
};