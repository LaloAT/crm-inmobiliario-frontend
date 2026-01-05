import axiosInstance from '../config/axios.config';
import type { Contract, CreateContractDto, UpdateContractDto } from '../types/contract.types';

export const contractService = {
  /**
   * Obtener todos los contratos
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{ data: Contract[]; total: number; page: number; limit: number }> => {
    try {
      const response = await axiosInstance.get('/api/v1/contracts', { params });

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
      console.error('Error fetching contracts:', error);
      throw error;
    }
  },

  /**
   * Obtener un contrato por ID
   */
  getById: async (id: string): Promise<Contract> => {
    try {
      const response = await axiosInstance.get(`/api/v1/contracts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contract:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo contrato
   */
  create: async (data: CreateContractDto): Promise<Contract> => {
    try {
      const response = await axiosInstance.post('/api/v1/contracts', data);
      return response.data;
    } catch (error) {
      console.error('Error creating contract:', error);
      throw error;
    }
  },

  /**
   * Actualizar un contrato
   */
  update: async (id: string, data: UpdateContractDto): Promise<Contract> => {
    try {
      const response = await axiosInstance.patch(`/api/v1/contracts/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating contract:', error);
      throw error;
    }
  },

  /**
   * Eliminar un contrato
   */
  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/v1/contracts/${id}`);
    } catch (error) {
      console.error('Error deleting contract:', error);
      throw error;
    }
  },

  /**
   * Generar PDF del contrato
   */
  generatePdf: async (id: string): Promise<{ pdfUrl: string }> => {
    try {
      const response = await axiosInstance.post(`/api/v1/contracts/${id}/generate-pdf`);
      return response.data;
    } catch (error) {
      console.error('Error generating contract PDF:', error);
      throw error;
    }
  },

  /**
   * Descargar PDF del contrato
   */
  downloadPdf: async (id: string): Promise<void> => {
    try {
      const response = await axiosInstance.get(`/api/v1/contracts/${id}/pdf`, {
        responseType: 'blob',
      });

      // Crear un enlace temporal para descargar el PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contrato-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading contract PDF:', error);
      throw error;
    }
  },
};
