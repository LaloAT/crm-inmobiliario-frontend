import axiosInstance from '../config/axios.config';
import type { Development, CreateDevelopmentDto, UpdateDevelopmentDto } from '../types/development.types';

export const developmentService = {
  /**
   * Obtener todos los desarrollos
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ data: Development[]; total: number; page: number; limit: number }> => {
    try {
      const response = await axiosInstance.get('/api/v1/developments', { params });

      // Manejar diferentes estructuras de respuesta
      if (Array.isArray(response.data)) {
        return {
          data: response.data,
          total: response.data.length,
          page: 1,
          limit: response.data.length,
        };
      }

      return {
        data: response.data.data || response.data.items || [],
        total: response.data.total || 0,
        page: response.data.page || 1,
        limit: response.data.limit || 10,
      };
    } catch (error) {
      console.error('Error fetching developments:', error);
      throw error;
    }
  },

  /**
   * Obtener un desarrollo por ID
   */
  getById: async (id: string): Promise<Development> => {
    try {
      const response = await axiosInstance.get(`/api/v1/developments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching development:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo desarrollo
   */
  create: async (data: CreateDevelopmentDto): Promise<Development> => {
    try {
      const response = await axiosInstance.post('/api/v1/developments', data);
      return response.data;
    } catch (error) {
      console.error('Error creating development:', error);
      throw error;
    }
  },

  /**
   * Actualizar un desarrollo
   */
  update: async (id: string, data: UpdateDevelopmentDto): Promise<Development> => {
    try {
      const response = await axiosInstance.patch(`/api/v1/developments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating development:', error);
      throw error;
    }
  },

  /**
   * Eliminar un desarrollo
   */
  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/v1/developments/${id}`);
    } catch (error) {
      console.error('Error deleting development:', error);
      throw error;
    }
  },
};
