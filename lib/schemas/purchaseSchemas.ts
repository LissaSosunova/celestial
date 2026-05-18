import { z } from 'zod';

export const PurchaseFormSchema = z.object({
  packageSlug: z.string().min(1, "Package is required"),
  typeOfPurchase: z.enum(['price', 'free']),
  isPeriodical: z.boolean().default(false),
  agreeToTerms: z.boolean().default(false).refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  acceptFreePart: z.boolean().default(false),
  selectedVersion: z.enum(['free', 'full']).optional(),
  selectedLang: z.string().default('uk'),
  personSelectionType: z.enum(['self', 'existing', 'new']).default('self'),
  selectedPersonUuid: z.string().optional(),
  useOwnData: z.boolean().default(true),
  forecastTarget: z.enum(['self', 'other']).default('self'),
  startDate: z.date().optional(),
  person: z.object({
    name: z.string().optional(),
    relation: z.object({
      name: z.enum(['child', 'business', 'friend', 'relationship']).nullable().optional(),
    }).optional(),
    birthDate: z.string().optional(),
    birthTime: z.string().optional(),
    birthLocation: z.string().optional(),
  }).nullable().optional().default(null),
});

export type PurchaseFormData = z.infer<typeof PurchaseFormSchema>;