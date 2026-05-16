'use client';

import { type UserProfile } from '@/lib/types/userProfile';
import { ZodiacCardComponent } from './ui/zodiacCard';
import { useTranslations } from 'next-intl';
import { Topics } from '@/components/TopicsRight';
import { PackagesList } from '@/components/PackagesList';
import { BOUGHTPACKAGES } from '@/lib/types/package';
import PurchasedPackages from '@/components/ui/PurchasedPackages';

interface DashboardProps {
  onNavigate: (view: string) => void;
  profile: UserProfile;
}

export function Dashboard({ profile, onNavigate }: DashboardProps) {
  const birthday = new Date(profile.birthDate);
  const t = useTranslations('Dashboard');

  const packs = BOUGHTPACKAGES;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-4 py-4 md:px-12 md:py-12 max-w-7xl mx-auto w-full">
        <header className="mb-2">
          <h1 className="text-2xl md:text-3xl lg:text-4xl mb-2 leading-[1.1] tracking-tight text-dark  font-light">
            Welcome back, {profile.name}
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-2">
            <div className="bg-secondary p-2 md:p-6 rounded-[10px] md:rounded-[20px] relative overflow-hidden group border border-transparent">
              <p className="tracking-ultra pl-10 text-[10px] uppercase font-extrabold text-text-muted">
                {t('title')}
              </p>
            </div>
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-sm uppercase tracking-ultra text-gold m5-3 font-bold">{t('yourNatals')}</h2>
              <PurchasedPackages
                  packages={BOUGHTPACKAGES}
                  emptyMessage="You don't have any purchased packages yet"
                  fields={[
                    { key: 'slag', label: 'Package Name' },
                    { key: 'price', label: 'Price' },
                    { key: 'dateOfPurchase', label: 'Purchased On' },
                    { key: 'birthDate', label: 'Birth Date' }
                  ]}
                  showHeader={false}
                />
            </div>
            <div className="lg:col-span-8 space-y-12">
              <h2 className="text-sm uppercase tracking-ultra text-gold m5-3 font-bold">{t('getPack')}</h2>
              <PackagesList />
            </div>
          </div>
          {/* Right side */}
          <div className="lg:col-span-4">
            <h2 className="text-sm uppercase tracking-ultra text-gold mb-3 font-bold">{t('yourZodiacSign')}</h2>
            <div className="mb-4">
              <ZodiacCardComponent
                date={birthday}
                size="medium"
                t={t}
              />
            </div>
            <h2 className="text-sm uppercase tracking-ultra text-gold mb-3 font-bold">{t('toRead')}</h2>
            <Topics />
          </div>
        </div>
      </main>
    </div>
  );
}