import { z } from 'zod';
import { DevelopmentStatus } from '../types/development.types';

export const developmentSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200),
  description: z.string().optional(),
  location: z.string().min(1, 'La ubicación es requerida').max(255),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  status: z.nativeEnum(DevelopmentStatus),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  totalLots: z.number().int().min(0),
  totalArea: z.number().min(0).optional(),
  mapImageUrl: z.string().optional(),
});

export type DevelopmentFormData = z.infer<typeof developmentSchema>;
