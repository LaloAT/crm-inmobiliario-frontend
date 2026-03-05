// ===========================
// ENUMS (valores numéricos del API)
// ===========================

export enum ScheduleStatus {
  Draft = 1,
  Published = 2,
  Locked = 3,
}

export enum ShiftType {
  Morning = 1,
  Afternoon = 2,
}

export enum AssignmentStatus {
  Assigned = 1,
  Completed = 2,
  Absent = 3,
  Swapped = 4,
}

export enum SwapStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
}

// ===========================
// INTERFACES - DTOs del backend
// ===========================

export interface ShiftScheduleDto {
  id: string;
  month: number;
  year: number;
  status: ScheduleStatus;
  statusName: string;
  generatedAt: string;
  publishedAt: string | null;
  generatedByName: string;
  totalAssignments: number;
}

export interface ShiftScheduleDetailDto extends ShiftScheduleDto {
  assignments: ShiftAssignmentDto[];
}

export interface ShiftAssignmentDto {
  id: string;
  developmentId: string;
  developmentName: string;
  date: string; // "2024-01-15" (DateOnly)
  shiftType: ShiftType;
  shiftTypeName: string;
  supervisorId: string;
  supervisorName: string;
  agentId: string;
  agentName: string;
  status: AssignmentStatus;
  statusName: string;
  attendedAt: string | null;
  notes: string | null;
}

export interface ShiftSwapRequestDto {
  id: string;
  originalAssignment: ShiftAssignmentDto;
  proposedAgentId: string;
  proposedAgentName: string;
  requestedByUserId: string;
  requestedByName: string;
  approvedByUserId: string | null;
  approvedByName: string | null;
  status: SwapStatus;
  statusName: string;
  reason: string | null;
  createdAt: string;
}

export interface ShiftStatsDto {
  supervisorId: string;
  supervisorName: string;
  totalAssigned: number;
  completed: number;
  absent: number;
  adherencePercentage: number;
}

// ===========================
// REQUEST DTOs
// ===========================

export interface GenerateScheduleRequest {
  month: number;
  year: number;
}

export interface CreateSwapRequestPayload {
  originalAssignmentId: string;
  proposedAgentId: string;
  reason?: string;
}

// ===========================
// FILTROS
// ===========================

export interface ScheduleFilters {
  pageNumber?: number;
  pageSize?: number;
  month?: number;
  year?: number;
  status?: ScheduleStatus;
}

export interface AssignmentFilters {
  pageNumber?: number;
  pageSize?: number;
  scheduleId?: string;
  developmentId?: string;
  date?: string;
  supervisorId?: string;
  agentId?: string;
  status?: AssignmentStatus;
}

export interface MyAssignmentFilters {
  pageNumber?: number;
  pageSize?: number;
  fromDate?: string;
  toDate?: string;
  status?: AssignmentStatus;
}

export interface SwapFilters {
  pageNumber?: number;
  pageSize?: number;
  status?: SwapStatus;
  scheduleId?: string;
}

// ===========================
// RESPUESTAS PAGINADAS
// ===========================

export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// ===========================
// LABELS Y COLORES
// ===========================

export const ScheduleStatusLabels: Record<ScheduleStatus, string> = {
  [ScheduleStatus.Draft]: 'Borrador',
  [ScheduleStatus.Published]: 'Publicado',
  [ScheduleStatus.Locked]: 'Bloqueado',
};

export const ScheduleStatusColors: Record<ScheduleStatus, string> = {
  [ScheduleStatus.Draft]: 'bg-gray-100 text-gray-800',
  [ScheduleStatus.Published]: 'bg-green-100 text-green-800',
  [ScheduleStatus.Locked]: 'bg-red-100 text-red-800',
};

export const ShiftTypeLabels: Record<ShiftType, string> = {
  [ShiftType.Morning]: 'Matutino',
  [ShiftType.Afternoon]: 'Vespertino',
};

export const ShiftTypeColors: Record<ShiftType, string> = {
  [ShiftType.Morning]: 'bg-yellow-100 text-yellow-800',
  [ShiftType.Afternoon]: 'bg-indigo-100 text-indigo-800',
};

export const AssignmentStatusLabels: Record<AssignmentStatus, string> = {
  [AssignmentStatus.Assigned]: 'Asignado',
  [AssignmentStatus.Completed]: 'Completado',
  [AssignmentStatus.Absent]: 'Ausente',
  [AssignmentStatus.Swapped]: 'Intercambiado',
};

export const AssignmentStatusColors: Record<AssignmentStatus, string> = {
  [AssignmentStatus.Assigned]: 'bg-blue-100 text-blue-800',
  [AssignmentStatus.Completed]: 'bg-green-100 text-green-800',
  [AssignmentStatus.Absent]: 'bg-red-100 text-red-800',
  [AssignmentStatus.Swapped]: 'bg-purple-100 text-purple-800',
};

export const SwapStatusLabels: Record<SwapStatus, string> = {
  [SwapStatus.Pending]: 'Pendiente',
  [SwapStatus.Approved]: 'Aprobado',
  [SwapStatus.Rejected]: 'Rechazado',
};

export const SwapStatusColors: Record<SwapStatus, string> = {
  [SwapStatus.Pending]: 'bg-yellow-100 text-yellow-800',
  [SwapStatus.Approved]: 'bg-green-100 text-green-800',
  [SwapStatus.Rejected]: 'bg-red-100 text-red-800',
};

// Colores de supervisor para el calendario
export const SupervisorColors: string[] = [
  'bg-blue-200 text-blue-900',
  'bg-green-200 text-green-900',
  'bg-purple-200 text-purple-900',
  'bg-orange-200 text-orange-900',
  'bg-pink-200 text-pink-900',
  'bg-teal-200 text-teal-900',
  'bg-cyan-200 text-cyan-900',
  'bg-amber-200 text-amber-900',
];
