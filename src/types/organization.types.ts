// ===========================
// ENUMS (usando valores numéricos del API)
// ===========================

export enum OrganizationType {
  Constructora = 1,
  Inmobiliaria = 2,
  Franquicia = 3,
  Agencia = 4,
  Asesor = 5,
}

export enum OrganizationTier {
  Free = 1,
  Basic = 2,
  Professional = 3,
  Enterprise = 4,
}

export enum OrganizationStatus {
  Active = 1,
  Inactive = 2,
  Suspended = 3,
  Trial = 4,
}

// ===========================
// INTERFACES
// ===========================

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  tier: OrganizationTier;
  status?: OrganizationStatus;
  // Contact info
  taxId?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  website?: string;
  // Subscription
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  maxUsers?: number;
  maxProperties?: number;
  // Settings
  logo?: string;
  primaryColor?: string;
  notes?: string;
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrganizationDto {
  name: string;
  type: OrganizationType;
  tier: OrganizationTier;
  // Contact
  taxId?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  website?: string;
  // Settings
  logo?: string;
  notes?: string;
}

export interface UpdateOrganizationDto extends Partial<CreateOrganizationDto> {
  status?: OrganizationStatus;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  maxUsers?: number;
  maxProperties?: number;
  primaryColor?: string;
}

// ===========================
// FILTROS PARA CONSULTAS
// ===========================

export interface OrganizationFilters {
  pageNumber?: number;
  pageSize?: number;
  type?: OrganizationType;
  tier?: OrganizationTier;
  status?: OrganizationStatus;
  search?: string;
}

// ===========================
// RESPUESTA PAGINADA
// ===========================

export interface OrganizationPaginatedResponse {
  items: Organization[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// ===========================
// HELPERS PARA LABELS
// ===========================

export const OrganizationTypeLabels: Record<OrganizationType, string> = {
  [OrganizationType.Constructora]: 'Constructora',
  [OrganizationType.Inmobiliaria]: 'Inmobiliaria',
  [OrganizationType.Franquicia]: 'Franquicia',
  [OrganizationType.Agencia]: 'Agencia',
  [OrganizationType.Asesor]: 'Asesor Independiente',
};

export const OrganizationTierLabels: Record<OrganizationTier, string> = {
  [OrganizationTier.Free]: 'Gratuito',
  [OrganizationTier.Basic]: 'Básico',
  [OrganizationTier.Professional]: 'Profesional',
  [OrganizationTier.Enterprise]: 'Empresarial',
};

export const OrganizationStatusLabels: Record<OrganizationStatus, string> = {
  [OrganizationStatus.Active]: 'Activa',
  [OrganizationStatus.Inactive]: 'Inactiva',
  [OrganizationStatus.Suspended]: 'Suspendida',
  [OrganizationStatus.Trial]: 'Prueba',
};

export const OrganizationStatusColors: Record<OrganizationStatus, string> = {
  [OrganizationStatus.Active]: 'bg-green-100 text-green-800',
  [OrganizationStatus.Inactive]: 'bg-gray-100 text-gray-800',
  [OrganizationStatus.Suspended]: 'bg-red-100 text-red-800',
  [OrganizationStatus.Trial]: 'bg-blue-100 text-blue-800',
};
