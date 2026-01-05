// ===========================
// ENUMS (usando valores numéricos del API)
// ===========================

export const enum LeadSource {
  SitioWeb = 1,
  Referido = 2,
  RedesSociales = 3,
  Publicidad = 4,
  WalkIn = 5,
  LlamadaTelefonica = 6,
  Email = 7,
}

export const enum LeadStatus {
  Nuevo = 1,
  Contactado = 2,
  Calificado = 3,
  NoCalificado = 4,
  Convertido = 5,
  Perdido = 6,
}

export const enum InterestedInType {
  Comprar = 1,
  Rentar = 2,
  Ambos = 3,
}

// ===========================
// INTERFACES
// ===========================

export interface Lead {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source: LeadSource;
  status: LeadStatus;
  interestedIn?: InterestedInType;
  notes?: string;
  budget?: number;
  // Assignment
  ownerId?: string;
  owner?: {
    id: string;
    fullName: string;
    email: string;
  };
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadDto {
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source: LeadSource;
  status?: LeadStatus;
  interestedIn?: InterestedInType;
  notes?: string;
  budget?: number;
  ownerId?: string;
}

export interface UpdateLeadDto extends Partial<CreateLeadDto> {}

export interface AssignLeadDto {
  newOwnerId: string;
  reason?: string;
}

// ===========================
// FILTROS PARA CONSULTAS
// ===========================

export interface LeadFilters {
  pageNumber?: number;
  pageSize?: number;
  ownerId?: string;
  source?: LeadSource;
  status?: LeadStatus;
  fromDate?: string;
  toDate?: string;
  search?: string;
}

// ===========================
// RESPUESTA PAGINADA
// ===========================

export interface LeadPaginatedResponse {
  items: Lead[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// ===========================
// HELPERS PARA LABELS
// ===========================

export const LeadSourceLabels: Record<LeadSource, string> = {
  [LeadSource.SitioWeb]: 'Sitio Web',
  [LeadSource.Referido]: 'Referido',
  [LeadSource.RedesSociales]: 'Redes Sociales',
  [LeadSource.Publicidad]: 'Publicidad',
  [LeadSource.WalkIn]: 'Walk-In',
  [LeadSource.LlamadaTelefonica]: 'Llamada Telefónica',
  [LeadSource.Email]: 'Email',
};

export const LeadStatusLabels: Record<LeadStatus, string> = {
  [LeadStatus.Nuevo]: 'Nuevo',
  [LeadStatus.Contactado]: 'Contactado',
  [LeadStatus.Calificado]: 'Calificado',
  [LeadStatus.NoCalificado]: 'No Calificado',
  [LeadStatus.Convertido]: 'Convertido',
  [LeadStatus.Perdido]: 'Perdido',
};

export const InterestedInTypeLabels: Record<InterestedInType, string> = {
  [InterestedInType.Comprar]: 'Comprar',
  [InterestedInType.Rentar]: 'Rentar',
  [InterestedInType.Ambos]: 'Ambos',
};
