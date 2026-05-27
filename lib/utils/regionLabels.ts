export function getRegionLabel(countryCode: string): string {
  const labels: Record<string, string> = {
    // Восточная Европа
    'UA': 'Oblast / Region',
    'BY': 'Voblast / Region',
    'PL': 'Voivodeship',
    'LT': 'Apskritis / County',
    'LV': 'Novads / Municipality',
    'EE': 'Maakond / County',
    'MD': 'Raion / District',
    'RU': 'Oblast / Republic',
    'KZ': 'Region',
    
    // Западная Европа
    'DE': 'State (Bundesland)',
    'FR': 'Region',
    'IT': 'Region',
    'ES': 'Autonomous Community',
    'GB': 'Country / Region',
    
    // Северная Америка
    'US': 'State',
    'CA': 'Province',
    
    // Азия
    'IN': 'State',
    'JP': 'Prefecture',
    'CN': 'Province',
    
    // Остальные
    'AU': 'State',
    'BR': 'State',
  };
  
  return labels[countryCode] || 'Region';
}