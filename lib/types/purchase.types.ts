// types/purchase.types.ts
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { PurchaseFormData } from '@/lib/schemas/purchaseSchemas';
import { UserProfile } from '@/lib/types/userProfile';
import { Person } from '@/lib/types/person';
import { Package } from '@/lib/types/package';

export interface FormComponentProps {
  register: UseFormRegister<PurchaseFormData>;
  errors: FieldErrors<PurchaseFormData>;
  watch: UseFormWatch<PurchaseFormData>;
  setValue: UseFormSetValue<PurchaseFormData>;
  isSubmitting?: boolean;
  userProfile: UserProfile;
  packageItem: Package;
}

export type PersonSelectionType = 'self' | 'existing' | 'new';