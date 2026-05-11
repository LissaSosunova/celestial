import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Для версии 3.26.5 locale уже строка, не нужно await
  const messages = (await import(`../messages/${locale}.json`)).default;
  
  return {
    messages
  };
});