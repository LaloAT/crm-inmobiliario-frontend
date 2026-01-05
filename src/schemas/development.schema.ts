import { z } from 'zod';

export const developmentSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200),
  description: z.string().optional(),
  location: z.string().min(1, 'La ubicación es requerida').max(255),
  developer: z.string().optional(),
  status: z.enum(['PLANNING', 'CONSTRUCTION', 'COMPLETED', 'CANCELLED'], {
    errorMap: () => ({ message: 'Selecciona un estado válido' }),
  }).default('PLANNING'),
  startDate: z.string().optional(),
  estimatedCompletionDate: z.string().optional(),
  totalLots: z.number().int().min(0).optional(),
  availableLots: z.number().int().min(0).optional(),
  amenities: z.array(z.string()).optional().default([]),
});

export type DevelopmentFormData = z.infer<typeof developmentSchema>;
