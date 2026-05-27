export function getTimezoneForCountry(countryCode: string): string {
  const timezones: Record<string, string> = {
    // Восточная Европа
    'UA': 'Europe/Kyiv',
    'BY': 'Europe/Minsk',
    'PL': 'Europe/Warsaw',
    'LT': 'Europe/Vilnius',
    'LV': 'Europe/Riga',
    'EE': 'Europe/Tallinn',
    'MD': 'Europe/Chisinau',
    'KZ': 'Asia/Almaty',
    'RU': 'Europe/Moscow',
    
    // Западная Европа
    'DE': 'Europe/Berlin',
    'FR': 'Europe/Paris',
    'IT': 'Europe/Rome',
    'ES': 'Europe/Madrid',
    'GB': 'Europe/London',
    'NL': 'Europe/Amsterdam',
    'BE': 'Europe/Brussels',
    'CH': 'Europe/Zurich',
    'AT': 'Europe/Vienna',
    'SE': 'Europe/Stockholm',
    'NO': 'Europe/Oslo',
    'DK': 'Europe/Copenhagen',
    'FI': 'Europe/Helsinki',
    
    // Северная Америка
    'US': 'America/New_York',
    'CA': 'America/Toronto',
    'MX': 'America/Mexico_City',
    
    // Азия
    'JP': 'Asia/Tokyo',
    'CN': 'Asia/Shanghai',
    'IN': 'Asia/Kolkata',
    'KR': 'Asia/Seoul',
    'TR': 'Europe/Istanbul',
    
    // Остальные
    'AU': 'Australia/Sydney',
    'BR': 'America/Sao_Paulo',
    'ZA': 'Africa/Johannesburg',
  };
  
  return timezones[countryCode] || 'UTC';
}