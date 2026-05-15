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
  staticPageGenerationTimeout: 120,
  
  // Добавляем HTTP-заголовки для защиты от индексации
  async headers() {
    // Проверяем, что это не production окружение
    // Для Vercel: process.env.VERCEL_ENV === 'production'
    // Для локальной разработки: process.env.NODE_ENV === 'development'
    const isProduction = process.env.NODE_ENV === 'production' 
      && process.env.VERCEL_ENV === 'production'; // если используете Vercel
    
    // Если НЕ production - добавляем защиту
    if (!isProduction) {
      return [
        {
          // Применяем ко всем страницам
          source: '/:path*',
          headers: [
            {
              key: 'X-Robots-Tag',
              value: 'noindex, nofollow',
            },
          ],
        },
      ];
    }
    
    // Для production возвращаем пустой массив (без дополнительных заголовков)
    return [];
  },
};

export default withNextIntl(nextConfig);