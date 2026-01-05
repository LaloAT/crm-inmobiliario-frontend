import { z } from 'zod';

export const dealSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200),
  description: z.string().optional(),
  value: z.number().min(0, 'El valor debe ser mayor a 0'),
  stage: z.number().int().min(1).max(6).default(1),
  probability: z.number().min(0).max(100).default(0),
  expectedCloseDate: z.string().optional(),
  leadId: z.string().uuid('Debe seleccionar un lead válido'),
  propertyId: z.string().uuid().optional().nullable(),
  assignedToId: z.string().uuid().optional().nullable(),
});

export type DealFormData = z.infer<typeof dealSchema>;
