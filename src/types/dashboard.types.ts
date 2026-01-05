export interface DashboardStats {
  totalProperties: number;
  totalLeads: number;
  totalDeals: number;
  totalRevenue: number;
  propertiesChange: number;  // Porcentaje de cambio
  leadsChange: number;
  dealsChange: number;
  revenueChange: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface RecentActivity {
  id: string;
  type: 'property' | 'lead' | 'deal' | 'contract';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}
