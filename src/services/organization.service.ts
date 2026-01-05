import axiosInstance from '../config/axios.config';
import type {
  Organization,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationFilters,
  OrganizationPaginatedResponse
} from '../types/organization.types';

export const organizationService = {
  /**
   * Obtener todas las organizaciones
   */
  getAll: async (filters?: OrganizationFilters): Promise<OrganizationPaginatedResponse> => {
    try {
      const response = await axiosInstance.get('/api/v1/organizations', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      throw error;
    }
  },

  /**
   * Obtener una organización por ID
   */
  getById: async (id: string): Promise<Organization> => {
    try {
      const response = await axiosInstance.get(`/api/v1/organizations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching organization:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva organización
   */
  create: async (data: CreateOrganizationDto): Promise<Organization> => {
    try {
      const response = await axiosInstance.post('/api/v1/organizations', data);
      return response.data;
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  },

  /**
   * Actualizar una organización
   */
  update: async (id: string, data: UpdateOrganizationDto): Promise<Organization> => {
    try {
      const response = await axiosInstance.put(`/api/v1/organizations/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating organization:', error);
      throw error;
    }
  },

  /**
   * Eliminar una organización
   */
  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/v1/organizations/${id}`);
    } catch (error) {
      console.error('Error deleting organization:', error);
      throw error;
    }
  },
};
