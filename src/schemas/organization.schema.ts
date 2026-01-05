import { z } from 'zod';
import { OrganizationType, OrganizationTier } from '../types/organization.types';

export const organizationSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  type: z.nativeEnum(OrganizationType),
  tier: z.nativeEnum(OrganizationTier),
  taxId: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  notes: z.string().optional(),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;
