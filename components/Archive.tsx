'use client';

import { type UserProfile } from '@/lib/types/userProfile';
import { ZodiacCardComponent } from './shared/zodiacCard';
import { useTranslations } from 'next-intl';
import { Topics } from '@/components/shared/TopicsRight';
import { PackagesList } from '@/components/shared/PackagesList';
import { BOUGHTPACKAGES } from '@/lib/types/package';
import PurchasedPackages from '@/components/shared/PurchasedPackages';


export function Archive() {

    const t = useTranslations('Dashboard');

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex flex-col px-4 py-4 md:px-12 md:py-12 max-w-7xl mx-auto w-full gap-6">
                <PurchasedPackages
                    packages={BOUGHTPACKAGES}
                    emptyMessage="You don't have any purchased packages yet"
                    fields={[
                        { key: 'slug', label: 'Package Name' },
                        { key: 'birthDate', label: 'Birth Date' },
                        { key: 'dateOfPurchase', label: 'Purchased On' },
                        { key: 'price', label: 'Price' },
                        { key: 'description', label: 'Description' }
                    ]}
                    showHeader={false}
                />
            </main>
        </div>
    );
}