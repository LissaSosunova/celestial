// lib/schemas/purchaseSchemas.ts
import { z } from 'zod';

// Обновленная схема с default значениями
export const PurchaseFormSchema = z.object({
  packageSlag: z.string().min(1, "Package is required"),
  typeOfPurchase: z.enum(['price', 'free']),
  isPeriodical: z.boolean().default(false),
  agreeToTerms: z.boolean().default(false).refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  acceptFreePart: z.boolean().default(false),
  
  // Новые поля для выбора персоны
  personSelectionType: z.enum(['self', 'existing', 'new']).default('self'),
  selectedPersonUuid: z.string().optional(),
  
  useOwnData: z.boolean().default(true),
  forecastTarget: z.enum(['self', 'other']).default('self'),
  startDate: z.date().optional(),
  confirmEmail: z.string().email("Invalid email address").optional(),
  
  person: z.object({
    name: z.string().optional(),
    relation: z.object({
      name: z.enum(['child', 'business', 'friend', 'relationship']).nullable().optional(),
    }).optional(),
    birthDate: z.string().optional(),
    birthTime: z.string().optional(),
    birthLocation: z.string().optional(),
  }).nullable().optional().default(null),
}).superRefine((data, ctx) => {
  // Валидация в зависимости от выбранного типа
  if (data.personSelectionType === 'new') {
    if (!data.person?.name) {
      ctx.addIssue({ code: 'custom', path: ['person.name'], message: "Name is required" });
    }
    if (!data.person?.relation?.name) {
      ctx.addIssue({ code: 'custom', path: ['person.relation.name'], message: "Relationship is required" });
    }
    if (!data.person?.birthDate) {
      ctx.addIssue({ code: 'custom', path: ['person.birthDate'], message: "Birth date is required" });
    }
    if (!data.person?.birthTime) {
      ctx.addIssue({ code: 'custom', path: ['person.birthTime'], message: "Birth time is required" });
    }
    if (!data.person?.birthLocation) {
      ctx.addIssue({ code: 'custom', path: ['person.birthLocation'], message: "Birth location is required" });
    }
  }
  
  if (data.personSelectionType === 'existing' && !data.selectedPersonUuid) {
    ctx.addIssue({ code: 'custom', path: ['selectedPersonUuid'], message: "Please select a person" });
  }
});

export type PurchaseFormData = z.infer<typeof PurchaseFormSchema>;