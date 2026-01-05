import { z } from 'zod';

export const contractSchema = z.object({
  contractNumber: z.string().min(1, 'El número de contrato es requerido').max(50),
  contractDate: z.string().min(1, 'La fecha de contrato es requerida'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  totalAmount: z.number().min(0, 'El monto debe ser mayor a 0'),
  status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED'], {
    errorMap: () => ({ message: 'Selecciona un estado válido' }),
  }).default('DRAFT'),
  terms: z.string().optional(),
  dealId: z.string().uuid('Debe seleccionar un deal válido'),
  propertyId: z.string().uuid('Debe seleccionar una propiedad válida'),
  signedDate: z.string().optional().nullable(),
});

export type ContractFormData = z.infer<typeof contractSchema>;
