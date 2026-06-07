'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface PurchaseCompletedProps {
    purchaseData: any;
    onReset?: () => void;
    packageItem: any;
}

export function PurchaseCompleted({ purchaseData, onReset, packageItem }: PurchaseCompletedProps) {
    const router = useRouter();
    const t = useTranslations('packages');

    return (
        <div
            id="purchase-success"
            className="bg-white border border-border-light p-4 lg:p-10 md:p-8 rounded-[20px] md:rounded-[40px] shadow-sm"
        >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">
                {t('purchaseCompleted')}
            </h2>
            <p className=" mb-4">
                {t('thankYouForPurchase')}
            </p>
            {purchaseData?.orderId && (
                <p className="text-sm text-gray-600 mb-4">
                    {t('orderId')}: {purchaseData.orderId}
                </p>
            )}
            <div className="space-x-4 text-[12px]">
                {t('Watch result on your')}
                <Link
                    href={'/dashboard'}
                    className="px-3 py-2 text-[10px] uppercase cursor-pointer hover:bg-secondary rounded-xl transition-all font-bold"
                  >
                    {t('goToDashboard')}
                  </Link>
                <br />
                <Button
                    onClick={() => router.push('/packages')}
                    className="mt-10 w-full p-4 md:p-6 border border-border rounded-full text-[10px] uppercase tracking-ultra font-extrabold bg-secondary transition-all"
                >
                    {t('buyAnotherPackage')}
                </Button>
            </div>
        </div>
    );
}