import { type Person } from '@/lib/types/person';
import { type PurchaseInfo } from '@/lib/types/package';
export interface UserProfile {
  uuid: string;
  name: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  gender: string;
  onboardingCompleted?: boolean;
  persons?: Person[] | null;
  purchases?: PurchaseInfo[] | null;
}
