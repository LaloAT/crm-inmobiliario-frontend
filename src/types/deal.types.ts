// ===========================
// ENUMS (usando valores numéricos del API)
// ===========================

export const enum DealStage {
  NuevoContacto = 1,
  Calificacion = 2,
  Propuesta = 3,
  Negociacion = 4,
  Ganado = 5,
  Perdido = 6,
}

export const enum DealOperation {
  Venta = 1,
  Renta = 2,
  VentaRenta = 3,
}

export const enum ActivityType {
  Llamada = 1,
  Email = 2,
  Reunion = 3,
  Tarea = 4,
  Nota = 5,
  Visita = 6,
  WhatsApp = 7,
  Seguimiento = 8,
  Presentacion = 9,
  Otro = 10,
}

// ===========================
// INTERFACES
// ===========================

export interface Deal {
  id: string;
  organizationId: string;
  leadId?: string;
  propertyId?: string;
  ownerId: string;
  title: string;
  description?: string;
  operation: DealOperation;
  stage: DealStage;
  expectedAmount: number;
  currency?: string;
  probability?: number;
  expectedCloseDate?: string;
  actualCloseDate?: string;
  wonNotes?: string;
  lostReason?: string;
  // Relations
  lead?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  property?: {
    id: string;
    title: string;
    price: number;
  };
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

export interface CreateDealDto {
  organizationId: string;
  leadId?: string;
  propertyId?: string;
  ownerId: string;
  title: string;
  description?: string;
  operation: DealOperation;
  expectedAmount: number;
  currency?: string;
  probability?: number;
  expectedCloseDate?: string;
}

export interface UpdateDealDto extends Partial<CreateDealDto> {
  stage?: DealStage;
}

export interface ChangeDealStageDto {
  newStage: DealStage;
  notes?: string;
  lostReason?: string;
  wonNotes?: string;
}

// ===========================
// ACTIVITIES
// ===========================

export interface DealActivity {
  id: string;
  dealId: string;
  type: ActivityType;
  title: string;
  description?: string;
  scheduledAt?: string;
  completedAt?: string;
  createdBy: string;
  createdByUser?: {
    id: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateDealActivityDto {
  type: ActivityType;
  title: string;
  description?: string;
  scheduledAt?: string;
}

// ===========================
// FILTROS PARA CONSULTAS
// ===========================

export interface DealFilters {
  pageNumber?: number;
  pageSize?: number;
  ownerId?: string;
  operation?: DealOperation;
  stage?: DealStage;
  leadId?: string;
  propertyId?: string;
  search?: string;
}

// ===========================
// RESPUESTA PAGINADA
// ===========================

export interface DealPaginatedResponse {
  items: Deal[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// ===========================
// HELPERS PARA LABELS
// ===========================

export const DealStageLabels: Record<DealStage, string> = {
  [DealStage.NuevoContacto]: 'Nuevo Contacto',
  [DealStage.Calificacion]: 'Calificación',
  [DealStage.Propuesta]: 'Propuesta',
  [DealStage.Negociacion]: 'Negociación',
  [DealStage.Ganado]: 'Ganado',
  [DealStage.Perdido]: 'Perdido',
};

export const DealOperationLabels: Record<DealOperation, string> = {
  [DealOperation.Venta]: 'Venta',
  [DealOperation.Renta]: 'Renta',
  [DealOperation.VentaRenta]: 'Venta/Renta',
};

export const ActivityTypeLabels: Record<ActivityType, string> = {
  [ActivityType.Llamada]: 'Llamada',
  [ActivityType.Email]: 'Email',
  [ActivityType.Reunion]: 'Reunión',
  [ActivityType.Tarea]: 'Tarea',
  [ActivityType.Nota]: 'Nota',
  [ActivityType.Visita]: 'Visita',
  [ActivityType.WhatsApp]: 'WhatsApp',
  [ActivityType.Seguimiento]: 'Seguimiento',
  [ActivityType.Presentacion]: 'Presentación',
  [ActivityType.Otro]: 'Otro',
};

// ===========================
// STAGE COLORS (para UI)
// ===========================

export const DealStageColors: Record<DealStage, string> = {
  [DealStage.NuevoContacto]: 'bg-blue-100 text-blue-800',
  [DealStage.Calificacion]: 'bg-cyan-100 text-cyan-800',
  [DealStage.Propuesta]: 'bg-purple-100 text-purple-800',
  [DealStage.Negociacion]: 'bg-orange-100 text-orange-800',
  [DealStage.Ganado]: 'bg-green-100 text-green-800',
  [DealStage.Perdido]: 'bg-red-100 text-red-800',
};
