'use client';

import React from 'react';
import { PurchaseInfo } from '@/lib/types/package';

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
    { key: 'id', label: 'ID' },
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

  return (
    <div className="space-y-8">
      {packages.map((item, index) => (
        <div key={item.uuid || index} className="border rounded-lg p-6 bg-white shadow-sm">
          {showHeader && (
            <h3 className="text-xl font-bold mb-4">{item.name}</h3>
          )}
          <div className="grid grid-cols-2 gap-2">
            {fields.map((field) => (
              <React.Fragment key={field.key as string}>
                <div className="font-medium text-gray-700">
                  {field.label}:
                </div>
                <div className="text-gray-900">
                  {formatValue(item[field.key])}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PurchasedPackages;