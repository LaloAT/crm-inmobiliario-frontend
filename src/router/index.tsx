import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { MainLayout } from '../components/layout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Placeholder pages - se crearán después
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
    <p className="text-gray-500 mt-4">Esta página está en construcción.</p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'properties',
        element: <PlaceholderPage title="Propiedades" />,
      },
      {
        path: 'leads',
        element: <PlaceholderPage title="Leads" />,
      },
      {
        path: 'deals',
        element: <PlaceholderPage title="Deals" />,
      },
      {
        path: 'contracts',
        element: <PlaceholderPage title="Contratos" />,
      },
      {
        path: 'developments',
        element: <PlaceholderPage title="Desarrollos" />,
      },
      {
        path: 'lots',
        element: <PlaceholderPage title="Lotes" />,
      },
      {
        path: 'commissions',
        element: <PlaceholderPage title="Comisiones" />,
      },
      {
        path: 'reports',
        element: <PlaceholderPage title="Reportes" />,
      },
      {
        path: 'users',
        element: <PlaceholderPage title="Usuarios" />,
      },
      {
        path: 'shifts',
        element: <PlaceholderPage title="Turnos" />,
      },
      {
        path: 'settings',
        element: <PlaceholderPage title="Configuración" />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <p className="text-xl text-gray-600 mt-4">Página no encontrada</p>
          <a href="/" className="mt-6 inline-block text-primary-600 hover:text-primary-700">
            Volver al inicio
          </a>
        </div>
      </div>
    ),
  },
]);
