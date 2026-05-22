// app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ClientTopBar } from '@/components/ClientTopBar';
import { ClientFooter } from '@/components/ClientFooter';
import { routing } from '@/i18n/routing';
import { UserProfileProvider } from '@/lib/contexts/UserProfileProvider';

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