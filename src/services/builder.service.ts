import axiosInstance from '../config/axios.config';
import type {
  Builder,
  CreateBuilderDto,
  UpdateBuilderDto,
  BuilderFilters,
  BuilderPaginatedResponse,
} from '../types/builder.types';

export const builderService = {
  getAll: async (filters?: BuilderFilters): Promise<BuilderPaginatedResponse> => {
    try {
      const response = await axiosInstance.get('/api/v1/builders', {
        params: filters,
      });

      if (response.data.items) {
        return {
          items: response.data.items || [],
          pageNumber: response.data.pageNumber || 1,
          pageSize: response.data.pageSize || 10,
          totalCount: response.data.totalCount || 0,
          totalPages: response.data.totalPages || 0,
        };
      }

      const items = Array.isArray(response.data) ? response.data : [];
      return {
        items,
        pageNumber: 1,
        pageSize: items.length,
        totalCount: items.length,
        totalPages: 1,
      };
    } catch (error) {
      console.error('Error fetching builders:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Builder> => {
    try {
      const response = await axiosInstance.get(`/api/v1/builders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching builder:', error);
      throw error;
    }
  },

  create: async (data: CreateBuilderDto): Promise<Builder> => {
    try {
      const response = await axiosInstance.post('/api/v1/builders', data);
      return response.data;
    } catch (error) {
      console.error('Error creating builder:', error);
      throw error;
    }
  },

  update: async (id: string, data: UpdateBuilderDto): Promise<Builder> => {
    try {
      const response = await axiosInstance.put(`/api/v1/builders/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating builder:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/v1/builders/${id}`);
    } catch (error) {
      console.error('Error deleting builder:', error);
      throw error;
    }
  },
};
