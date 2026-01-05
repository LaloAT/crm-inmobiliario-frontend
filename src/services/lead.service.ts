import axiosInstance from '../config/axios.config';
import type {
  Lead,
  CreateLeadDto,
  UpdateLeadDto,
  AssignLeadDto,
  LeadFilters,
  LeadPaginatedResponse,
} from '../types/lead.types';

export const leadService = {
  /**
   * Obtener todos los leads con filtros
   */
  getAll: async (filters?: LeadFilters): Promise<LeadPaginatedResponse> => {
    try {
      const response = await axiosInstance.get('/api/v1/leads', {
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
      console.error('Error fetching leads:', error);
      throw error;
    }
  },

  /**
   * Obtener un lead por ID
   */
  getById: async (id: string): Promise<Lead> => {
    try {
      const response = await axiosInstance.get(`/api/v1/leads/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lead:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo lead
   */
  create: async (data: CreateLeadDto): Promise<Lead> => {
    try {
      const response = await axiosInstance.post('/api/v1/leads', data);
      return response.data;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  },

  /**
   * Actualizar un lead
   */
  update: async (id: string, data: UpdateLeadDto): Promise<Lead> => {
    try {
      const response = await axiosInstance.put(`/api/v1/leads/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  },

  /**
   * Eliminar un lead
   */
  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/v1/leads/${id}`);
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  },

  /**
   * Asignar un lead a otro usuario
   */
  assign: async (id: string, data: AssignLeadDto): Promise<Lead> => {
    try {
      const response = await axiosInstance.post(`/api/v1/leads/${id}/assign`, data);
      return response.data;
    } catch (error) {
      console.error('Error assigning lead:', error);
      throw error;
    }
  },
};
