import { z } from 'zod';
import { LotStatus } from '../types/lot.types';

export const lotSchema = z.object({
  lotNumber: z.string().min(1, 'El número de lote es requerido').max(50),
  block: z.string().optional(),
  manzana: z.string().optional(),
  area: z.number().min(0, 'El área debe ser mayor a 0'),
  frontMeters: z.number().min(0).optional(),
  depthMeters: z.number().min(0).optional(),
  price: z.number().min(0, 'El precio debe ser mayor a 0'),
  currency: z.string().optional(),
  status: z.nativeEnum(LotStatus),
  positionX: z.number().optional(),
  positionY: z.number().optional(),
  developmentId: z.string().uuid('Debe seleccionar un desarrollo válido'),
  assignedUserId: z.string().uuid().optional(),
  notes: z.string().optional(),
});

export type LotFormData = z.infer<typeof lotSchema>;
