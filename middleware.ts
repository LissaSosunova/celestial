import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['uk', 'ru'],
  defaultLocale: 'uk',
  localePrefix: 'always'
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};