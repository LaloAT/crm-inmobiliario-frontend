import axiosInstance from '../config/axios.config';
import type {
  Development,
  CreateDevelopmentDto,
  UpdateDevelopmentDto,
  DevelopmentFilters,
  DevelopmentPaginatedResponse,
} from '../types/development.types';
import type {
  Lot,
  CreateLotDto,
  UpdateLotStatusDto,
  DevelopmentMap,
} from '../types/lot.types';

export const developmentService = {
  /**
   * Obtener todos los desarrollos con filtros
   */
  getAll: async (filters?: DevelopmentFilters): Promise<DevelopmentPaginatedResponse> => {
    try {
      const response = await axiosInstance.get('/api/v1/developments', {
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
      const response = await axiosInstance.put(`/api/v1/developments/${id}`, data);
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

  /**
   * Crear un lote en un desarrollo
   */
  createLot: async (developmentId: string, data: CreateLotDto): Promise<Lot> => {
    try {
      const response = await axiosInstance.post(
        `/api/v1/developments/${developmentId}/lots`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Error creating lot:', error);
      throw error;
    }
  },

  /**
   * Actualizar el status de un lote
   */
  updateLotStatus: async (lotId: string, data: UpdateLotStatusDto): Promise<Lot> => {
    try {
      const response = await axiosInstance.put(`/api/v1/developments/lots/${lotId}/status`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating lot status:', error);
      throw error;
    }
  },

  /**
   * Obtener el mapa de lotes de un desarrollo
   */
  getMap: async (developmentId: string): Promise<DevelopmentMap> => {
    try {
      const response = await axiosInstance.get(`/api/v1/developments/${developmentId}/map`);
      return response.data;
    } catch (error) {
      console.error('Error fetching development map:', error);
      throw error;
    }
  },
};
