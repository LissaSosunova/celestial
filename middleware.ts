import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const nextIntlMiddleware = createMiddleware({
  locales: ['uk', 'ru'],
  defaultLocale: 'uk',
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  const response = nextIntlMiddleware(request);
  
  // Middleware только для next-intl
  // Cookies уже устанавливаются на клиенте через useUserProfile хук
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};