import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ClientTopBar } from '@/components/ClientTopBar';
import { Orbit } from 'lucide-react';
import { routing } from '@/i18n/routing';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <ClientTopBar />
        {children}
        <footer className="px-12 py-8 border-t border-border-light flex justify-between items-center text-[10px] uppercase tracking-ultra text-text-light">
          <div className="flex gap-8">
            <span>Privacy / Ethics</span>
            <span>Support</span>
          </div>
          <div className="flex gap-2 items-center">
            <Orbit className="absolute top-[20] w-34 h-34 text-gold" />
            <span className='ml-10'>CELESTIAL SOUL © 2026</span>
          </div>
        </footer>
      </NextIntlClientProvider>
    </>
  );
}