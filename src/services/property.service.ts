import axiosInstance from '../config/axios.config';
import type { Property, CreatePropertyDto, UpdatePropertyDto } from '../types/property.types';

export const propertyService = {
  /**
   * Obtener todas las propiedades
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    propertyType?: string;
    listingType?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
  }): Promise<{ data: Property[]; total: number; page: number; limit: number }> => {
    try {
      const response = await axiosInstance.get('/api/v1/properties', { params });

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
      const response = await axiosInstance.patch(`/api/v1/properties/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  },

  /**
   * Eliminar una propiedad
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
