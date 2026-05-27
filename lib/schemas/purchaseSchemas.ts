// lib/schemas/purchaseSchemas.ts
import { z } from 'zod';

// Базовые универсальные поля для всех покупок
const basePurchaseFields = {
  packageSlug: z.string().min(1, "Package is required"),
  typeOfPurchase: z.enum(['price', 'free']),
  isPeriodical: z.boolean().default(false),
  agreeToTerms: z.boolean().default(false).refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  acceptFreePart: z.boolean().default(false),
  personSelectionType: z.enum(['self', 'existing', 'new']).default('self'),
  selectedPersonUuid: z.string().optional(),
  useOwnData: z.boolean().default(true),
  selectedLang: z.string().default('uk'),
  selectedVersion: z.enum(['free', 'full']).optional(),
};

const birthLocationSchema = z.object({
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  timeZone: z.string().min(1, "Time zone is required"),
  state: z.string().optional(),
});

const personSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relation: z.object({
    name: z.enum(['child', 'business', 'friend', 'relationship']).nullable().optional(),
  }).optional(),
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required"),
  birthLocation: birthLocationSchema, // ← Изменено с z.string() на объект
}).nullable().optional();

// Базовые поля для person (появляются когда personSelectionType не 'self')
const personFields = {
  person: personSchema.default(null),
};

// Поля для прогнозов (forecast)
const forecastFields = {
  forecastTarget: z.enum(['self', 'other']).default('self'),
  startDate: z.date().optional(),
};

// Основная схема с дифференциацией по типу пакета
export const PurchaseFormSchema = z.discriminatedUnion('packageSlug', [
  // Personal Natal Chart
  z.object({
    ...basePurchaseFields,
    ...personFields,
    packageSlug: z.literal('personal_natal'),
  }).superRefine((data, ctx) => {
    // Проверка: если personSelectionType не 'self', то person обязателен
    if (data.personSelectionType !== 'self' && !data.person) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['person'],
        message: "Person information is required when not selecting self",
      });
    }
    
    // Проверка обязательных полей person
    if (data.person) {
      if (!data.person.birthTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['person', 'birthTime'],
          message: "Birth time is required",
        });
      }
    }
    
    // Проверка: если person выбран и есть relation, то validate
    if (data.person && data.person.relation?.name === 'child' && !data.person.birthDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['person', 'birthDate'],
        message: "Birth date is required for child",
      });
    }
  }),

  // Child Natal Chart
  z.object({
    ...basePurchaseFields,
    ...personFields,
    packageSlug: z.literal('child_natal'),
  }).superRefine((data, ctx) => {
    // Для child натальной карты person всегда должен быть (ребенок)
    if (!data.person) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['person'],
        message: "Child information is required",
      });
    }
    
    if (data.person) {
      if (!data.person.birthDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['person', 'birthDate'],
          message: "Child's birth date is required",
        });
      }
      if (!data.person.birthTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['person', 'birthTime'],
          message: "Child's birth time is required",
        });
      }
    }
  }),

  // 6-Month Forecast
  z.object({
    ...basePurchaseFields,
    ...personFields,
    ...forecastFields,
    packageSlug: z.literal('forecast_6m'),
  }).superRefine((data, ctx) => {
    // Start date is required for forecasts
    if (!data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['startDate'],
        message: "Start date is required for forecast",
      });
    }
    
    // Validate forecast target with person
    if (data.forecastTarget === 'other' && data.personSelectionType !== 'self' && !data.person) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['person'],
        message: "Person information is required for forecast on other person",
      });
    }
    
    // Проверка обязательных полей person если он есть
    if (data.person) {
      if (!data.person.birthTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['person', 'birthTime'],
          message: "Birth time is required",
        });
      }
    }
  }),

  // Yearly Forecast
  z.object({
    ...basePurchaseFields,
    ...personFields,
    ...forecastFields,
    packageSlug: z.literal('forecast_1y'),
  }).superRefine((data, ctx) => {
    // Start date is required for forecasts
    if (!data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['startDate'],
        message: "Start date is required for forecast",
      });
    }
    
    // Validate forecast target with person
    if (data.forecastTarget === 'other' && data.personSelectionType !== 'self' && !data.person) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['person'],
        message: "Person information is required for forecast on other person",
      });
    }
    
    // Проверка обязательных полей person если он есть
    if (data.person) {
      if (!data.person.birthTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['person', 'birthTime'],
          message: "Birth time is required",
        });
      }
    }
  }),
]);

// Тип для формы на основе схемы
export type PurchaseFormData = z.infer<typeof PurchaseFormSchema>;

// Вспомогательные типы для каждого пакета
export type PersonalNatalFormData = Extract<PurchaseFormData, { packageSlug: 'personal_natal' }>;
export type ChildNatalFormData = Extract<PurchaseFormData, { packageSlug: 'child_natal' }>;
export type Forecast6mFormData = Extract<PurchaseFormData, { packageSlug: 'forecast_6m' }>;
export type Forecast1yFormData = Extract<PurchaseFormData, { packageSlug: 'forecast_1y' }>;

// Функция для преобразования строковой даты в Date объект
export const transformDateString = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;
  
  // Пробуем распарсить дату в разных форматах
  const date = new Date(dateString);
  
  // Проверяем валидность даты
  if (isNaN(date.getTime())) {
    // Пробуем формат DD.MM.YYYY
    const parts = dateString.split('.');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      const parsedDate = new Date(`${year}-${month}-${day}`);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
    return undefined;
  }
  
  return date;
};

// Функция для валидации и трансформации данных формы
export const validateAndTransformFormData = (data: any) => {
  // Трансформируем строковые даты в Date объекты
  const transformedData = {
    ...data,
    startDate: data.startDate ? transformDateString(data.startDate) : undefined,
    person: data.person ? {
      ...data.person,
      birthDate: data.person.birthDate,
      birthTime: data.person.birthTime,
    } : null,
  };
  
  return PurchaseFormSchema.safeParse(transformedData);
};