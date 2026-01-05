import axiosInstance from '../config/axios.config';
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  Subordinate,
  UserFilters,
  UserPaginatedResponse,
} from '../types/user.types';

export const userService = {
  /**
   * Obtener todos los usuarios con filtros
   */
  getAll: async (filters?: UserFilters): Promise<UserPaginatedResponse> => {
    try {
      const response = await axiosInstance.get('/api/v1/users', {
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
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Obtener un usuario por ID
   */
  getById: async (id: string): Promise<User> => {
    try {
      const response = await axiosInstance.get(`/api/v1/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo usuario
   */
  create: async (data: CreateUserDto): Promise<User> => {
    try {
      const response = await axiosInstance.post('/api/v1/users', data);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Actualizar un usuario
   */
  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    try {
      const response = await axiosInstance.put(`/api/v1/users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Eliminar un usuario
   */
  delete: async (id: string): Promise<void> => {
    try {
      await axiosInstance.delete(`/api/v1/users/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  /**
   * Obtener subordinados de un usuario
   */
  getSubordinates: async (id: string): Promise<Subordinate[]> => {
    try {
      const response = await axiosInstance.get(`/api/v1/users/${id}/subordinates`);
      return response.data.items || response.data || [];
    } catch (error) {
      console.error('Error fetching subordinates:', error);
      throw error;
    }
  },
};
