// ===========================
// ENUMS (usando valores numéricos del API)
// ===========================

export enum DevelopmentStatus {
  Planeacion = 1,
  EnProgreso = 2,
  Completado = 3,
  Cancelado = 4,
}

// ===========================
// INTERFACES
// ===========================

export interface Development {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  location: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  totalLots: number;
  totalArea?: number;
  startDate?: string;
  endDate?: string;
  status: DevelopmentStatus;
  // Map/Layout
  mapImageUrl?: string;
  // Statistics (computed)
  availableLots?: number;
  reservedLots?: number;
  soldLots?: number;
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDevelopmentDto {
  organizationId: string;
  name: string;
  description?: string;
  location: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  totalLots: number;
  totalArea?: number;
  startDate?: string;
  endDate?: string;
  status?: DevelopmentStatus;
  mapImageUrl?: string;
}

export interface UpdateDevelopmentDto extends Partial<CreateDevelopmentDto> {}

// ===========================
// FILTROS PARA CONSULTAS
// ===========================

export interface DevelopmentFilters {
  pageNumber?: number;
  pageSize?: number;
  status?: DevelopmentStatus;
  search?: string;
}

// ===========================
// RESPUESTA PAGINADA
// ===========================

export interface DevelopmentPaginatedResponse {
  items: Development[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// ===========================
// HELPERS PARA LABELS
// ===========================

export const DevelopmentStatusLabels: Record<DevelopmentStatus, string> = {
  [DevelopmentStatus.Planeacion]: 'Planeación',
  [DevelopmentStatus.EnProgreso]: 'En Progreso',
  [DevelopmentStatus.Completado]: 'Completado',
  [DevelopmentStatus.Cancelado]: 'Cancelado',
};

export const DevelopmentStatusColors: Record<DevelopmentStatus, string> = {
  [DevelopmentStatus.Planeacion]: 'bg-blue-100 text-blue-800',
  [DevelopmentStatus.EnProgreso]: 'bg-yellow-100 text-yellow-800',
  [DevelopmentStatus.Completado]: 'bg-green-100 text-green-800',
  [DevelopmentStatus.Cancelado]: 'bg-red-100 text-red-800',
};
