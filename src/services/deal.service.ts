import axiosInstance from '../config/axios.config';
import type { Deal, CreateDealDto, UpdateDealDto } from '../types/deal.types';

export const dealService = {
  /**
   * Obtener todos los deals
   */
  getAll: async (params?: {
    stage?: number;
    assignedToId?: string;
  }): Promise<Deal[]> => {
    try {
      const response = await axiosInstance.get('/api/v1/deals', { params });

      // Manejar diferentes estructuras de respuesta
      if (Array.isArray(response.data)) {
        return response.data;
      }

      return response.data.data || response.data.items || [];
    } catch (error) {
      console.error('Error fetching deals:', error);
      throw error;
    }
  },

  /**
   * Obtener un deal por ID
   */
  getById: async (id: string): Promise<Deal> => {
    try {
      const response = await axiosInstance.get(`/api/v1/deals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching deal:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo deal
   */
  create: async (data: CreateDealDto): Promise<Deal> => {
    try {
      const response = await axiosInstance.post('/api/v1/deals', data);
      return response.data;
    } catch (error) {
      console.error('Error creating deal:', error);
      throw error;
    }
  },

  /**
   * Actualizar un deal
   */
  update: async (id: string, data: UpdateDealDto): Promise<Deal> => {
    try {
      const response = await axiosInstance.patch(`/api/v1/deals/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating deal:', error);
      throw error;
    }
  },

  /**
   * Actualizar la etapa de un deal
   */
  updateStage: async (id: string, stage: number): Promise<Deal> => {
    try {
      const response = await axiosInstance.patch(`/api/v1/deals/${id}`, { stage });
      return response.data;
    } catch (error) {
      console.error('Error updating deal stage:', error);
      throw error;
    }
  },

  /**
   * Eliminar un deal
   */
  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/v1/deals/${id}`);
    } catch (error) {
      console.error('Error deleting deal:', error);
      throw error;
    }
  },

  /**
   * Obtener deals agrupados por etapa (para Kanban)
   */
  getByStages: async (): Promise<Record<number, Deal[]>> => {
    try {
      const deals = await dealService.getAll();

      // Agrupar deals por etapa
      const grouped: Record<number, Deal[]> = {
        1: [], // NEW
        2: [], // QUALIFIED
        3: [], // PROPOSAL
        4: [], // NEGOTIATION
        5: [], // CLOSED_WON
        6: [], // CLOSED_LOST
      };

      deals.forEach((deal) => {
        if (grouped[deal.stage]) {
          grouped[deal.stage].push(deal);
        }
      });

      return grouped;
    } catch (error) {
      console.error('Error fetching deals by stages:', error);
      throw error;
    }
  },
};
