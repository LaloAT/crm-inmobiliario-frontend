// ===========================
// ENUMS (usando valores numéricos del API)
// ===========================

export enum LotStatus {
  Available = 1,
  Reserved = 2,
  Sold = 3,
  Rented = 4,
  Exclusive = 5,
  NotAvailable = 6,
  InProcess = 7,
}

// Backwards compat aliases used by map components
export const LotStatusCompat = {
  Disponible: LotStatus.Available,
  Apartado: LotStatus.Reserved,
  Vendido: LotStatus.Sold,
  Bloqueado: LotStatus.NotAvailable,
} as const;

// ===========================
// INTERFACES
// ===========================

export interface Lot {
  id: string;
  developmentId: string;
  developmentName?: string;
  propertyId?: string;
  lotNumber: string;
  block?: string;
  street?: string;
  phase?: string;
  model?: string;
  lotSize?: number;
  builtSize?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  floors?: number;
  price: number;
  currency: string;
  status: LotStatus;
  statusName?: string;
  reservedByLeadId?: string;
  reservedAt?: string;
  dealId?: string;
  letterOfInterestId?: string;
  notes?: string;
  assignedAgentName?: string;
  reservedByName?: string;
  soldToName?: string;
  soldAt?: string;
  mapPositionX?: number;
  mapPositionY?: number;
  mapWidth?: number;
  mapHeight?: number;
  organizationId?: string;
  createdAt: string;
  updatedAt?: string;
  // Compat: old shape used by some components
  area?: number;
  development?: { id: string; name: string };
}

export interface LotDetail extends Lot {
  organizationId: string;
  assignedAgentId?: string;
  soldToLeadId?: string;
  originalPrice?: number;
  exclusiveUntil?: string;
  features?: string;
}

export interface LotSummaryDto {
  developmentId: string;
  developmentName: string;
  total: number;
  available: number;
  reserved: number;
  inProcess: number;
  sold: number;
  notAvailable: number;
}

export interface CreateLotRequest {
  developmentId: string;
  lotNumber: string;
  block?: string;
  phase?: string;
  model?: string;
  lotSize?: number;
  builtSize?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  floors?: number;
  price: number;
  currency?: string;
  notes?: string;
  features?: string;
}

export interface UpdateLotRequest {
  lotNumber: string;
  block?: string;
  street?: string;
  phase?: string;
  model?: string;
  lotSize?: number;
  builtSize?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  floors?: number;
  price: number;
  currency?: string;
  propertyId?: string;
  letterOfInterestId?: string;
  notes?: string;
  features?: string;
}

export interface UpdateLotStatusRequest {
  status: LotStatus;
  assignedAgentId?: string;
  leadId?: string;
  dealId?: string;
  exclusiveUntil?: string;
  notes?: string;
}

export interface BulkCreateLotsRequest {
  developmentId: string;
  lotNumberPrefix: string;
  quantity: number;
  model?: string;
  price: number;
  currency?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  floors?: number;
}

// ===========================
// FILTROS PARA CONSULTAS
// ===========================

export interface LotFilters {
  pageNumber?: number;
  pageSize?: number;
  developmentId?: string;
  status?: LotStatus;
  model?: string;
  search?: string;
}

// ===========================
// RESPUESTA PAGINADA
// ===========================

export interface LotPaginatedResponse {
  items: Lot[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// ===========================
// HELPERS PARA LABELS
// ===========================

export const LotStatusLabels: Record<LotStatus, string> = {
  [LotStatus.Available]: 'Disponible',
  [LotStatus.Reserved]: 'Apartado',
  [LotStatus.Sold]: 'Vendido',
  [LotStatus.Rented]: 'Rentado',
  [LotStatus.Exclusive]: 'Exclusiva',
  [LotStatus.NotAvailable]: 'No Disponible',
  [LotStatus.InProcess]: 'En Proceso',
};

// ===========================
// STATUS COLORS (para UI)
// ===========================

export const LotStatusColors: Record<LotStatus, string> = {
  [LotStatus.Available]: 'bg-green-100 text-green-800',
  [LotStatus.Reserved]: 'bg-yellow-100 text-yellow-800',
  [LotStatus.Sold]: 'bg-red-100 text-red-800',
  [LotStatus.Rented]: 'bg-blue-100 text-blue-800',
  [LotStatus.Exclusive]: 'bg-purple-100 text-purple-800',
  [LotStatus.NotAvailable]: 'bg-gray-100 text-gray-800',
  [LotStatus.InProcess]: 'bg-orange-100 text-orange-800',
};

// Colors for map visualization
export const LotStatusMapColors: Record<LotStatus, string> = {
  [LotStatus.Available]: '#22c55e',
  [LotStatus.Reserved]: '#eab308',
  [LotStatus.Sold]: '#ef4444',
  [LotStatus.Rented]: '#3b82f6',
  [LotStatus.Exclusive]: '#a855f7',
  [LotStatus.NotAvailable]: '#6b7280',
  [LotStatus.InProcess]: '#f97316',
};

// ===========================
// LEGACY COMPAT (used by map components)
// ===========================

export type CreateLotDto = CreateLotRequest;
export type UpdateLotDto = Partial<CreateLotRequest>;
export type UpdateLotStatusDto = UpdateLotStatusRequest;

export interface DevelopmentMap {
  developmentId: string;
  developmentName: string;
  mapImageUrl?: string;
  lots: LotMapItem[];
  totalLots: number;
  availableLots: number;
  reservedLots: number;
  soldLots: number;
}

export interface LotMapItem {
  id: string;
  lotNumber: string;
  area: number;
  price: number;
  status: LotStatus;
  positionX?: number;
  positionY?: number;
  block?: string;
  manzana?: string;
}
