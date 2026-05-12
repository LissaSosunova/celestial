import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: process.env.NODE_ENV === 'production' ? ['your-domain.com'] : [],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
  staticPageGenerationTimeout: 120
};

export default withNextIntl(nextConfig);