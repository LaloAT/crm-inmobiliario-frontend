// ===========================
// ENUMS (usando valores numéricos del API)
// ===========================

export enum DealStage {
  NuevoContacto = 1,
  Calificacion = 2,
  Propuesta = 3,
  Negociacion = 4,
  Ganado = 5,
  Perdido = 6,
}

export enum DealOperation {
  Venta = 1,
  Renta = 2,
  VentaRenta = 3,
}

export enum FinancingType {
  Infonavit = 1,
  Cofinavit = 2,
  Bancario = 3,
  Contado = 4,
  Otro = 5,
}

export enum ActivityType {
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
  title: string;
  leadId: string;
  leadName?: string;
  leadPhone?: string;
  propertyId?: string;
  propertyTitle?: string;
  ownerId?: string;
  ownerName?: string;
  operation: DealOperation;
  stage: DealStage;
  expectedValue: number;
  currency?: string;
  probability?: number;
  expectedCloseDate?: string;
  createdAt: string;
  // DealDetailDto extra fields
  previousStage?: DealStage;
  stageChangedAt?: string;
  finalValue?: number;
  commissionPercentage?: number;
  commissionAmount?: number;
  actualCloseDate?: string;
  visitDate?: string;
  reservationDate?: string;
  rentStartDate?: string;
  rentEndDate?: string;
  monthlyRent?: number;
  rentDurationMonths?: number;
  lostReason?: string;
  wonNotes?: string;
  notes?: string;
  financingType?: FinancingType;
  isThirdParty?: boolean;
  updatedAt?: string;
  activities?: DealActivity[];
}

export interface CreateDealDto {
  leadId: string;
  operation: DealOperation;
  expectedValue: number;
  propertyId?: string;
  ownerId?: string;
  currency?: string;
  probability?: number;
  expectedCloseDate?: string;
  notes?: string;
  financingType?: FinancingType;
  isThirdParty?: boolean;
}

export interface UpdateDealDto {
  title?: string;
  propertyId?: string;
  expectedValue?: number;
  probability?: number;
  expectedCloseDate?: string;
  notes?: string;
  financingType?: FinancingType | null;
  isThirdParty?: boolean;
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
  dealId?: string;
  userId?: string;
  userName?: string;
  type: ActivityType;
  title: string;
  description?: string;
  scheduledAt?: string;
  completedAt?: string;
  createdAt: string;
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

export const FinancingTypeLabels: Record<FinancingType, string> = {
  [FinancingType.Infonavit]: 'Infonavit',
  [FinancingType.Cofinavit]: 'Cofinavit',
  [FinancingType.Bancario]: 'Bancario',
  [FinancingType.Contado]: 'Contado',
  [FinancingType.Otro]: 'Otro',
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
