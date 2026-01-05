import axiosInstance from '../config/axios.config';
import type { DashboardStats, RecentActivity } from '../types/dashboard.types';

export const dashboardService = {
  /**
   * Obtener estadísticas del dashboard
   */
  getStats: async (): Promise<DashboardStats> => {
    try {
      // Hacer peticiones en paralelo para obtener conteos
      const [propertiesRes, leadsRes, dealsRes] = await Promise.all([
        axiosInstance.get('/api/v1/properties'),
        axiosInstance.get('/api/v1/leads'),
        axiosInstance.get('/api/v1/deals'),
      ]);

      // Manejar diferentes estructuras de respuesta del backend
      const getArrayFromResponse = (response: any) => {
        if (!response.data) return [];
        // Si es un array directamente
        if (Array.isArray(response.data)) return response.data;
        // Si está dentro de una propiedad 'data' o 'items'
        if (Array.isArray(response.data.data)) return response.data.data;
        if (Array.isArray(response.data.items)) return response.data.items;
        // Si es un objeto único, convertirlo en array
        if (typeof response.data === 'object') return [response.data];
        return [];
      };

      const properties = getArrayFromResponse(propertiesRes);
      const leads = getArrayFromResponse(leadsRes);
      const deals = getArrayFromResponse(dealsRes);

      // Calcular estadísticas basadas en los datos
      const totalProperties = properties.length;
      const totalLeads = leads.length;
      const totalDeals = deals.length;

      // Calcular ingresos totales de deals ganados
      const totalRevenue = deals
        .filter((deal: any) => deal.stage === 6) // WON = 6
        .reduce((sum: number, deal: any) => sum + (deal.value || 0), 0);

      // Por ahora, porcentajes de cambio simulados (se calcularían comparando con mes anterior)
      return {
        totalProperties,
        totalLeads,
        totalDeals,
        totalRevenue,
        propertiesChange: 12,
        leadsChange: 8,
        dealsChange: 15,
        revenueChange: 20,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Retornar datos por defecto en caso de error
      return {
        totalProperties: 0,
        totalLeads: 0,
        totalDeals: 0,
        totalRevenue: 0,
        propertiesChange: 0,
        leadsChange: 0,
        dealsChange: 0,
        revenueChange: 0,
      };
    }
  },

  /**
   * Obtener actividades recientes
   */
  getRecentActivities: async (): Promise<RecentActivity[]> => {
    try {
      // Helper para extraer arrays de respuestas
      const getArrayFromResponse = (response: any) => {
        if (!response.data) return [];
        if (Array.isArray(response.data)) return response.data;
        if (Array.isArray(response.data.data)) return response.data.data;
        if (Array.isArray(response.data.items)) return response.data.items;
        if (typeof response.data === 'object') return [response.data];
        return [];
      };

      // Obtener datos recientes en paralelo
      const [propertiesRes, leadsRes, dealsRes] = await Promise.all([
        axiosInstance.get('/api/v1/properties?limit=3'),
        axiosInstance.get('/api/v1/leads?limit=3'),
        axiosInstance.get('/api/v1/deals?limit=3'),
      ]);

      const activities: RecentActivity[] = [];

      const properties = getArrayFromResponse(propertiesRes);
      const leads = getArrayFromResponse(leadsRes);
      const deals = getArrayFromResponse(dealsRes);

      // Agregar propiedades recientes
      properties.slice(0, 2).forEach((property: any) => {
        activities.push({
          id: property.id,
          type: 'property',
          title: `Nueva propiedad: ${property.title || 'Sin título'}`,
          description: property.address || 'Sin dirección',
          timestamp: property.createdAt || new Date().toISOString(),
        });
      });

      // Agregar leads recientes
      leads.slice(0, 2).forEach((lead: any) => {
        activities.push({
          id: lead.id,
          type: 'lead',
          title: `Nuevo lead: ${lead.firstName} ${lead.lastName}`,
          description: lead.email || 'Sin email',
          timestamp: lead.createdAt || new Date().toISOString(),
        });
      });

      // Agregar deals recientes
      deals.slice(0, 1).forEach((deal: any) => {
        activities.push({
          id: deal.id,
          type: 'deal',
          title: `Deal actualizado: ${deal.title || 'Sin título'}`,
          description: `Valor: $${deal.value || 0}`,
          timestamp: deal.updatedAt || new Date().toISOString(),
        });
      });

      // Ordenar por fecha más reciente
      activities.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return activities.slice(0, 5); // Retornar las 5 más recientes
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  },
};
