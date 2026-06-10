// lib/types/package.ts
import { type Person } from '@/lib/types/person';
import { type BirthLocation } from '@/lib/types/userProfile';

export interface Package {
  uuid: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  isFreePart: boolean;
  type: 'personal' | 'child' | 'forecast_6m' | 'forecast_1y' | 'synastry';
  icon: string;
  onClick?: () => void;
}

export type PackageProps = {
  packageItem: Package;
  index: number;
  onClick: () => void;
  isCutted?: boolean;
};

// Базовая информация о покупке для всех типов пакетов
export interface BasePurchaseInfo extends Package {
  uuid: string;
  dateOfPurchase: Date | string;
  typeOfPurchase: 'price' | 'free';
  slug: string;
  isPeriodical: boolean;
  selectedLang: string;
  selectedVersion?: 'free' | 'full';
  birthDate?: Date | string;
}

// Покупка персональной натальной карты
export interface PersonalNatalPurchaseInfo extends BasePurchaseInfo {
  type: 'personal';
  birthDate: Date | string;
  person?: Person | null;
}

// Покупка детской натальной карты
export interface ChildNatalPurchaseInfo extends BasePurchaseInfo {
  type: 'child';
  birthDate: Date | string;
  person: Person; // обязателен для child
}

// Покупка прогноза
export interface ForecastPurchaseInfo extends BasePurchaseInfo {
  type: 'forecast_6m' | 'forecast_1y';
  birthDate: Date | string;
  forecastTarget: 'self' | 'other';
  startDate?: Date | string;
  person?: Person | null;
}

// Покупка синастрии
export interface SynastryPurchaseInfo extends BasePurchaseInfo {
  type: 'synastry';
  firstPerson: Person;
  secondPerson: Person;
  relationType: 'business' | 'friend' | 'relationship';
  personSelectionType?: 'existing' | 'new';
  personSelectionTypeSecond?: 'existing' | 'new';
  selectedPersonUuid?: string;
  selectedPersonSecondUuid?: string;
}

// Объединенный тип для всех покупок
export type PurchaseInfo =
  | PersonalNatalPurchaseInfo
  | ChildNatalPurchaseInfo
  | ForecastPurchaseInfo
  | SynastryPurchaseInfo;

// Тип для результата покупки
export interface PurchaseResult {
  result: 'success' | 'error';
  message?: string;
  data?: PurchaseInfo;
}

// Тип для создания новой покупки (API request)
export interface CreatePurchaseRequest {
  packageSlug: string;
  typeOfPurchase: 'price' | 'free';
  agreeToTerms: boolean;
  acceptFreePart?: boolean;
  personSelectionType?: 'self' | 'existing' | 'new';
  selectedPersonUuid?: string;
  selectedPersonSecondUuid?: string;
  personSelectionTypeSecond?: 'existing' | 'new';
  selectedLang: string;
  selectedVersion?: 'free' | 'full';
  forecastTarget?: 'self' | 'other';
  startDate?: string;
  relationType?: 'business' | 'friend' | 'relationship';
  person?: Omit<Person, 'uuid'>;
  firstPerson?: Omit<Person, 'uuid'>;
  secondPerson?: Omit<Person, 'uuid'>;
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
  },
  {
    slug: 'synastry',
    name: 'Synastry',
    description: "Check your partner compatibility with astrology",
    price: 600,
    isFreePart: false,
    type: 'synastry',
    icon: "Webhook",
    uuid: '234sd-hghh-329-sd2343434d034'
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
    person: {
      uuid: '23434324',
      name: 'Serhey',
      relation: {
        uuid: '9823473847324',
        name: 'child'
      },
      birthDate: '2020-02-11',
      birthTime: '12:30',
      birthLocation: {
        country: 'UA',
        city: 'Kiev',
        timeZone: 'ss',
        state: 'Kiev'
      }
    },
    isPeriodical: false,
    uuid: '234we-dfdr329-sdfsd034',
    selectedLang: 'uk'
  }
];

export interface PurchaseResult {
  result: 'success' | 'error'
}