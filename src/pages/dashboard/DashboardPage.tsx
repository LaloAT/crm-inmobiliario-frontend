import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardBody } from '../../components/ui';
import { Building2, Users, Handshake, TrendingUp, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { dashboardService } from '../../services/dashboard.service';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Obtener datos completos del dashboard
  const { data: dashboard, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getDashboard,
    refetchInterval: 60000, // Refrescar cada minuto
  });

  // Extraer datos del dashboard con valores por defecto
  const stats = dashboard || {
    totalProperties: 0,
    totalLeads: 0,
    totalDeals: 0,
    totalRevenue: 0,
    propertiesAvailable: 0,
    propertiesSold: 0,
    propertiesRented: 0,
    newLeadsThisMonth: 0,
    convertedLeadsThisMonth: 0,
    dealsInProgress: 0,
    dealsWonThisMonth: 0,
    revenueThisMonth: 0,
    commissionsPending: 0,
    recentActivities: [],
    topAgents: [],
    propertyByType: [],
    leadsBySource: [],
  };
  const activities = dashboard?.recentActivities || [];

  // Calcular porcentajes reales basados en datos del API
  const calcPercent = (part: number, total: number): number | null => {
    if (total <= 0) return null;
    return Math.round((part / total) * 1000) / 10;
  };

  const leadsChange = calcPercent(stats.newLeadsThisMonth, stats.totalLeads);
  const dealsChange = calcPercent(stats.dealsWonThisMonth, stats.totalDeals);
  const revenueChange = calcPercent(stats.revenueThisMonth, stats.totalRevenue);

  // Formatear números
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-MX').format(num);
  };

  // Formatear moneda
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(num);
  };

  // Formatear tiempo relativo
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return time.toLocaleDateString('es-MX');
  };

  // Obtener icono según el tipo de actividad
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'property':
        return <Building2 className="w-5 h-5 text-primary-600" />;
      case 'lead':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'deal':
        return <Handshake className="w-5 h-5 text-purple-600" />;
      default:
        return <TrendingUp className="w-5 h-5 text-gray-600" />;
    }
  };

  // Componente para mostrar el cambio porcentual (o nada si no hay datos)
  const PercentChange: React.FC<{ value: number | null; label?: string }> = ({ value, label = 'este mes' }) => {
    if (value === null) return null;
    return (
      <div className="flex items-center mt-1">
        {value >= 0 ? (
          <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
        ) : (
          <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
        )}
        <p className={`text-sm ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {Math.abs(value)}% {label}
        </p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error al cargar las estadísticas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Bienvenido, {user?.fullName || user?.firstName}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Propiedades */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Propiedades</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatNumber(stats.totalProperties)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatNumber(stats.propertiesAvailable)} disponibles
              </p>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg">
              <Building2 className="w-8 h-8 text-primary-600" />
            </div>
          </div>
        </Card>

        {/* Leads */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Leads</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatNumber(stats.totalLeads)}
              </p>
              <PercentChange value={leadsChange} label="nuevos este mes" />
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Deals Activos */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Deals Activos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatNumber(stats.totalDeals)}
              </p>
              <PercentChange value={dealsChange} label="cerrados este mes" />
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Handshake className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </Card>

        {/* Ingresos */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(stats.totalRevenue)}
              </p>
              <PercentChange value={revenueChange} label="este mes" />
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparación de Métricas */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Resumen de Métricas
            </h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: 'Propiedades', value: stats.totalProperties, color: '#1e40af' },
                  { name: 'Leads', value: stats.totalLeads, color: '#2563eb' },
                  { name: 'Deals', value: stats.totalDeals, color: '#7c3aed' },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1e40af" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Actividad del Mes - reemplaza el pie chart de datos mock */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Actividad del Mes
            </h3>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: 'Leads Nuevos', value: stats.newLeadsThisMonth },
                  { name: 'Leads Convertidos', value: stats.convertedLeadsThisMonth },
                  { name: 'Deals Cerrados', value: stats.dealsWonThisMonth },
                  { name: 'Propiedades Vendidas', value: stats.propertiesSold },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  <Cell fill="#2563eb" />
                  <Cell fill="#16a34a" />
                  <Cell fill="#7c3aed" />
                  <Cell fill="#ea580c" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Additional content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Resumen Rápido
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Propiedades disponibles</span>
                <span className="font-semibold text-gray-900">{formatNumber(stats.propertiesAvailable)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Propiedades vendidas</span>
                <span className="font-semibold text-gray-900">{formatNumber(stats.propertiesSold)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Leads nuevos este mes</span>
                <span className="font-semibold text-gray-900">{formatNumber(stats.newLeadsThisMonth)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Leads convertidos este mes</span>
                <span className="font-semibold text-gray-900">{formatNumber(stats.convertedLeadsThisMonth)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Deals en negociación</span>
                <span className="font-semibold text-gray-900">{formatNumber(stats.dealsInProgress)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Deals cerrados este mes</span>
                <span className="font-semibold text-gray-900">{formatNumber(stats.dealsWonThisMonth)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">Ingresos del mes</span>
                <span className="font-semibold text-gray-900">{formatCurrency(stats.revenueThisMonth)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Comisiones pendientes</span>
                <span className="font-semibold text-gray-900">{formatNumber(stats.commissionsPending)}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Actividad Reciente
            </h3>
          </CardHeader>
          <CardBody>
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  No hay actividades recientes
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Las actividades aparecerán aquí cuando haya cambios
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b last:border-b-0 last:pb-0">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
