import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import './globals.css';
import { TopBar } from '@/components/TopBar';
import { Menu, X, Orbit, Globe } from 'lucide-react';

// Убираем импорт Inter из next/font/google
// const inter = Inter({ subsets: ['latin', 'cyrillic'] });

const locales = ['uk', 'ru'];

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {

  const messages = await getMessages();

  return (
    <html lang={params.locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <TopBar />
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
      </body>
    </html>
  );
}