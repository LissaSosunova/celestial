import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ClientTopBar } from '@/components/ClientTopBar';
import { ClientFooter } from '@/components/ClientFooter';
import { routing } from '@/i18n/routing';
import { UserProfileProvider } from '@/lib/contexts/UserProfileProvider';
import type { Metadata } from 'next';

// Метаданные для всего приложения
export const metadata: Metadata = {
  title: {
    template: '%s | Celestial Soul',
    default: 'Celestial Soul - Astrology Platform',
  },
  description: 'Discover your cosmic path with personalized astrological readings. Get detailed natal charts, forecasts, and personalized insights based on your unique birth data.',
  keywords: ['natal chart of child', 'psychological support', 'astrology', 'natal chart', 'horoscope', 'forecast', 'celestial', 'zodiac'],
  authors: [{ name: 'Celestial Soul' }],
  creator: 'Celestial Soul',
  publisher: 'Celestial Soul',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
    shortcut: ['/favicon.svg'],
    apple: [
      { url: '/apple-touch.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#f79309', // ваш золотой цвет
      },
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#f79309',
  colorScheme: 'light',
  category: 'astrology',
};

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
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <UserProfileProvider>
            <ClientTopBar />
            {children}
            <ClientFooter />
          </UserProfileProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}