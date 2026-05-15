import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // На время разработки и на Vercel preview — полный запрет
  if (!isProduction || isDevelopment) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }
  
  // Когда будете готовы к публикации — замените на это
  // return {
  //   rules: {
  //     userAgent: '*',
  //     allow: '/',
  //     disallow: ['/dashboard', '/private/'], // закрыть служебные страницы
  //   },
  //   sitemap: `${baseUrl}/sitemap.xml`,
  // };
  
  // Пока разработка — возвращаем пустые правила (защита)
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}