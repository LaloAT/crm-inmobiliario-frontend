import { z } from 'zod';

export const lotSchema = z.object({
  developmentId: z.string().min(1, 'Debe seleccionar un desarrollo'),
  lotNumber: z.string().min(1, 'El número de lote es requerido').max(50),
  block: z.string().max(50).optional(),
  street: z.string().max(100).optional(),
  phase: z.string().max(50).optional(),
  model: z.string().max(100).optional(),
  lotSize: z.number().min(0).optional().nullable(),
  builtSize: z.number().min(0).optional().nullable(),
  bedrooms: z.number().int().min(0).optional().nullable(),
  bathrooms: z.number().min(0).optional().nullable(),
  parkingSpaces: z.number().int().min(0).optional().nullable(),
  floors: z.number().int().min(0).optional().nullable(),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  notes: z.string().max(2000).optional(),
});

export type LotFormData = z.infer<typeof lotSchema>;

export const bulkCreateLotsSchema = z.object({
  developmentId: z.string().min(1, 'Debe seleccionar un desarrollo'),
  lotNumberPrefix: z.string().min(1, 'El prefijo es requerido').max(20),
  quantity: z.number().int().min(1, 'Mínimo 1 lote').max(500, 'Máximo 500 lotes'),
  model: z.string().max(100).optional(),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  bedrooms: z.number().int().min(0).optional().nullable(),
  bathrooms: z.number().min(0).optional().nullable(),
  area: z.number().min(0).optional().nullable(),
  floors: z.number().int().min(0).optional().nullable(),
});

export type BulkCreateLotsFormData = z.infer<typeof bulkCreateLotsSchema>;
