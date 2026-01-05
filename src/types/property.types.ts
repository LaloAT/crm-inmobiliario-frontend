// ===========================
// ENUMS (usando valores numéricos del API)
// ===========================

export enum OperationType {
  Venta = 1,
  Renta = 2,
  VentaRenta = 3,
}

export enum PropertyType {
  Casa = 1,
  Departamento = 2,
  Terreno = 3,
  Local = 4,
  Oficina = 5,
  Bodega = 6,
  Edificio = 7,
  Otro = 8,
}

export enum PropertyStatus {
  Disponible = 1,
  Apartado = 2,
  Vendido = 3,
  Rentado = 4,
  NoDisponible = 5,
}

export enum PublishStatus {
  Borrador = 1,
  Publicado = 2,
  Despublicado = 3,
}

// ===========================
// INTERFACES
// ===========================

export interface Property {
  id: string;
  organizationId: string;
  title: string;
  description?: string;
  operation: OperationType;
  type: PropertyType;
  status: PropertyStatus;
  publishStatus: PublishStatus;
  price: number;
  currency: string;
  pricePerSquareMeter?: number;
  bedrooms?: number;
  bathrooms?: number;
  halfBathrooms?: number;
  parkingSpaces?: number;
  constructionArea?: number;
  landArea?: number;
  totalArea?: number;
  yearBuilt?: number;
  // Address fields
  addressStreet?: string;
  addressNumber?: string;
  addressInterior?: string;
  addressColony?: string;
  addressCity?: string;
  addressState?: string;
  addressZipCode?: string;
  latitude?: number;
  longitude?: number;
  // Legal info
  isLienFree: boolean;
  legalNotes?: string;
  // Owner info
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  // Media
  images?: string[];
  virtualTourUrl?: string;
  videoUrl?: string;
  webContent?: string;
  amenities?: string;
  // Assignment
  assignedUserId?: string;
  assignedUser?: {
    id: string;
    fullName: string;
    email: string;
  };
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyDto {
  organizationId: string;
  title: string;
  description?: string;
  operation: OperationType;
  type: PropertyType;
  status: PropertyStatus;
  publishStatus: PublishStatus;
  price: number;
  currency: string;
  pricePerSquareMeter?: number;
  bedrooms?: number;
  bathrooms?: number;
  halfBathrooms?: number;
  parkingSpaces?: number;
  constructionArea?: number;
  landArea?: number;
  totalArea?: number;
  yearBuilt?: number;
  // Address
  addressStreet?: string;
  addressNumber?: string;
  addressInterior?: string;
  addressColony?: string;
  addressCity?: string;
  addressState?: string;
  addressZipCode?: string;
  latitude?: number;
  longitude?: number;
  // Legal
  isLienFree?: boolean;
  legalNotes?: string;
  // Owner
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  // Media
  virtualTourUrl?: string;
  videoUrl?: string;
  webContent?: string;
  amenities?: string;
  // Assignment
  assignedUserId?: string;
}

export interface UpdatePropertyDto extends Partial<CreatePropertyDto> {}

// ===========================
// FILTROS PARA CONSULTAS
// ===========================

export interface PropertyFilters {
  pageNumber?: number;
  pageSize?: number;
  operation?: OperationType;
  type?: PropertyType;
  status?: PropertyStatus;
  publishStatus?: PublishStatus;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  city?: string;
  state?: string;
  search?: string;
}

// ===========================
// RESPUESTA PAGINADA
// ===========================

export interface PropertyPaginatedResponse {
  items: Property[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// ===========================
// HELPERS PARA LABELS
// ===========================

export const OperationTypeLabels: Record<OperationType, string> = {
  [OperationType.Venta]: 'Venta',
  [OperationType.Renta]: 'Renta',
  [OperationType.VentaRenta]: 'Venta/Renta',
};

export const PropertyTypeLabels: Record<PropertyType, string> = {
  [PropertyType.Casa]: 'Casa',
  [PropertyType.Departamento]: 'Departamento',
  [PropertyType.Terreno]: 'Terreno',
  [PropertyType.Local]: 'Local',
  [PropertyType.Oficina]: 'Oficina',
  [PropertyType.Bodega]: 'Bodega',
  [PropertyType.Edificio]: 'Edificio',
  [PropertyType.Otro]: 'Otro',
};

export const PropertyStatusLabels: Record<PropertyStatus, string> = {
  [PropertyStatus.Disponible]: 'Disponible',
  [PropertyStatus.Apartado]: 'Apartado',
  [PropertyStatus.Vendido]: 'Vendido',
  [PropertyStatus.Rentado]: 'Rentado',
  [PropertyStatus.NoDisponible]: 'No Disponible',
};

export const PublishStatusLabels: Record<PublishStatus, string> = {
  [PublishStatus.Borrador]: 'Borrador',
  [PublishStatus.Publicado]: 'Publicado',
  [PublishStatus.Despublicado]: 'Despublicado',
};
