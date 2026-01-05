import { z } from 'zod';
import { OperationType, PropertyType, PropertyStatus, PublishStatus } from '../types/property.types';

export const propertySchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200),
  description: z.string().optional(),
  operation: z.nativeEnum(OperationType),
  type: z.nativeEnum(PropertyType),
  status: z.nativeEnum(PropertyStatus),
  publishStatus: z.nativeEnum(PublishStatus),
  price: z.number().min(0, 'El precio debe ser mayor a 0'),
  currency: z.string().default('MXN'),
  pricePerSquareMeter: z.number().min(0).optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  halfBathrooms: z.number().min(0).optional(),
  parkingSpaces: z.number().int().min(0).optional(),
  constructionArea: z.number().min(0).optional(),
  landArea: z.number().min(0).optional(),
  totalArea: z.number().min(0).optional(),
  yearBuilt: z.number().int().min(1900).max(new Date().getFullYear() + 10).optional(),
  // Address
  addressStreet: z.string().optional(),
  addressNumber: z.string().optional(),
  addressInterior: z.string().optional(),
  addressColony: z.string().optional(),
  addressCity: z.string().optional(),
  addressState: z.string().optional(),
  addressZipCode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  // Legal
  isLienFree: z.boolean().default(false),
  legalNotes: z.string().optional(),
  // Owner
  ownerName: z.string().optional(),
  ownerPhone: z.string().optional(),
  ownerEmail: z.string().email().optional(),
  // Media
  virtualTourUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  webContent: z.string().optional(),
  amenities: z.string().optional(),
  // Assignment
  assignedUserId: z.string().uuid().optional(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;
