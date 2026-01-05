import { z } from 'zod';

export const lotSchema = z.object({
  lotNumber: z.string().min(1, 'El número de lote es requerido').max(50),
  block: z.string().optional(),
  area: z.number().min(0, 'El área debe ser mayor a 0'),
  price: z.number().min(0, 'El precio debe ser mayor a 0'),
  dimensions: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD'], {
    errorMap: () => ({ message: 'Selecciona un estado válido' }),
  }).default('AVAILABLE'),
  developmentId: z.string().uuid('Debe seleccionar un desarrollo válido'),
  notes: z.string().optional(),
});

export type LotFormData = z.infer<typeof lotSchema>;
