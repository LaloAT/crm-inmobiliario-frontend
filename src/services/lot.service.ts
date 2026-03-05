import axiosInstance from '../config/axios.config';
import type {
  Lot,
  CreateLotRequest,
  UpdateLotRequest,
  UpdateLotStatusRequest,
  BulkCreateLotsRequest,
  LotFilters,
  LotPaginatedResponse,
  LotSummaryDto,
} from '../types/lot.types';

export const lotService = {
  getAll: async (filters?: LotFilters): Promise<LotPaginatedResponse> => {
    try {
      const response = await axiosInstance.get('/api/v1/lots', {
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
      console.error('Error fetching lots:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Lot> => {
    try {
      const response = await axiosInstance.get(`/api/v1/lots/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lot:', error);
      throw error;
    }
  },

  create: async (data: CreateLotRequest): Promise<{ id: string }> => {
    try {
      const response = await axiosInstance.post('/api/v1/lots', data);
      return response.data;
    } catch (error) {
      console.error('Error creating lot:', error);
      throw error;
    }
  },

  update: async (id: string, data: UpdateLotRequest): Promise<void> => {
    try {
      await axiosInstance.put(`/api/v1/lots/${id}`, data);
    } catch (error) {
      console.error('Error updating lot:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/v1/lots/${id}`);
    } catch (error) {
      console.error('Error deleting lot:', error);
      throw error;
    }
  },

  bulkCreate: async (data: BulkCreateLotsRequest): Promise<{ ids: string[]; count: number }> => {
    try {
      const response = await axiosInstance.post('/api/v1/lots/bulk', data);
      return response.data;
    } catch (error) {
      console.error('Error bulk creating lots:', error);
      throw error;
    }
  },

  getSummary: async (developmentId?: string): Promise<LotSummaryDto[]> => {
    try {
      const response = await axiosInstance.get('/api/v1/lots/summary', {
        params: developmentId ? { developmentId } : undefined,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching lots summary:', error);
      throw error;
    }
  },

  updateStatus: async (id: string, data: UpdateLotStatusRequest): Promise<void> => {
    try {
      await axiosInstance.put(`/api/v1/lots/${id}/status`, data);
    } catch (error) {
      console.error('Error updating lot status:', error);
      throw error;
    }
  },
};
