'use client';

import { type UserProfile } from '@/lib/types/types';
import { ZodiacCardComponent } from './ui/zodiacCard';
import { useTranslations } from 'next-intl';
import { Topics } from '@/components/TopicsRight';
import { PackagesList } from '@/components/PackagesList';
import { BOUGHTPACKAGES } from '@/lib/types/package';

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
      <main className="flex-1 px-12 py-12 max-w-7xl mx-auto w-full">
        <header className="mb-16">
          <h1 className="text-2xl md:text-5xl font-serif font-light italic text-dark">
            Welcome back, {profile.name}
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <div className="bg-secondary p-10 rounded-[40px] relative overflow-hidden group border border-transparent">
              <p className="text-lg text-text-muted leading-relaxed italic max-w-2xl font-serif">
                {t('title')}
              </p>
            </div>
            <div className="lg:col-span-8 space-y-12">
              <h2 className="text-sm uppercase tracking-ultra text-gold m5-3 font-bold">{t('yourNatals')}</h2>
              {/* <div>
                {BOUGHTPACKAGES.map((pkg, idx) => (
                  <div> {pkg.id}</div>
                ))}
              </div> */}
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
                emojiColor="#FFD700"
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