import { z } from 'zod';

export const dealSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200),
  description: z.string().optional(),
  value: z.number().min(0, 'El valor debe ser mayor a 0'),
  operation: z.number().int().min(1).max(2),
  financingType: z.number().int().min(1).max(5).optional().nullable(),
  stage: z.number().int().min(1).max(6),
  probability: z.number().min(0).max(100),
  expectedCloseDate: z.string().optional(),
  leadId: z.string().uuid('Debe seleccionar un lead válido'),
  propertyId: z.union([z.string().uuid(), z.literal('')]).optional(),
  isThirdParty: z.boolean().optional(),
  assignedToId: z.string().uuid().optional().nullable(),
});

export type DealFormData = z.infer<typeof dealSchema>;
