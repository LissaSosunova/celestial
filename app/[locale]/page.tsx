import { useTranslations } from 'next-intl';
import { Topics } from '@/components/TopicsRight';
import OnboardingButton from '@/components/buttons/OnboardingButton';
import { PackagesList } from '@/components/PackagesList';

export default function HomePage() {
  const t = useTranslations('Home');

  return (
    <main className="min-h-screen p-8">
      <div className="flex-1 px-12 py-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-5">
          <div className="lg:col-span-8 space-y-12">
            <h1 className="text-5xl lg:text-7xl font-light italic mb-8 leading-[1.1] tracking-tight text-dark font-serif">
              {t.rich('title', {
                br: () => <br />,
                soul: (chunks) => <span className="pl-12">{chunks}</span>
              })}
            </h1>
            <p className="text-xl text-gray-600 font-sans">{t('description')}</p>
            <div className="flex items-center gap-4 mt-12">
              <OnboardingButton />
            </div>
          </div>
          <Topics />
        </div>
        
        <PackagesList />
      </div>
    </main>
  );
}