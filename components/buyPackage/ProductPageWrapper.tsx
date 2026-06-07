'use client';

import { useState } from 'react';
import { PackageFormContainer } from './PackageFormContainer';
import { PurchaseCompleted } from './PurchaseCompleted';
import type { Package } from '@/lib/types/package';
import { Topics } from '@/components/shared/TopicsRight';
import { PackagesListCutted } from '@/components/shared/PackagesCutted';
import { useTranslations } from 'next-intl';

interface ProductPageWrapperProps {
  packageItem: Package;
  locale: string;
}

export function ProductPageWrapper({ packageItem, locale }: ProductPageWrapperProps) {
  const [purchaseCompleted, setPurchaseCompleted] = useState(false);
  const [purchaseData, setPurchaseData] = useState<any>(null);
  const t = useTranslations('packages');

  const handlePurchaseComplete = (result: any) => {
    console.log(result)
    if (result.result === 'success') {
      setPurchaseCompleted(true);
      setPurchaseData(result);
      
      // Опционально: скролл к сообщению об успехе
      setTimeout(() => {
        const successElement = document.getElementById('purchase-success');
        successElement?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleResetPurchase = () => {
    setPurchaseCompleted(false);
    setPurchaseData(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-4">
          <h1 className="text-3xl font-bold mb-6">
            {t(`${packageItem.slug}.name`)}
          </h1>
          
          {!purchaseCompleted ? (
            <PackageFormContainer 
              packageItem={packageItem}
              onPurchaseComplete={handlePurchaseComplete}
            />
          ) : (
            <PurchaseCompleted 
              purchaseData={purchaseData} 
              onReset={handleResetPurchase}
              packageItem={packageItem}
            />
          )}
        </div>
        
        <div className="lg:col-span-4 space-y-4">
          <PackagesListCutted pkgSlug={packageItem.slug}/>
          <Topics />
        </div>
      </div>
    </>
  );
}