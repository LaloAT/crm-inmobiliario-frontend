import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { LeadsPage } from '../pages/leads/LeadsPage';
import { PropertiesPage } from '../pages/properties/PropertiesPage';
import { DealsPage } from '../pages/deals/DealsPage';
import { DealDetailPage } from '../pages/deals/DealDetailPage';
import { ContractsPage } from '../pages/contracts/ContractsPage';
import { LettersOfInterestPage } from '../pages/lettersOfInterest/LettersOfInterestPage';
import { DevelopmentsPage } from '../pages/developments/DevelopmentsPage';
import { BuildersPage } from '../pages/builders/BuildersPage';
import { LotsPage } from '../pages/lots/LotsPage';
import { CommissionsPage } from '../pages/commissions/CommissionsPage';
import { UsersPage } from '../pages/users/UsersPage';
import { OrganizationsPage } from '../pages/organizations/OrganizationsPage';
import { ReportsPage } from '../pages/reports/ReportsPage';
import { ShiftsPage } from '../pages/shifts/ShiftsPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { MainLayout } from '../components/layout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

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
        element: <PropertiesPage />,
      },
      {
        path: 'leads',
        element: <LeadsPage />,
      },
      {
        path: 'deals',
        element: <DealsPage />,
      },
      {
        path: 'deals/:id',
        element: <DealDetailPage />,
      },
      {
        path: 'contracts',
        element: <ContractsPage />,
      },
      {
        path: 'letters-of-interest',
        element: <LettersOfInterestPage />,
      },
      {
        path: 'developments',
        element: <DevelopmentsPage />,
      },
      {
        path: 'builders',
        element: <BuildersPage />,
      },
      {
        path: 'lots',
        element: <LotsPage />,
      },
      {
        path: 'commissions',
        element: <CommissionsPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'organizations',
        element: <OrganizationsPage />,
      },
      {
        path: 'shifts',
        element: <ShiftsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
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
