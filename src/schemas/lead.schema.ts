import { z } from 'zod';

export const leadSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido').max(100),
  lastName: z.string().min(1, 'El apellido es requerido').max(100),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Teléfono debe tener al menos 10 dígitos').max(15),
  source: z.enum(['WEBSITE', 'REFERRAL', 'SOCIAL_MEDIA', 'PHONE_CALL', 'EMAIL', 'OTHER'], {
    errorMap: () => ({ message: 'Selecciona una fuente válida' }),
  }),
  status: z.number().int().min(1).max(5).default(1),
  notes: z.string().optional(),
  assignedToId: z.string().uuid().optional().nullable(),
});

export type LeadFormData = z.infer<typeof leadSchema>;
