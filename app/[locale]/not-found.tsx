import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function NotFoundPage() {
  const t = useTranslations('NotFound');
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-6xl font-bold text-gold mb-4">404</h1>
      <h2 className="text-2xl font-serif mb-4">{t('title') || 'Page Not Found'}</h2>
      <p className="text-text-muted mb-8">
        {t('description') || 'The page you are looking for does not exist.'}
      </p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-gold text-white rounded-full hover:bg-gold/90 transition-colors"
      >
        {t('button') || 'Return Home'}
      </Link>
    </div>
  );
}