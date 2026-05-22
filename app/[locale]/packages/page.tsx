import { Metadata } from 'next';
import { PackagesList } from '@/components/shared/PackagesList';
import { getTranslations } from 'next-intl/server';

interface PackagesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PackagesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'packages' });
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function PackagesPage({ params }: PackagesPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'packages' });
  
  return (
    <div className="min-h-screen px-4 py-8 md:px-12 md:py-12 max-w-7xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">
          {t('title')}
        </h1>
        <p className="text-text-muted max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </header>
      
      <PackagesList />
    </div>
  );
}