import csc from 'countrycitystatejson';

/**
 * Безопасное получение страны по коду
 */
export function getCountrySafe(isoCode: string) {
    if (!isoCode) return null;
    const country = csc.getCountryByShort(isoCode);
    if (!country) console.warn(`Country not found: ${isoCode}`);
    return country;
}

/**
 * Проверка наличия регионов
 */
export function countryHasRegions(isoCode: string): boolean {
    const country = getCountrySafe(isoCode);
    return !!(country?.states && Object.keys(country.states).length > 0);
}

/**
 * Получение регионов
 */
export function getCountryRegions(isoCode: string): string[] {
    const country = getCountrySafe(isoCode);
    return country?.states ? Object.keys(country.states) : [];
}

/**
 * Получение городов (всегда возвращает массив строк)
 */
export function getCountryCities(isoCode: string, regionCode?: string): string[] {
    const country = getCountrySafe(isoCode);

    if (!country?.states) return [];

    // Функция для извлечения имени из города
    const getCityName = (city: unknown): string => {
        if (typeof city === 'string') return city;
        if (city && typeof city === 'object' && 'name' in city) return (city as { name: string }).name;
        return '';
    };

    // Если указан регион
    if (regionCode && country.states[regionCode]) {
        const cities = country.states[regionCode];
        if (Array.isArray(cities)) {
            return cities.map(getCityName).filter(name => name);
        }
        return [];
    }

    // Собираем все города
    const allCities = new Set<string>();
    Object.values(country.states).forEach((stateCities: unknown) => {
        if (Array.isArray(stateCities)) {
            stateCities.forEach(city => {
                const name = getCityName(city);
                if (name) allCities.add(name);
            });
        }
    });

    return Array.from(allCities);
}

/**
 * Получение информации о стране
 */
export function getCountryInfo(isoCode: string) {
    const country = getCountrySafe(isoCode);
    if (!country) return null;

    return {
        iso2: country.shortName,
        name: country.name,
        nativeName: country.native || country.name,
        emoji: country.emoji,
        hasRegions: countryHasRegions(isoCode),
    };
}

/**
 * Получение всех стран
 */
export function getAllCountriesInfo() {
    const countryCodes = csc.getCountriesShort();

    return countryCodes
        .map(code => {
            const country = getCountrySafe(code);
            if (!country) return null;

            return {
                iso2: country.shortName || code,  // ← Убедитесь, что это поле существует
                name: country.name || code,
                nativeName: country.native || country.name || code,
                emoji: country.emoji || getCountryEmoji(code),
                hasRegions: countryHasRegions(code),
            };
        })
        .filter(country => country !== null);
}

function getCountryEmoji(isoCode: string): string {
    const codePoints = isoCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

/**
 * Fallback таймзона
 */
export function getFallbackTimezone(countryCode: string): string {
    const timezones: Record<string, string> = {
        'UA': 'Europe/Kyiv', 'BY': 'Europe/Minsk', 'PL': 'Europe/Warsaw',
        'LT': 'Europe/Vilnius', 'LV': 'Europe/Riga', 'EE': 'Europe/Tallinn',
        'KZ': 'Asia/Almaty', 'MD': 'Europe/Chisinau', 'RU': 'Europe/Moscow',
        'DE': 'Europe/Berlin', 'FR': 'Europe/Paris', 'IT': 'Europe/Rome',
        'ES': 'Europe/Madrid', 'GB': 'Europe/London', 'US': 'America/New_York',
        'CA': 'America/Toronto', 'AU': 'Australia/Sydney', 'JP': 'Asia/Tokyo',
        'CN': 'Asia/Shanghai', 'IN': 'Asia/Kolkata', 'BR': 'America/Sao_Paulo',
    };
    return timezones[countryCode] || 'UTC';
}