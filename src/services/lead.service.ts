import axiosInstance from '../config/axios.config';
import type { Lead, CreateLeadDto, UpdateLeadDto } from '../types/lead.types';

export const leadService = {
  /**
   * Obtener todos los leads
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: number;
  }): Promise<{ data: Lead[]; total: number; page: number; limit: number }> => {
    try {
      const response = await axiosInstance.get('/api/v1/leads', { params });

      // Manejar diferentes estructuras de respuesta
      if (Array.isArray(response.data)) {
        return {
          data: response.data,
          total: response.data.length,
          page: 1,
          limit: response.data.length,
        };
      }

      // Si viene paginado
      return {
        data: response.data.data || response.data.items || [],
        total: response.data.total || 0,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
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
      const response = await axiosInstance.patch(`/api/v1/leads/${id}`, data);
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
};
