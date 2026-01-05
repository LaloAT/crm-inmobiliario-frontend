import { z } from 'zod';
import { LeadSource, LeadStatus } from '../types/lead.types';

export const leadSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido').max(100),
  lastName: z.string().min(1, 'El apellido es requerido').max(100),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Teléfono debe tener al menos 10 dígitos').max(15).optional(),
  source: z.nativeEnum(LeadSource),
  status: z.nativeEnum(LeadStatus),
  notes: z.string().optional(),
  ownerId: z.string().uuid().optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;
