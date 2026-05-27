import { type Person } from '@/lib/types/person';
import { type PurchaseInfo } from '@/lib/types/package';
export interface UserProfile {
  uuid: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthLocation: BirthLocation;
  email: string;
  onboardingCompleted?: boolean;
  persons?: Person[] | null;
  purchases?: PurchaseInfo[] | null;
  createdAt?: Date | string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegistration {
  name: string;
  birthDate: string;
  birthTime: string;
  birthLocation: BirthLocation;
  email: string;
  password: string;
}

export interface BirthLocation {
  country: string;
  city: string;
  timeZone: string;
  state?: string;
}