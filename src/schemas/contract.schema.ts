import { z } from 'zod';
import { ContractStatus, ContractType } from '../types/contract.types';

export const contractSchema = z.object({
  contractNumber: z.string().min(1, 'El número de contrato es requerido').max(50),
  contractDate: z.string().min(1, 'La fecha de contrato es requerida'),
  startDate: z.string().min(1, 'La fecha de inicio es requerida'),
  endDate: z.string().optional(),
  totalAmount: z.number().min(0, 'El monto debe ser mayor a 0'),
  status: z.nativeEnum(ContractStatus),
  type: z.nativeEnum(ContractType).optional(),
  terms: z.string().optional(),
  dealId: z.string().uuid('Debe seleccionar un deal válido'),
  propertyId: z.string().uuid('Debe seleccionar una propiedad válida'),
  signedDate: z.string().optional().nullable(),
  clientName: z.string().optional(),
  clientEmail: z.string().email().optional(),
});

export type ContractFormData = z.infer<typeof contractSchema>;
