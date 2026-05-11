export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  isFreePart: boolean;
  type: 'personal' | 'child' | 'forecast_6m' | 'forecast_1y';
  icon: string;
  onClick?: () => void;
}
export type PackageProps = {
  packageItem: Package,
  index: number,
  onClick: () => void
}

export const PACKAGES: Package[] = [
  {
    id: 'personal_natal',
    name: 'Personal Natal Chart',
    description: 'Deep dive into your soul\'s blueprint and psychological makeup.',
    price: 450,
    isFreePart: true,
    type: 'personal',
    icon: "Sun",
  },
  {
    id: 'child_natal',
    name: 'Child\'s Natal Chart',
    description: 'Understand your child\'s unique nature to support their growth.',
    price: 600,
    isFreePart: true,
    type: 'child',
    icon: "Moon"
  },
  {
    id: 'forecast_6m',
    name: '6-Month Forecast',
    description: 'Detailed planetary transitions and opportunities for the next 6 months.',
    price: 300,
    isFreePart: false,
    type: 'forecast_6m',
    icon: "Star"
  },
  {
    id: 'forecast_1y',
    name: 'Yearly Forecast',
    description: 'Your complete roadmap for the year ahead.',
    price: 700,
    isFreePart: false,
    type: 'forecast_1y',
    icon: "Sun"
  }
];