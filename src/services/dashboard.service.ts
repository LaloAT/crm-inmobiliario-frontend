import axiosInstance from '../config/axios.config';
import type { DashboardDto, RecentActivity } from '../types/report.types';

export const dashboardService = {
  /**
   * Obtener estadísticas del dashboard desde el endpoint real del API
   */
  getDashboard: async (): Promise<DashboardDto> => {
    try {
      const response = await axiosInstance.get('/api/v1/reports/dashboard');
      const rawData = response.data;

      // El API devuelve { summary: {...}, recentActivities: [...] }
      const summary = rawData?.summary || {};
      const activities = rawData?.recentActivities || [];

      // Mapear actividades al formato esperado por el frontend
      const mappedActivities: RecentActivity[] = activities.map((a: any) => ({
        id: a.id || '',
        type: (a.type?.toLowerCase() || 'property') as RecentActivity['type'],
        title: a.title || a.description || '',
        description: a.description || '',
        timestamp: a.createdAt || a.timestamp || new Date().toISOString(),
        userId: a.userId,
        userName: a.userName,
      }));

      return {
        // Mapear campos de summary (nombres del API -> nombres del frontend)
        totalProperties: Number(summary.totalProperties) || 0,
        totalLeads: Number(summary.totalLeads) || 0,
        totalDeals: Number(summary.totalDeals) || 0,
        totalRevenue: Number(summary.totalSalesAmount) || 0,
        propertiesAvailable: Number(summary.availableProperties) || 0,
        propertiesSold: Number(summary.soldProperties) || 0,
        propertiesRented: Number(summary.rentedProperties) || 0,
        newLeadsThisMonth: Number(summary.newLeadsThisMonth) || 0,
        convertedLeadsThisMonth: Number(summary.convertedLeadsThisMonth) || 0,
        dealsInProgress: Number(summary.dealsInProgress) || 0,
        dealsWonThisMonth: Number(summary.dealsWonThisMonth) || 0,
        revenueThisMonth: Number(summary.revenueThisMonth) || 0,
        commissionsPending: Number(summary.commissionsPending) || 0,
        recentActivities: mappedActivities,
        topAgents: Array.isArray(rawData?.topAgents) ? rawData.topAgents : [],
        propertyByType: Array.isArray(rawData?.propertyByType) ? rawData.propertyByType : [],
        leadsBySource: Array.isArray(rawData?.leadsBySource) ? rawData.leadsBySource : [],
      };
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      throw error;
    }
  },
};
