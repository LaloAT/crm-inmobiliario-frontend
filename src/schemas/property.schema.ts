import { z } from 'zod';

export const propertySchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200),
  description: z.string().optional(),
  address: z.string().min(1, 'La dirección es requerida').max(255),
  price: z.number().min(0, 'El precio debe ser mayor a 0'),
  area: z.number().min(0, 'El área debe ser mayor a 0'),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  parkingSpaces: z.number().int().min(0).optional(),
  propertyType: z.enum(['HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'OFFICE', 'WAREHOUSE', 'OTHER'], {
    errorMap: () => ({ message: 'Selecciona un tipo de propiedad válido' }),
  }),
  listingType: z.enum(['SALE', 'RENT'], {
    errorMap: () => ({ message: 'Selecciona un tipo de listado válido' }),
  }),
  status: z.enum(['AVAILABLE', 'RESERVED', 'SOLD', 'RENTED'], {
    errorMap: () => ({ message: 'Selecciona un estado válido' }),
  }).default('AVAILABLE'),
  images: z.array(z.string().url()).optional().default([]),
  developmentId: z.string().uuid().optional().nullable(),
  lotId: z.string().uuid().optional().nullable(),
  features: z.array(z.string()).optional().default([]),
});

export type PropertyFormData = z.infer<typeof propertySchema>;
