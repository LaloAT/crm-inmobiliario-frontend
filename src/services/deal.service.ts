import axiosInstance from '../config/axios.config';
import type {
  Deal,
  CreateDealDto,
  UpdateDealDto,
  ChangeDealStageDto,
  DealActivity,
  CreateDealActivityDto,
  DealFilters,
  DealPaginatedResponse,
  DealStage,
} from '../types/deal.types';

export const dealService = {
  /**
   * Obtener todos los deals con filtros
   */
  getAll: async (filters?: DealFilters): Promise<DealPaginatedResponse> => {
    try {
      const response = await axiosInstance.get('/api/v1/deals', {
        params: filters,
      });

      // Si el API retorna paginado
      if (response.data.items) {
        return {
          items: response.data.items || [],
          pageNumber: response.data.pageNumber || 1,
          pageSize: response.data.pageSize || 10,
          totalCount: response.data.totalCount || 0,
          totalPages: response.data.totalPages || 0,
        };
      }

      // Si retorna array directo (backwards compatibility)
      const items = Array.isArray(response.data) ? response.data : [];
      return {
        items,
        pageNumber: 1,
        pageSize: items.length,
        totalCount: items.length,
        totalPages: 1,
      };
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
      const response = await axiosInstance.put(`/api/v1/deals/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating deal:', error);
      throw error;
    }
  },

  /**
   * Cambiar la etapa de un deal
   */
  updateStage: async (id: string, data: ChangeDealStageDto): Promise<Deal> => {
    try {
      const response = await axiosInstance.put(`/api/v1/deals/${id}/stage`, data);
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
   * Agregar una actividad a un deal
   */
  createActivity: async (dealId: string, data: CreateDealActivityDto): Promise<DealActivity> => {
    try {
      const response = await axiosInstance.post(`/api/v1/deals/${dealId}/activities`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating deal activity:', error);
      throw error;
    }
  },

  /**
   * Obtener actividades de un deal
   */
  getActivities: async (dealId: string): Promise<DealActivity[]> => {
    try {
      const response = await axiosInstance.get(`/api/v1/deals/${dealId}/activities`);
      return response.data.items || response.data || [];
    } catch (error) {
      console.error('Error fetching deal activities:', error);
      throw error;
    }
  },

  /**
   * Obtener deals agrupados por etapa (para Kanban)
   */
  getByStages: async (): Promise<Record<number, Deal[]>> => {
    try {
      const response = await dealService.getAll();
      const deals = response.items;

      // Agrupar deals por etapa
      const grouped: Record<number, Deal[]> = {
        1: [], // NuevoContacto
        2: [], // Calificacion
        3: [], // Propuesta
        4: [], // Negociacion
        5: [], // Ganado
        6: [], // Perdido
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
