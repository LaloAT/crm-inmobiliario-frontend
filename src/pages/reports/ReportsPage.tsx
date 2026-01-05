import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardBody, Button } from '../../components/ui';
import { Download, Loader2, TrendingUp, Users, Building2, Home } from 'lucide-react';
import { reportService } from '../../services/report.service';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type ReportType = 'sales' | 'leads' | 'inventory' | 'development';

export const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportType>('sales');
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch Sales Report
  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ['reports', 'sales', startDate, endDate],
    queryFn: () => reportService.getSalesReport({ fromDate: startDate, toDate: endDate }),
    enabled: activeTab === 'sales',
  });

  // Fetch Leads Report
  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ['reports', 'leads', startDate, endDate],
    queryFn: () => reportService.getLeadsReport({ fromDate: startDate, toDate: endDate }),
    enabled: activeTab === 'leads',
  });

  // Fetch Inventory Report
  const { data: inventoryData, isLoading: inventoryLoading } = useQuery({
    queryKey: ['reports', 'inventory'],
    queryFn: () => reportService.getInventoryReport(),
    enabled: activeTab === 'inventory',
  });

  // Fetch Development Report (using first development ID as placeholder)
  const { data: developmentData, isLoading: developmentLoading } = useQuery({
    queryKey: ['reports', 'development'],
    queryFn: () => reportService.getDevelopmentReport('placeholder-id'),
    enabled: false, // Disabled for now since we need a specific development ID
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-MX').format(num);
  };

  const handleExport = async () => {
    try {
      let blob: Blob;
      let filename: string;

      switch (activeTab) {
        case 'sales':
          blob = await reportService.exportSalesReport({ fromDate: startDate, toDate: endDate });
          filename = `reporte-ventas-${startDate}-${endDate}.xlsx`;
          break;
        case 'leads':
          blob = await reportService.exportLeadsReport({ fromDate: startDate, toDate: endDate });
          filename = `reporte-leads-${startDate}-${endDate}.xlsx`;
          break;
        case 'inventory':
          blob = await reportService.exportInventoryReport();
          filename = `reporte-inventario-${new Date().toISOString().split('T')[0]}.xlsx`;
          break;
        case 'development':
          blob = await reportService.exportDevelopmentReport('placeholder-id');
          filename = `reporte-desarrollos-${new Date().toISOString().split('T')[0]}.xlsx`;
          break;
        default:
          return;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar:', error);
    }
  };

  const tabs = [
    { id: 'sales' as ReportType, label: 'Ventas', icon: TrendingUp },
    { id: 'leads' as ReportType, label: 'Leads', icon: Users },
    { id: 'inventory' as ReportType, label: 'Inventario', icon: Building2 },
    { id: 'development' as ReportType, label: 'Desarrollos', icon: Home },
  ];

  const COLORS = ['#1e40af', '#2563eb', '#7c3aed', '#16a34a', '#ea580c', '#dc2626'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
          <p className="text-gray-500 mt-1">
            Analiza el desempeño de tu negocio
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Exportar a Excel
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicial
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Final
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          {salesLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : salesData ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <p className="text-sm font-medium text-gray-600">Total de Ventas</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatCurrency(salesData.totalRevenue)}
                  </p>
                </Card>
                <Card className="p-6">
                  <p className="text-sm font-medium text-gray-600">Número de Transacciones</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatNumber(salesData.totalSales)}
                  </p>
                </Card>
                <Card className="p-6">
                  <p className="text-sm font-medium text-gray-600">Ticket Promedio</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatCurrency(salesData.averageTicket)}
                  </p>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales by Month */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Ventas por Mes
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={salesData.salesByMonth as unknown as { month: string; totalRevenue: number }[]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="totalRevenue"
                          stroke="#1e40af"
                          strokeWidth={2}
                          name="Ventas"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>

                {/* Sales by Agent */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Ventas por Agente
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesData.salesByAgent as unknown as { agentName: string; totalRevenue: number }[]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="agentName" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Bar dataKey="totalRevenue" fill="#1e40af" name="Ventas" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay datos disponibles</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'leads' && (
        <div className="space-y-6">
          {leadsLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : leadsData ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatNumber(leadsData.totalLeads)}
                  </p>
                </Card>
                <Card className="p-6">
                  <p className="text-sm font-medium text-gray-600">Leads Convertidos</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatNumber(leadsData.convertedLeads)}
                  </p>
                </Card>
                <Card className="p-6">
                  <p className="text-sm font-medium text-gray-600">Tasa de Conversión</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {leadsData.conversionRate.toFixed(1)}%
                  </p>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Leads by Source */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Leads por Fuente
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={leadsData.leadsBySource as unknown as { name: string; count: number }[]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {(leadsData.leadsBySource as unknown as { name: string; count: number }[]).map((_item, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>

                {/* Leads by Status */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Leads por Estado
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={leadsData.leadsByStatus as unknown as { status: string; count: number }[]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#2563eb" name="Cantidad" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay datos disponibles</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {inventoryLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : inventoryData ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6">
                  <p className="text-sm font-medium text-gray-600">Total de Propiedades</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatNumber(inventoryData.totalProperties)}
                  </p>
                </Card>
                <Card className="p-6">
                  <p className="text-sm font-medium text-gray-600">Disponibles</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {formatNumber(inventoryData.availableProperties)}
                  </p>
                </Card>
                <Card className="p-6">
                  <p className="text-sm font-medium text-gray-600">Vendidas</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {formatNumber(inventoryData.soldProperties)}
                  </p>
                </Card>
                <Card className="p-6">
                  <p className="text-sm font-medium text-gray-600">Rentadas</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">
                    {formatNumber(inventoryData.rentedProperties)}
                  </p>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Properties by Type */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Propiedades por Tipo
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={inventoryData.propertiesByType as unknown as { name: string; count: number }[]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="count"
                        >
                          {(inventoryData.propertiesByType as unknown as { name: string; count: number }[]).map((_item, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>

                {/* Properties by Status */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Propiedades por Estado
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={inventoryData.propertiesByStatus as unknown as { status: string; count: number }[]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#7c3aed" name="Cantidad" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>
              </div>

              {/* Value Summary */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Valor Total del Inventario
                  </h3>
                </CardHeader>
                <CardBody>
                  <p className="text-4xl font-bold text-gray-900">
                    {formatCurrency(inventoryData.totalInventoryValue)}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Valor promedio por propiedad: {formatCurrency(inventoryData.averagePrice)}
                  </p>
                </CardBody>
              </Card>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay datos disponibles</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'development' && (
        <div className="space-y-6">
          {developmentLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : developmentData ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <p className="text-sm font-medium text-gray-600">Desarrollo</p>
                  <p className="text-xl font-bold text-gray-900 mt-2">
                    {developmentData.developmentName}
                  </p>
                </Card>
                <Card className="p-6">
                  <p className="text-sm font-medium text-gray-600">Total de Lotes</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatNumber(developmentData.totalLots)}
                  </p>
                </Card>
                <Card className="p-6">
                  <p className="text-sm font-medium text-gray-600">Lotes Vendidos</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatNumber(developmentData.soldLots)}
                  </p>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ventas por Mes */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Ventas por Mes
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={developmentData.salesByMonth as unknown as { periodLabel: string; revenue: number }[]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="periodLabel" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#1e40af"
                          strokeWidth={2}
                          name="Ingresos"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>

                {/* Lotes por Bloque */}
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Lotes por Bloque
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={developmentData.lotsByBlock as unknown as { block: string; totalLots: number; sold: number }[]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="block" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="totalLots" fill="#94a3b8" name="Total" />
                        <Bar dataKey="sold" fill="#16a34a" name="Vendidos" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardBody>
                </Card>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay datos disponibles</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
