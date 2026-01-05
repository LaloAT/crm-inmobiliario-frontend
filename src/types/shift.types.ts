// ===========================
// ENUMS (usando valores numéricos del API)
// ===========================

export const enum ShiftStatus {
  Programado = 1,
  EnProgreso = 2,
  Completado = 3,
  Cancelado = 4,
  NoAsistio = 5,
}

export const enum DayOfWeek {
  Domingo = 0,
  Lunes = 1,
  Martes = 2,
  Miercoles = 3,
  Jueves = 4,
  Viernes = 5,
  Sabado = 6,
}

// ===========================
// INTERFACES
// ===========================

export interface Shift {
  id: string;
  userId: string;
  developmentId?: string;
  date: string; // "2024-01-15"
  startTime: string; // "09:00"
  endTime: string; // "18:00"
  status: ShiftStatus;
  // User info
  user?: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
  };
  // Development info
  development?: {
    id: string;
    name: string;
    location: string;
  };
  // Check-in/Check-out
  checkInTime?: string; // "2024-01-15T09:05:00"
  checkInLatitude?: number;
  checkInLongitude?: number;
  checkOutTime?: string; // "2024-01-15T18:02:00"
  checkOutLatitude?: number;
  checkOutLongitude?: number;
  // Performance
  leadsGenerated?: number;
  visitsAttended?: number;
  notes?: string;
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface CreateShiftDto {
  userId: string;
  developmentId?: string;
  date: string; // "2024-01-15"
  startTime: string; // "09:00"
  endTime: string; // "18:00"
}

export interface CreateBulkShiftsDto {
  userId: string;
  developmentId?: string;
  startDate: string; // "2024-01-01"
  endDate: string; // "2024-01-31"
  days: DayOfWeek[]; // [1, 2, 3, 4, 5] = Lunes a Viernes
  startTime: string; // "09:00"
  endTime: string; // "18:00"
}

export interface UpdateShiftDto {
  date?: string;
  startTime?: string;
  endTime?: string;
  developmentId?: string;
  notes?: string;
}

export interface CheckInDto {
  latitude?: number;
  longitude?: number;
}

export interface CheckOutDto {
  leadsGenerated?: number;
  visitsAttended?: number;
  notes?: string;
  latitude?: number;
  longitude?: number;
}

// ===========================
// CALENDARIO
// ===========================

export interface ShiftCalendar {
  month: number; // 1-12
  year: number; // 2024
  shifts: CalendarShift[];
}

export interface CalendarShift {
  date: string; // "2024-01-15"
  shifts: Shift[];
  totalShifts: number;
  activeShifts: number;
  completedShifts: number;
}

// ===========================
// MIS TURNOS
// ===========================

export interface MyShifts {
  upcoming: Shift[];
  today: Shift[];
  past: Shift[];
  stats: ShiftStats;
}

export interface ShiftStats {
  totalShifts: number;
  completedShifts: number;
  cancelledShifts: number;
  noShowShifts: number;
  totalLeadsGenerated: number;
  totalVisitsAttended: number;
  averageLeadsPerShift: number;
  attendanceRate: number; // percentage
}

// ===========================
// FILTROS PARA CONSULTAS
// ===========================

export interface ShiftFilters {
  pageNumber?: number;
  pageSize?: number;
  userId?: string;
  developmentId?: string;
  status?: ShiftStatus;
  fromDate?: string;
  toDate?: string;
}

// ===========================
// RESPUESTA PAGINADA
// ===========================

export interface ShiftPaginatedResponse {
  items: Shift[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// ===========================
// HELPERS PARA LABELS
// ===========================

export const ShiftStatusLabels: Record<ShiftStatus, string> = {
  [ShiftStatus.Programado]: 'Programado',
  [ShiftStatus.EnProgreso]: 'En Progreso',
  [ShiftStatus.Completado]: 'Completado',
  [ShiftStatus.Cancelado]: 'Cancelado',
  [ShiftStatus.NoAsistio]: 'No Asistió',
};

export const ShiftStatusColors: Record<ShiftStatus, string> = {
  [ShiftStatus.Programado]: 'bg-blue-100 text-blue-800',
  [ShiftStatus.EnProgreso]: 'bg-yellow-100 text-yellow-800',
  [ShiftStatus.Completado]: 'bg-green-100 text-green-800',
  [ShiftStatus.Cancelado]: 'bg-red-100 text-red-800',
  [ShiftStatus.NoAsistio]: 'bg-gray-100 text-gray-800',
};

export const DayOfWeekLabels: Record<DayOfWeek, string> = {
  [DayOfWeek.Domingo]: 'Domingo',
  [DayOfWeek.Lunes]: 'Lunes',
  [DayOfWeek.Martes]: 'Martes',
  [DayOfWeek.Miercoles]: 'Miércoles',
  [DayOfWeek.Jueves]: 'Jueves',
  [DayOfWeek.Viernes]: 'Viernes',
  [DayOfWeek.Sabado]: 'Sábado',
};

export const DayOfWeekShortLabels: Record<DayOfWeek, string> = {
  [DayOfWeek.Domingo]: 'Dom',
  [DayOfWeek.Lunes]: 'Lun',
  [DayOfWeek.Martes]: 'Mar',
  [DayOfWeek.Miercoles]: 'Mié',
  [DayOfWeek.Jueves]: 'Jue',
  [DayOfWeek.Viernes]: 'Vie',
  [DayOfWeek.Sabado]: 'Sáb',
};
