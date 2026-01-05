import axiosInstance from '../config/axios.config';
import type { User, CreateUserDto, UpdateUserDto } from '../types/user.types';

export const userService = {
  /**
   * Obtener todos los usuarios
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
  }): Promise<{ data: User[]; total: number; page: number; limit: number }> => {
    try {
      const response = await axiosInstance.get('/api/v1/users', { params });

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
      const response = await axiosInstance.patch(`/api/v1/users/${id}`, data);
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
};
