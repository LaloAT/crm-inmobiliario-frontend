// ===========================
// DASHBOARD DTO
// ===========================

export interface DashboardDto {
  // Totales generales
  totalProperties: number;
  totalLeads: number;
  totalDeals: number;
  totalRevenue: number;
  // Propiedades
  propertiesAvailable: number;
  propertiesSold: number;
  propertiesRented: number;
  // Leads
  newLeadsThisMonth: number;
  convertedLeadsThisMonth: number;
  // Deals
  dealsInProgress: number;
  dealsWonThisMonth: number;
  // Finanzas
  revenueThisMonth: number;
  commissionsPending: number;
  // Listas
  recentActivities: RecentActivity[];
  topAgents: TopAgent[];
  propertyByType: PropertyTypeStats[];
  leadsBySource: LeadSourceStats[];
}

export interface RecentActivity {
  id: string;
  type: 'property' | 'lead' | 'deal' | 'contract' | 'commission';
  title: string;
  description: string;
  userId?: string;
  userName?: string;
  timestamp: string;
}

export interface TopAgent {
  userId: string;
  userName: string;
  dealsClosed: number;
  totalRevenue: number;
  commissionsEarned: number;
}

export interface PropertyTypeStats {
  propertyType: number; // 1-8
  propertyTypeName: string;
  count: number;
  percentage: number;
}

export interface LeadSourceStats {
  source: number; // 1-7
  sourceName: string;
  count: number;
  percentage: number;
}

// ===========================
// SALES REPORT
// ===========================

export interface SalesReportDto {
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
  salesByAgent: SalesByAgent[];
  salesByMonth: SalesByPeriod[];
  salesByPropertyType: SalesByPropertyType[];
}

export interface SalesByAgent {
  agentId: string;
  agentName: string;
  totalSales: number;
  totalRevenue: number;
  averageTicket: number;
}

export interface SalesByPeriod {
  period: string; // "2024-01", "2024-02", etc
  periodLabel: string; // "Enero 2024"
  totalSales: number;
  totalRevenue: number;
}

export interface SalesByPropertyType {
  propertyType: number;
  propertyTypeName: string;
  totalSales: number;
  totalRevenue: number;
  percentage: number;
}

// ===========================
// LEADS REPORT
// ===========================

export interface LeadsReportDto {
  totalLeads: number;
  newLeads: number;
  convertedLeads: number;
  lostLeads: number;
  conversionRate: number;
  leadsBySource: LeadsBySource[];
  leadsByStatus: LeadsByStatus[];
  leadsByAgent: LeadsByAgent[];
}

export interface LeadsBySource {
  source: number;
  sourceName: string;
  count: number;
  converted: number;
  conversionRate: number;
}

export interface LeadsByStatus {
  status: number;
  statusName: string;
  count: number;
  percentage: number;
}

export interface LeadsByAgent {
  agentId: string;
  agentName: string;
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
}

// ===========================
// INVENTORY REPORT
// ===========================

export interface InventoryReportDto {
  totalProperties: number;
  availableProperties: number;
  soldProperties: number;
  rentedProperties: number;
  averagePrice: number;
  totalInventoryValue: number;
  propertiesByType: InventoryByType[];
  propertiesByStatus: InventoryByStatus[];
  propertiesByCity: InventoryByCity[];
}

export interface InventoryByType {
  propertyType: number;
  propertyTypeName: string;
  count: number;
  averagePrice: number;
  totalValue: number;
}

export interface InventoryByStatus {
  status: number;
  statusName: string;
  count: number;
  percentage: number;
}

export interface InventoryByCity {
  city: string;
  count: number;
  averagePrice: number;
  totalValue: number;
}

// ===========================
// DEVELOPMENT REPORT
// ===========================

export interface DevelopmentReportDto {
  developmentId: string;
  developmentName: string;
  totalLots: number;
  availableLots: number;
  reservedLots: number;
  soldLots: number;
  totalRevenue: number;
  averageLotPrice: number;
  salesByMonth: DevelopmentSalesByMonth[];
  lotsByBlock: LotsByBlock[];
}

export interface DevelopmentSalesByMonth {
  period: string;
  periodLabel: string;
  lotsSold: number;
  revenue: number;
}

export interface LotsByBlock {
  block: string;
  totalLots: number;
  available: number;
  reserved: number;
  sold: number;
}

// ===========================
// FILTROS PARA REPORTES
// ===========================

export interface ReportFilters {
  fromDate?: string;
  toDate?: string;
  agentId?: string;
  developmentId?: string;
  propertyType?: number;
  city?: string;
}

// ===========================
// EXPORT OPTIONS
// ===========================

export interface ExportOptions {
  format: 'excel' | 'pdf' | 'csv';
  filename?: string;
  includeCharts?: boolean;
}
