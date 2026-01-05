import axiosInstance from '../config/axios.config';
import type {
  Property,
  CreatePropertyDto,
  UpdatePropertyDto,
  PropertyFilters,
  PropertyPaginatedResponse,
} from '../types/property.types';

export const propertyService = {
  /**
   * Obtener todas las propiedades con filtros
   */
  getAll: async (filters?: PropertyFilters): Promise<PropertyPaginatedResponse> => {
    try {
      const response = await axiosInstance.get('/api/v1/properties', {
        params: filters,
      });

      // El API retorna: { items, pageNumber, pageSize, totalCount, totalPages }
      return {
        items: response.data.items || [],
        pageNumber: response.data.pageNumber || 1,
        pageSize: response.data.pageSize || 10,
        totalCount: response.data.totalCount || 0,
        totalPages: response.data.totalPages || 0,
      };
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  /**
   * Obtener una propiedad por ID
   */
  getById: async (id: string): Promise<Property> => {
    try {
      const response = await axiosInstance.get(`/api/v1/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva propiedad
   */
  create: async (data: CreatePropertyDto): Promise<Property> => {
    try {
      const response = await axiosInstance.post('/api/v1/properties', data);
      return response.data;
    } catch (error) {
      console.error('Error creating property:', error);
      throw error;
    }
  },

  /**
   * Actualizar una propiedad
   */
  update: async (id: string, data: UpdatePropertyDto): Promise<Property> => {
    try {
      const response = await axiosInstance.put(`/api/v1/properties/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },

  /**
   * Eliminar una propiedad (soft delete)
   */
  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/v1/properties/${id}`);
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  },

  /**
   * Upload de imagen
   */
  uploadImage: async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post('/api/v1/properties/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.url || response.data.path;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },
};
