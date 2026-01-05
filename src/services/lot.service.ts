import axiosInstance from '../config/axios.config';
import type { Lot, CreateLotDto, UpdateLotDto } from '../types/lot.types';

export const lotService = {
  /**
   * Obtener todos los lotes de un desarrollo
   * Los lotes se obtienen a través del endpoint de developments
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    developmentId?: string;
    status?: string;
  }): Promise<{ data: Lot[]; total: number; page: number; limit: number }> => {
    try {
      // Si hay developmentId, obtener los lotes de ese desarrollo específico
      if (params?.developmentId) {
        const response = await axiosInstance.get(`/api/v1/developments/${params.developmentId}`);
        const lots = response.data.lots || [];
        return {
          data: lots,
          total: lots.length,
          page: 1,
          limit: lots.length,
        };
      }

      // Si no hay developmentId, obtener todos los developments y sus lotes
      const devsResponse = await axiosInstance.get('/api/v1/developments');
      const developments = Array.isArray(devsResponse.data)
        ? devsResponse.data
        : devsResponse.data.data || devsResponse.data.items || [];

      // Recolectar todos los lotes de todos los developments
      const allLots: Lot[] = [];
      for (const dev of developments) {
        if (dev.lots && Array.isArray(dev.lots)) {
          allLots.push(...dev.lots);
        }
      }

      return {
        data: allLots,
        total: allLots.length,
        page: 1,
        limit: allLots.length,
      };
    } catch (error) {
      console.error('Error fetching lots:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo lote en un desarrollo
   */
  create: async (data: CreateLotDto): Promise<Lot> => {
    try {
      const { developmentId, ...lotData } = data;
      const response = await axiosInstance.post(
        `/api/v1/developments/${developmentId}/lots`,
        lotData
      );
      return response.data;
    } catch (error) {
      console.error('Error creating lot:', error);
      throw error;
    }
  },

  /**
   * Actualizar el estado de un lote
   */
  updateStatus: async (lotId: string, status: string): Promise<Lot> => {
    try {
      const response = await axiosInstance.put(
        `/api/v1/developments/lots/${lotId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating lot status:', error);
      throw error;
    }
  },

  /**
   * Actualizar un lote (usa updateStatus internamente)
   */
  update: async (id: string, data: UpdateLotDto): Promise<Lot> => {
    try {
      // Si solo se actualiza el estado, usar el endpoint específico
      if (data.status && Object.keys(data).length === 1) {
        return lotService.updateStatus(id, data.status);
      }

      // Para otras actualizaciones, necesitamos el developmentId
      // Por ahora, solo soportamos actualización de status
      console.warn('Solo se soporta actualización de status por el momento');
      if (data.status) {
        return lotService.updateStatus(id, data.status);
      }

      throw new Error('No se puede actualizar el lote sin developmentId');
    } catch (error) {
      console.error('Error updating lot:', error);
      throw error;
    }
  },

  /**
   * Nota: El backend no tiene endpoint para eliminar lotes individuales
   * Los lotes se eliminan al eliminar el development
   */
  delete: async (id: string): Promise<void> => {
    console.warn('La eliminación de lotes no está soportada por el backend');
    throw new Error('La eliminación de lotes no está soportada. Elimina el desarrollo completo.');
  },
};
