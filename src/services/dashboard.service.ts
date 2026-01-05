import axiosInstance from '../config/axios.config';
import type { DashboardDto } from '../types/report.types';

export const dashboardService = {
  /**
   * Obtener estadísticas del dashboard desde el endpoint real del API
   */
  getDashboard: async (): Promise<DashboardDto> => {
    try {
      const response = await axiosInstance.get('/api/v1/reports/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error;
    }
  },
};
