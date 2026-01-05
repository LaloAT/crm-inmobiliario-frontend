import axiosInstance from '../config/axios.config';
import type {
  DashboardDto,
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
      return response.data;
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
