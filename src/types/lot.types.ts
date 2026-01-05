// ===========================
// ENUMS (usando valores numéricos del API)
// ===========================

export const enum LotStatus {
  Disponible = 1,
  Apartado = 2,
  Vendido = 3,
  Bloqueado = 4,
}

// ===========================
// INTERFACES
// ===========================

export interface Lot {
  id: string;
  developmentId: string;
  lotNumber: string;
  block?: string;
  manzana?: string;
  area: number;
  frontMeters?: number;
  depthMeters?: number;
  price: number;
  currency?: string;
  pricePerSquareMeter?: number;
  status: LotStatus;
  // Position on map
  positionX?: number;
  positionY?: number;
  // Relations
  development?: {
    id: string;
    name: string;
  };
  assignedUserId?: string;
  assignedUser?: {
    id: string;
    fullName: string;
  };
  // Buyer info (when sold/reserved)
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  saleDate?: string;
  reservationDate?: string;
  // Notes
  notes?: string;
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface CreateLotDto {
  developmentId: string;
  lotNumber: string;
  block?: string;
  manzana?: string;
  area: number;
  frontMeters?: number;
  depthMeters?: number;
  price: number;
  currency?: string;
  status?: LotStatus;
  positionX?: number;
  positionY?: number;
  assignedUserId?: string;
  notes?: string;
}

export interface UpdateLotDto extends Partial<CreateLotDto> {}

export interface UpdateLotStatusDto {
  newStatus: LotStatus;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  notes?: string;
}

// ===========================
// MAPA DE LOTES
// ===========================

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

// ===========================
// FILTROS PARA CONSULTAS
// ===========================

export interface LotFilters {
  pageNumber?: number;
  pageSize?: number;
  developmentId?: string;
  status?: LotStatus;
  block?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
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
  [LotStatus.Disponible]: 'Disponible',
  [LotStatus.Apartado]: 'Apartado',
  [LotStatus.Vendido]: 'Vendido',
  [LotStatus.Bloqueado]: 'Bloqueado',
};

export const LotStatusColors: Record<LotStatus, string> = {
  [LotStatus.Disponible]: 'bg-green-100 text-green-800',
  [LotStatus.Apartado]: 'bg-yellow-100 text-yellow-800',
  [LotStatus.Vendido]: 'bg-red-100 text-red-800',
  [LotStatus.Bloqueado]: 'bg-gray-100 text-gray-800',
};

// Colors for map visualization
export const LotStatusMapColors: Record<LotStatus, string> = {
  [LotStatus.Disponible]: '#10b981', // green
  [LotStatus.Apartado]: '#f59e0b', // yellow
  [LotStatus.Vendido]: '#ef4444', // red
  [LotStatus.Bloqueado]: '#6b7280', // gray
};
