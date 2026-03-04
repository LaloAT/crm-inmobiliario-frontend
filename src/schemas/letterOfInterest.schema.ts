import { z } from 'zod';

export const letterOfInterestSchema = z.object({
  type: z.number().int().min(1).max(2),
  propertyId: z.string().min(1, 'Debe seleccionar una propiedad'),
  leadId: z.union([z.string().min(1), z.literal('')]).optional(),
  prospectName: z.string().min(1, 'El nombre del prospecto es requerido').max(200),
  prospectEmail: z.union([z.string().email('Email inválido'), z.literal('')]).optional(),
  prospectPhone: z.string().max(20).optional(),
  prospectRfc: z.string().max(20).optional(),
  offeredPrice: z.number().min(0, 'El precio debe ser mayor o igual a 0').optional().nullable(),
  conditions: z.string().max(2000).optional(),
  validUntil: z.string().optional(),
});

export type LetterOfInterestFormData = z.infer<typeof letterOfInterestSchema>;
