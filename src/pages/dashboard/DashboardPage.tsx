import React from 'react';
import { Card, CardHeader, CardBody } from '../../components/ui';
import { Building2, Users, Handshake, TrendingUp } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Bienvenido a tu CRM Inmobiliario</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Propiedades</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">24</p>
              <p className="text-sm text-green-600 mt-1">+12% este mes</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg">
              <Building2 className="w-8 h-8 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Leads</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">145</p>
              <p className="text-sm text-green-600 mt-1">+8% este mes</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Deals Activos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">32</p>
              <p className="text-sm text-green-600 mt-1">+15% este mes</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Handshake className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">$1.2M</p>
              <p className="text-sm text-green-600 mt-1">+20% este mes</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Additional content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Actividad Reciente
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-500 text-center py-8">
              Contenido próximamente...
            </p>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              Próximas Tareas
            </h3>
          </CardHeader>
          <CardBody>
            <p className="text-gray-500 text-center py-8">
              Contenido próximamente...
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
