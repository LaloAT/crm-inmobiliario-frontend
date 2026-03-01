// ===========================
// INTERFACES
// ===========================

export interface Builder {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  isActive: boolean;
  developmentCount?: number;
  createdAt: string;
}

export interface CreateBuilderDto {
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface UpdateBuilderDto extends Partial<CreateBuilderDto> {
  isActive?: boolean;
}

// ===========================
// FILTROS PARA CONSULTAS
// ===========================

export interface BuilderFilters {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}

// ===========================
// RESPUESTA PAGINADA
// ===========================

export interface BuilderPaginatedResponse {
  items: Builder[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
