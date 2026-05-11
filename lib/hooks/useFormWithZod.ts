import { useForm, UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export function useFormWithZod(
  schema: z.ZodType<any, any, any>,
  options?: UseFormProps<any>
) {
  return useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    ...options,
  });
}