import axiosInstance from '../config/axios.config';
import type {
  Contract,
  CreateContractDto,
  UpdateContractDto,
  ContractFilters,
  ContractPaginatedResponse
} from '../types/contract.types';

export const contractService = {
  /**
   * Obtener todos los contratos
   */
  getAll: async (filters?: ContractFilters): Promise<ContractPaginatedResponse> => {
    try {
      const response = await axiosInstance.get('/api/v1/contracts', { params: filters });
      return response.data;
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
