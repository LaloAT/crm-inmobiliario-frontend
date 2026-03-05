import axiosInstance from '../config/axios.config';
import type {
  ShiftScheduleDto,
  ShiftScheduleDetailDto,
  ShiftAssignmentDto,
  ShiftSwapRequestDto,
  ShiftStatsDto,
  GenerateScheduleRequest,
  CreateSwapRequestPayload,
  ScheduleFilters,
  AssignmentFilters,
  MyAssignmentFilters,
  SwapFilters,
  PaginatedResponse,
} from '../types/shift.types';

export const shiftService = {
  // ===========================
  // SHIFT SCHEDULES
  // ===========================

  getSchedules: async (filters?: ScheduleFilters): Promise<PaginatedResponse<ShiftScheduleDto>> => {
    try {
      const response = await axiosInstance.get('/api/v1/shift-schedules', {
        params: filters,
      });
      return {
        items: response.data.items || [],
        pageNumber: response.data.pageNumber || 1,
        pageSize: response.data.pageSize || 20,
        totalCount: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 0,
      };
    } catch (error) {
      console.error('Error fetching shift schedules:', error);
      throw error;
    }
  },

  getScheduleById: async (id: string): Promise<ShiftScheduleDetailDto> => {
    try {
      const response = await axiosInstance.get(`/api/v1/shift-schedules/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching shift schedule:', error);
      throw error;
    }
  },

  generateSchedule: async (data: GenerateScheduleRequest): Promise<{ id: string }> => {
    try {
      const response = await axiosInstance.post('/api/v1/shift-schedules/generate', data);
      return response.data;
    } catch (error) {
      console.error('Error generating shift schedule:', error);
      throw error;
    }
  },

  publishSchedule: async (id: string): Promise<void> => {
    try {
      await axiosInstance.put(`/api/v1/shift-schedules/${id}/publish`);
    } catch (error) {
      console.error('Error publishing shift schedule:', error);
      throw error;
    }
  },

  lockSchedule: async (id: string): Promise<void> => {
    try {
      await axiosInstance.put(`/api/v1/shift-schedules/${id}/lock`);
    } catch (error) {
      console.error('Error locking shift schedule:', error);
      throw error;
    }
  },

  getStats: async (month: number, year: number): Promise<ShiftStatsDto[]> => {
    try {
      const response = await axiosInstance.get('/api/v1/shift-schedules/stats', {
        params: { month, year },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching shift stats:', error);
      throw error;
    }
  },

  // ===========================
  // SHIFT ASSIGNMENTS
  // ===========================

  getAssignments: async (filters?: AssignmentFilters): Promise<PaginatedResponse<ShiftAssignmentDto>> => {
    try {
      const response = await axiosInstance.get('/api/v1/shift-assignments', {
        params: filters,
      });
      return {
        items: response.data.items || [],
        pageNumber: response.data.pageNumber || 1,
        pageSize: response.data.pageSize || 20,
        totalCount: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 0,
      };
    } catch (error) {
      console.error('Error fetching shift assignments:', error);
      throw error;
    }
  },

  getMyAssignments: async (filters?: MyAssignmentFilters): Promise<PaginatedResponse<ShiftAssignmentDto>> => {
    try {
      const response = await axiosInstance.get('/api/v1/shift-assignments/my', {
        params: filters,
      });
      return {
        items: response.data.items || [],
        pageNumber: response.data.pageNumber || 1,
        pageSize: response.data.pageSize || 20,
        totalCount: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 0,
      };
    } catch (error) {
      console.error('Error fetching my shift assignments:', error);
      throw error;
    }
  },

  attendAssignment: async (id: string): Promise<void> => {
    try {
      await axiosInstance.put(`/api/v1/shift-assignments/${id}/attend`);
    } catch (error) {
      console.error('Error attending shift assignment:', error);
      throw error;
    }
  },

  // ===========================
  // SHIFT SWAPS
  // ===========================

  getSwapRequests: async (filters?: SwapFilters): Promise<PaginatedResponse<ShiftSwapRequestDto>> => {
    try {
      const response = await axiosInstance.get('/api/v1/shift-swaps', {
        params: filters,
      });
      return {
        items: response.data.items || [],
        pageNumber: response.data.pageNumber || 1,
        pageSize: response.data.pageSize || 20,
        totalCount: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 0,
      };
    } catch (error) {
      console.error('Error fetching swap requests:', error);
      throw error;
    }
  },

  createSwapRequest: async (data: CreateSwapRequestPayload): Promise<{ id: string }> => {
    try {
      const response = await axiosInstance.post('/api/v1/shift-swaps', data);
      return response.data;
    } catch (error) {
      console.error('Error creating swap request:', error);
      throw error;
    }
  },

  approveSwap: async (id: string): Promise<void> => {
    try {
      await axiosInstance.put(`/api/v1/shift-swaps/${id}/approve`);
    } catch (error) {
      console.error('Error approving swap:', error);
      throw error;
    }
  },

  rejectSwap: async (id: string): Promise<void> => {
    try {
      await axiosInstance.put(`/api/v1/shift-swaps/${id}/reject`);
    } catch (error) {
      console.error('Error rejecting swap:', error);
      throw error;
    }
  },
};
