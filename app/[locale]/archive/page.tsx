import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Archive } from '@/components/Archive';

interface ArchivePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ArchivePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Archive' });
  
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function ArchivePage({ params }: ArchivePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Archive' });
  
  return (
    <div className="min-h-screen px-4 py-8 md:px-12 md:py-12 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">
          {t('title')}
        </h1>
        <p className="text-text-muted">
          {t('subtitle')}
        </p>
      </header>
      
      <Archive />
    </div>
  );
}