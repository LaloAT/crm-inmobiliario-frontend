// ===========================
// ENUMS (usando valores numéricos del API)
// ===========================

export enum LetterOfInterestStatus {
  Draft = 1,
  Sent = 2,
  Signed = 3,
  Expired = 4,
  Cancelled = 5,
}

export enum LetterOfInterestType {
  Purchase = 1,
  Rent = 2,
}

// ===========================
// INTERFACES
// ===========================

export interface LetterOfInterestDto {
  id: string;
  organizationId: string;
  propertyId: string;
  propertyTitle?: string;
  leadId?: string;
  leadName?: string;
  dealId?: string;
  type: LetterOfInterestType;
  typeName: string;
  status: LetterOfInterestStatus;
  statusName: string;
  prospectName: string;
  prospectEmail?: string;
  prospectPhone?: string;
  prospectRfc?: string;
  offeredPrice?: number;
  currency: string;
  conditions?: string;
  validUntil?: string;
  signedAt?: string;
  fileUrl?: string;
  createdByUserId: string;
  createdByUserName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateLetterOfInterestRequest {
  propertyId: string;
  leadId?: string;
  type: LetterOfInterestType;
  prospectName: string;
  prospectEmail?: string;
  prospectPhone?: string;
  prospectRfc?: string;
  offeredPrice?: number;
  conditions?: string;
  validUntil?: string;
}

export interface UpdateLetterOfInterestRequest {
  propertyId: string;
  leadId?: string;
  type: LetterOfInterestType;
  prospectName: string;
  prospectEmail?: string;
  prospectPhone?: string;
  prospectRfc?: string;
  offeredPrice?: number;
  conditions?: string;
  validUntil?: string;
}

// ===========================
// FILTROS PARA CONSULTAS
// ===========================

export interface LetterOfInterestFilters {
  pageNumber?: number;
  pageSize?: number;
  status?: LetterOfInterestStatus;
  type?: LetterOfInterestType;
  search?: string;
}

// ===========================
// RESPUESTA PAGINADA
// ===========================

export interface LetterOfInterestPaginatedResponse {
  items: LetterOfInterestDto[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// ===========================
// HELPERS PARA LABELS
// ===========================

export const LetterOfInterestStatusLabels: Record<LetterOfInterestStatus, string> = {
  [LetterOfInterestStatus.Draft]: 'Borrador',
  [LetterOfInterestStatus.Sent]: 'Enviada',
  [LetterOfInterestStatus.Signed]: 'Firmada',
  [LetterOfInterestStatus.Expired]: 'Expirada',
  [LetterOfInterestStatus.Cancelled]: 'Cancelada',
};

export const LetterOfInterestTypeLabels: Record<LetterOfInterestType, string> = {
  [LetterOfInterestType.Purchase]: 'Compra',
  [LetterOfInterestType.Rent]: 'Renta',
};

// ===========================
// STATUS COLORS (para UI)
// ===========================

export const LetterOfInterestStatusColors: Record<LetterOfInterestStatus, string> = {
  [LetterOfInterestStatus.Draft]: 'bg-gray-100 text-gray-800',
  [LetterOfInterestStatus.Sent]: 'bg-blue-100 text-blue-800',
  [LetterOfInterestStatus.Signed]: 'bg-green-100 text-green-800',
  [LetterOfInterestStatus.Expired]: 'bg-orange-100 text-orange-800',
  [LetterOfInterestStatus.Cancelled]: 'bg-red-100 text-red-800',
};
