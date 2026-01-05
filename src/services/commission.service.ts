import axiosInstance from '../config/axios.config';
import type { Commission, CreateCommissionDto, UpdateCommissionDto } from '../types/commission.types';

export const commissionService = {
  /**
   * Obtener todas las comisiones
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    userId?: string;
  }): Promise<{ data: Commission[]; total: number; page: number; limit: number }> => {
    try {
      const response = await axiosInstance.get('/api/v1/commissions', { params });

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
      console.error('Error fetching commissions:', error);
      throw error;
    }
  },

  /**
   * Obtener una comisión por ID
   */
  getById: async (id: string): Promise<Commission> => {
    try {
      const response = await axiosInstance.get(`/api/v1/commissions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching commission:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva comisión
   */
  create: async (data: CreateCommissionDto): Promise<Commission> => {
    try {
      const response = await axiosInstance.post('/api/v1/commissions', data);
      return response.data;
    } catch (error) {
      console.error('Error creating commission:', error);
      throw error;
    }
  },

  /**
   * Actualizar una comisión
   */
  update: async (id: string, data: UpdateCommissionDto): Promise<Commission> => {
    try {
      const response = await axiosInstance.patch(`/api/v1/commissions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating commission:', error);
      throw error;
    }
  },

  /**
   * Eliminar una comisión
   */
  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/v1/commissions/${id}`);
    } catch (error) {
      console.error('Error deleting commission:', error);
      throw error;
    }
  },

  /**
   * Obtener resumen de comisiones
   */
  getSummary: async (): Promise<{
    total: number;
    pending: number;
    approved: number;
    paid: number;
  }> => {
    try {
      const response = await axiosInstance.get('/api/v1/commissions/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching commission summary:', error);
      throw error;
    }
  },

  /**
   * Obtener mis comisiones (del usuario actual)
   */
  getMy: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ data: Commission[]; total: number; page: number; limit: number }> => {
    try {
      const response = await axiosInstance.get('/api/v1/commissions/my', { params });

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
      console.error('Error fetching my commissions:', error);
      throw error;
    }
  },

  /**
   * Aprobar una comisión
   */
  approve: async (id: string): Promise<Commission> => {
    try {
      const response = await axiosInstance.put(`/api/v1/commissions/${id}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving commission:', error);
      throw error;
    }
  },

  /**
   * Pagar una comisión
   */
  pay: async (id: string): Promise<Commission> => {
    try {
      const response = await axiosInstance.put(`/api/v1/commissions/${id}/pay`);
      return response.data;
    } catch (error) {
      console.error('Error paying commission:', error);
      throw error;
    }
  },
};
