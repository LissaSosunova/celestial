import { z } from 'zod';

export const registrationSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .optional()
    .default('Seeker'),
  birthDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 13;
      }
      return age >= 13;
    }, 'You must be at least 13 years old'),
  birthTime: z.string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format')
    .optional()
    .default('12:00'),
  birthLocation: z.string()
    .min(3, 'Location must be at least 3 characters')
    .max(100, 'Location must be less than 100 characters')
    .optional()
    .default('Unknown'),
  email: z.string()
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be less than 100 characters'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});


export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters'),
  password: z.string()
    .min(1, 'Password is required'),
});


export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;