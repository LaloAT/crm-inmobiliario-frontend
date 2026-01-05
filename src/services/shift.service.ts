import axiosInstance from '../config/axios.config';
import type {
  Shift,
  CreateShiftDto,
  CreateBulkShiftsDto,
  UpdateShiftDto,
  CheckInDto,
  CheckOutDto,
  ShiftCalendar,
  MyShifts,
  ShiftFilters,
  ShiftPaginatedResponse,
} from '../types/shift.types';

export const shiftService = {
  /**
   * Obtener todos los turnos con filtros
   */
  getAll: async (filters?: ShiftFilters): Promise<ShiftPaginatedResponse> => {
    try {
      const response = await axiosInstance.get('/api/v1/shifts', {
        params: filters,
      });

      return {
        items: response.data.items || [],
        pageNumber: response.data.pageNumber || 1,
        pageSize: response.data.pageSize || 10,
        totalCount: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 0,
      };
    } catch (error) {
      console.error('Error fetching shifts:', error);
      throw error;
    }
  },

  /**
   * Obtener un turno por ID
   */
  getById: async (id: string): Promise<Shift> => {
    try {
      const response = await axiosInstance.get(`/api/v1/shifts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching shift:', error);
      throw error;
    }
  },

  /**
   * Crear un turno individual
   */
  create: async (data: CreateShiftDto): Promise<Shift> => {
    try {
      const response = await axiosInstance.post('/api/v1/shifts', data);
      return response.data;
    } catch (error) {
      console.error('Error creating shift:', error);
      throw error;
    }
  },

  /**
   * Crear turnos en lote (múltiples días)
   */
  createBulk: async (data: CreateBulkShiftsDto): Promise<Shift[]> => {
    try {
      const response = await axiosInstance.post('/api/v1/shifts/bulk', data);
      return response.data.items || response.data || [];
    } catch (error) {
      console.error('Error creating bulk shifts:', error);
      throw error;
    }
  },

  /**
   * Actualizar un turno
   */
  update: async (id: string, data: UpdateShiftDto): Promise<Shift> => {
    try {
      const response = await axiosInstance.put(`/api/v1/shifts/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating shift:', error);
      throw error;
    }
  },

  /**
   * Cancelar un turno
   */
  cancel: async (id: string): Promise<Shift> => {
    try {
      const response = await axiosInstance.put(`/api/v1/shifts/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling shift:', error);
      throw error;
    }
  },

  /**
   * Registrar entrada (check-in)
   */
  checkIn: async (id: string, data?: CheckInDto): Promise<Shift> => {
    try {
      const response = await axiosInstance.put(`/api/v1/shifts/${id}/checkin`, data);
      return response.data;
    } catch (error) {
      console.error('Error checking in:', error);
      throw error;
    }
  },

  /**
   * Registrar salida (check-out)
   */
  checkOut: async (id: string, data?: CheckOutDto): Promise<Shift> => {
    try {
      const response = await axiosInstance.put(`/api/v1/shifts/${id}/checkout`, data);
      return response.data;
    } catch (error) {
      console.error('Error checking out:', error);
      throw error;
    }
  },

  /**
   * Obtener calendario mensual de turnos
   */
  getCalendar: async (month: number, year: number): Promise<ShiftCalendar> => {
    try {
      const response = await axiosInstance.get('/api/v1/shifts/calendar', {
        params: { month, year },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching shift calendar:', error);
      throw error;
    }
  },

  /**
   * Obtener mis turnos (del usuario autenticado)
   */
  getMy: async (): Promise<MyShifts> => {
    try {
      const response = await axiosInstance.get('/api/v1/shifts/my');
      return response.data;
    } catch (error) {
      console.error('Error fetching my shifts:', error);
      throw error;
    }
  },
};
