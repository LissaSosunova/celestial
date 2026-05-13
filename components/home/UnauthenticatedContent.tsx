import { useTranslations } from 'next-intl';
import OnboardingButton from '@/components/buttons/OnboardingButton';
import { PackagesList } from '@/components/PackagesList';
import { Topics } from '@/components/TopicsRight';

export function UnauthenticatedContent() {
  const t = useTranslations('Home');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-5">
      <div className="lg:col-span-8 space-y-12">
        <h1 className="text-2xl md: text-4xl lg:text-5xl font-light italic mb-8 leading-[1.1] tracking-tight text-dark font-serif">
          {t.rich('title', {
            br: () => <br />,
            soul: (chunks) => <span className="pl-12">{chunks}</span>
          })}
        </h1>
        <p className="md:text-md lg:text-xl text-gray-600 font-sans">{t('description')}</p>
        <div className="flex items-center gap-4 mt-12">
          <OnboardingButton />
        </div>
        <PackagesList />
      </div>
      <Topics />
    </div>
  );
}