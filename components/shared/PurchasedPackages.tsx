'use client';

import React from 'react';
import { PurchaseInfo } from '@/lib/types/package';
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
    { key: 'slag', label: 'Slag' },
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
    if (typeof value === 'number') return `$${value}`;
    return String(value);
  };

  if (!packages || packages.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }
  const t = useTranslations('Dashboard');
  const handleResult = (() => {

  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {packages.map((item, index) => (
        <motion.div
          whileHover={{ y: -6, scale: 1.01 }}
          onClick={handleResult}
          key={item.uuid || index}
          className="transition-all cursor-pointer group flex flex-col"
        >
          <ZodiacHeader
            date={new Date(item.birthDate)}
            size="small"
            t={t}
          />
          <div className="grid grid-cols-2 gap-1 px-6 pt-6 border-x-2 shadow-sm bg-white shadow-sm">
            {fields.map((field) => (
              <React.Fragment key={field.key as string}>
                <div className="flex items-center gap-1 tracking-ultra text-[10px] uppercase text-gray-700">
                  <PurchesIcon name={field.key as string} /> {field.label}:
                </div>
                <div className="text-md  text-gray-900">
                  {formatValue(item[field.key])}
                </div>
              </React.Fragment>
            ))}
          </div>
          <button
            onClick={handleResult}
            className="w-full p-4 rounded-[20px] md:rounded-[40px] md:p-6 md:rounded-t-none 
            border border-border rounded-t-none text-[10px] uppercase tracking-ultra 
            font-extrabold bg-secondary text-gold group-hover:bg-gold group-hover:text-white transition-all"
          >
            watch result
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default PurchasedPackages;