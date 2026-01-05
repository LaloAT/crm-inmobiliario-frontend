import { z } from 'zod';

export const commissionSchema = z.object({
  dealId: z.string().uuid('Debe seleccionar un deal válido'),
  userId: z.string().uuid('Debe seleccionar un agente válido'),
  amount: z.number().min(0, 'El monto debe ser mayor a 0'),
  percentage: z.number().min(0).max(100, 'El porcentaje debe estar entre 0 y 100'),
  status: z.enum(['PENDING', 'APPROVED', 'PAID'], {
    errorMap: () => ({ message: 'Selecciona un estado válido' }),
  }).default('PENDING'),
  dueDate: z.string().optional(),
  paidDate: z.string().optional().nullable(),
  notes: z.string().optional(),
});

export type CommissionFormData = z.infer<typeof commissionSchema>;
