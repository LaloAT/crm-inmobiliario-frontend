import axiosInstance from '../config/axios.config';
import type {
  DashboardDto,
  RecentActivity,
  SalesReportDto,
  LeadsReportDto,
  InventoryReportDto,
  DevelopmentReportDto,
  ReportFilters,
} from '../types/report.types';

export const reportService = {
  /**
   * Obtener dashboard completo
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

  /**
   * Obtener reporte de ventas
   */
  getSalesReport: async (filters?: ReportFilters): Promise<SalesReportDto> => {
    try {
      const response = await axiosInstance.get('/api/v1/reports/sales', {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales report:', error);
      throw error;
    }
  },

  /**
   * Exportar reporte de ventas a Excel
   */
  exportSalesReport: async (filters?: ReportFilters): Promise<Blob> => {
    try {
      const response = await axiosInstance.get('/api/v1/reports/sales/export', {
        params: filters,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting sales report:', error);
      throw error;
    }
  },

  /**
   * Obtener reporte de leads
   */
  getLeadsReport: async (filters?: ReportFilters): Promise<LeadsReportDto> => {
    try {
      const response = await axiosInstance.get('/api/v1/reports/leads', {
        params: filters,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching leads report:', error);
      throw error;
    }
  },

  /**
   * Exportar reporte de leads a Excel
   */
  exportLeadsReport: async (filters?: ReportFilters): Promise<Blob> => {
    try {
      const response = await axiosInstance.get('/api/v1/reports/leads/export', {
        params: filters,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting leads report:', error);
      throw error;
    }
  },

  /**
   * Obtener reporte de inventario
   */
  getInventoryReport: async (): Promise<InventoryReportDto> => {
    try {
      const response = await axiosInstance.get('/api/v1/reports/inventory');
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory report:', error);
      throw error;
    }
  },

  /**
   * Exportar reporte de inventario a Excel
   */
  exportInventoryReport: async (): Promise<Blob> => {
    try {
      const response = await axiosInstance.get('/api/v1/reports/inventory/export', {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting inventory report:', error);
      throw error;
    }
  },

  /**
   * Obtener reporte de un desarrollo específico
   */
  getDevelopmentReport: async (developmentId: string): Promise<DevelopmentReportDto> => {
    try {
      const response = await axiosInstance.get(`/api/v1/reports/developments/${developmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching development report:', error);
      throw error;
    }
  },

  /**
   * Exportar reporte de desarrollo a Excel
   */
  exportDevelopmentReport: async (developmentId: string): Promise<Blob> => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/reports/developments/${developmentId}/export`,
        {
          responseType: 'blob',
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error exporting development report:', error);
      throw error;
    }
  },

  /**
   * Helper para descargar un archivo blob
   */
  downloadBlob: (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
