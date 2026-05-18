import { type Person } from '@/lib/types/person';

export interface Package {
  uuid: string
  slug: string;
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

export interface PurchaseInfo extends Package {
  uuid: string,
  dateOfPurchase: Date | string,
  typeOfPurchase: 'price' | 'free',
  birthDate: Date | string,
  person?: Person | null
  slug: string,
  isPeriodical: boolean,
  selectedLang: string
}
export const PACKAGES: Package[] = [
  {
    slug: 'personal_natal',
    name: 'Personal Natal Chart',
    description: 'Deep dive into your soul\'s blueprint and psychological makeup.',
    price: 450,
    isFreePart: true,
    type: 'personal',
    icon: "Sun",
    uuid: '234329-sdfsd034'
  },
  {
    slug: 'child_natal',
    name: 'Child\'s Natal Chart',
    description: 'Understand your child\'s unique nature to support their growth.',
    price: 600,
    isFreePart: true,
    type: 'child',
    icon: "Moon",
    uuid: '234329-sdfsewed034'
  },
  {
    slug: 'forecast_6m',
    name: '6-Month Forecast',
    description: 'Detailed planetary transitions and opportunities for the next 6 months.',
    price: 300,
    isFreePart: false,
    type: 'forecast_6m',
    icon: "Star",
    uuid: '234329-sdfsdw73354034'
  },
  {
    slug: 'forecast_1y',
    name: 'Yearly Forecast',
    description: 'Your complete roadmap for the year ahead.',
    price: 700,
    isFreePart: false,
    type: 'forecast_1y',
    icon: "Sun",
    uuid: '234sd-hghh-329-sdfsd034'
  }
];


export const BOUGHTPACKAGES: PurchaseInfo[] = [
  {
    slug: 'personal_natal',
    name: 'Personal Natal Chart',
    description: 'Deep dive into your soul\'s blueprint and psychological makeup.',
    price: 450,
    isFreePart: true,
    type: 'personal',
    icon: "Sun",
    dateOfPurchase: '2026-03-12',
    typeOfPurchase: 'price',
    birthDate: '2000-09-12',
    person: null,
    isPeriodical: false,
    uuid: '234329-sdfsd0qw5334',
    selectedLang: 'uk'
  },
  {
    slug: 'child_natal',
    name: 'Child\'s Natal Chart',
    description: 'Understand your child\'s unique nature to support their growth.',
    price: 600,
    isFreePart: true,
    type: 'child',
    icon: "Moon",
    dateOfPurchase: '2026-04-12',
    typeOfPurchase: 'price',
    birthDate: '2018-06-12',
    person: null,
    isPeriodical: false,
    uuid: '234we-dfdr329-sdfsd034',
    selectedLang: 'uk'
  },
  {
    slug: 'forecast_6m',
    name: '6-Month Forecast',
    description: 'Detailed planetary transitions and opportunities for the next 6 months.',
    price: 300,
    isFreePart: false,
    type: 'forecast_6m',
    icon: "Star",
    dateOfPurchase: '2026-03-12',
    typeOfPurchase: 'price',
    birthDate: '2000-12-12',
    person: null,
    isPeriodical: true,
    uuid: '234gdgf84-329-sdfsd034',
    selectedLang: 'uk'
  },
  {
    slug: 'forecast_1y',
    name: 'Yearly Forecast',
    description: 'Your complete roadmap for the year ahead.',
    price: 700,
    isFreePart: false,
    type: 'forecast_1y',
    icon: "Sun",
    dateOfPurchase: '2026-05-24',
    typeOfPurchase: 'price',
    birthDate: '2000-03-12',
    person: null,
    isPeriodical: false,
    uuid: '234dsd329-sdf455-sd034',
    selectedLang: 'uk'
  }
];