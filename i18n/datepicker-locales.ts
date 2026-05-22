import { registerLocale } from 'react-datepicker';
import { uk, ru } from 'date-fns/locale';


registerLocale('uk', uk);
registerLocale('ru', ru);

export const getMonthNames = (locale: string) => {
  if (locale === 'uk') {
    return [
      'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
      'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
    ];
  }
  return [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
};

export const getDayNames = (locale: string) => {
  if (locale === 'uk') {
    return ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  }
  return ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
};

export const getTimeCaption = (locale: string) => {
  return locale === 'uk' ? 'Час' : 'Время';
};

export const getPlaceholderText = (mode: 'date' | 'time' | 'datetime', locale: string) => {
  const texts = {
    date: locale === 'uk' ? 'Виберіть дату' : 'Выберите дату',
    time: locale === 'uk' ? 'Виберіть час' : 'Выберите время',
    datetime: locale === 'uk' ? 'Виберіть дату та час' : 'Выберите дату и время'
  };
  return texts[mode];
};