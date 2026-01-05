import axiosInstance from '../config/axios.config';
import { API_ENDPOINTS } from '../config/api.config';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
} from '../types';
import { storage } from '../utils/storage';

export const authService = {
  /**
   * Login de usuario
   */
  login: async (credentials: LoginRequest): Promise<{ accessToken: string; refreshToken: string; user: any }> => {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    const { accessToken, refreshToken, userId, email, fullName, role, organizationId } = response.data;

    // Construir el objeto user a partir de la respuesta
    const user = {
      id: userId,
      email: email,
      fullName: fullName,
      firstName: fullName.split(' ')[0] || '',
      lastName: fullName.split(' ').slice(1).join(' ') || '',
      role: role,
      organizationId: organizationId,
      isActive: true,
    };

    // Guardar tokens y usuario en localStorage
    storage.setAccessToken(accessToken);
    storage.setRefreshToken(refreshToken);
    storage.setUser(user);

    return { accessToken, refreshToken, user };
  },

  /**
   * Registro de nuevo usuario
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    );

    const { accessToken, refreshToken, user } = response.data;

    // Guardar tokens y usuario en localStorage
    storage.setAccessToken(accessToken);
    storage.setRefreshToken(refreshToken);
    storage.setUser(user);

    return response.data;
  },

  /**
   * Refresh token
   */
  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = storage.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken } as RefreshTokenRequest
    );

    const { accessToken, refreshToken: newRefreshToken, user } = response.data;

    // Actualizar tokens
    storage.setAccessToken(accessToken);
    storage.setRefreshToken(newRefreshToken);
    storage.setUser(user);

    return response.data;
  },

  /**
   * Logout de usuario
   */
  logout: (): void => {
    storage.clearAll();
    window.location.href = '/login';
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated: (): boolean => {
    const token = storage.getAccessToken();
    return !!token;
  },

  /**
   * Obtener usuario actual del localStorage
   */
  getCurrentUser: () => {
    return storage.getUser();
  },
};
