// components/shared/PurchasedPackages.tsx
'use client';

import React from 'react';
import { PurchaseInfo, SynastryPurchaseInfo } from '@/lib/types/package';
import { PurchesIcon } from '@/components/shared/PurchesIcon';
import { ZodiacHeader } from '@/components/shared/ZodiacHeader';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

interface PurchasedPackagesProps {
  packages: PurchaseInfo[];
  emptyMessage?: string;
  fields?: Array<{ key: keyof PurchaseInfo; label: string }>;
  showHeader?: boolean;
}

const PurchasedPackages: React.FC<PurchasedPackagesProps> = ({
  packages,
  emptyMessage = 'No purchased packages yet',
  fields = [
    { key: 'slug', label: 'Slag' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'price', label: 'Price' },
    { key: 'isFreePart', label: 'Free Part' },
    { key: 'type', label: 'Type' },
    { key: 'icon', label: 'Icon' },
    { key: 'dateOfPurchase', label: 'Purchase Date' },
    { key: 'birthDate', label: 'Birth Date' }
  ],
  showHeader = true
}) => {
  const formatValue = (value: any): string => {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value === null) return '—';
    if (typeof value === 'number') return `₴${value}`;
    return String(value);
  };

  // Функция для получения даты для ZodiacHeader
  const getBirthDateForPackage = (item: PurchaseInfo): Date | null => {
    // Для synastry пакетов используем дату первой персоны
    if (item.type === 'synastry') {
      const synastryItem = item as SynastryPurchaseInfo;
      if (synastryItem.firstPerson?.birthDate) {
        return new Date(synastryItem.firstPerson.birthDate);
      }
      return null;
    }
    
    // Для остальных пакетов используем birthDate
    if (item.birthDate) {
      return new Date(item.birthDate);
    }
    
    return null;
  };

  // Функция для получения отображаемой даты
  const getDisplayBirthDate = (item: PurchaseInfo): string => {
    // Для synastry пакетов показываем даты обеих персон
    if (item.type === 'synastry') {
      const synastryItem = item as SynastryPurchaseInfo;
      const firstDate = synastryItem.firstPerson?.birthDate || '—';
      const secondDate = synastryItem.secondPerson?.birthDate || '—';
      return `${firstDate} / ${secondDate}`;
    }
    
    // Для остальных пакетов показываем birthDate
    return item.birthDate ? String(item.birthDate) : '—';
  };

  if (!packages || packages.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }
  
  const t = useTranslations('Dashboard');
  const handleResult = () => {
    // Обработчик результата
  };

  // Функция для проверки, нужно ли показывать ZodiacHeader
  const shouldShowZodiacHeader = (item: PurchaseInfo): boolean => {
    if (item.type === 'synastry') return false;
    return !!item.birthDate;
  };

  return (
    <>
      {packages.map((item, index) => {
        const birthDate = getBirthDateForPackage(item);
        
        return (
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            onClick={handleResult}
            key={item.uuid || index}
            className="transition-all cursor-pointer group flex flex-col"
          >
            {/* Показываем ZodiacHeader только для не-synastry пакетов с датой */}
            {shouldShowZodiacHeader(item) && birthDate && (
              <ZodiacHeader
                date={birthDate}
                size="small"
                t={t}
              />
            )}
            
            {/* Для synastry пакетов показываем заглушку */}
            {item.type === 'synastry' && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-t-lg">
                <p className="text-xs uppercase tracking-ultra font-bold text-gold">
                  {t('Synastry Chart')}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {t('Compatibility between two persons')}
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-1 px-4 py-4 border-x-2 shadow-sm bg-white">
              {fields.map((field) => {
                // Пропускаем поле birthDate для synastry, так как мы его обрабатываем отдельно
                if (field.key === 'birthDate' && item.type === 'synastry') {
                  return (
                    <React.Fragment key={field.key as string}>
                      <div className="flex items-center gap-1 tracking-ultra text-[10px] uppercase text-gray-700">
                        <PurchesIcon name={field.key as string} /> {field.label}:
                      </div>
                      <div className="text-xs text-gray-900">
                        {getDisplayBirthDate(item)}
                      </div>
                    </React.Fragment>
                  );
                }
                
                // Для обычных пакетов показываем как обычно
                let value = item[field.key];
                
                // Для synastry показываем имена персон вместо description
                if (item.type === 'synastry' && field.key === 'description') {
                  const synastryItem = item as SynastryPurchaseInfo;
                  value = `${synastryItem.firstPerson?.name || '—'} & ${synastryItem.secondPerson?.name || '—'}`;
                }
                
                return (
                  <React.Fragment key={field.key as string}>
                    <div className="flex items-center gap-1 tracking-ultra text-[10px] uppercase text-gray-700">
                      <PurchesIcon name={field.key as string} /> {field.label}:
                    </div>
                    <div className="text-xs text-gray-900">
                      {formatValue(value)}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
            
            <button
              onClick={handleResult}
              className="w-full p-4 rounded-[20px] md:rounded-[40px] md:p-2 md:rounded-t-none 
              border border-border rounded-t-none text-[10px] uppercase tracking-ultra 
              font-extrabold bg-secondary text-gold group-hover:bg-gold group-hover:text-white transition-all"
            >
              {t('watch result')}
            </button>
          </motion.div>
        );
      })}
    </>
  );
};

export default PurchasedPackages;