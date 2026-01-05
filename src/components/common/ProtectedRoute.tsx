import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  console.log('🛡️ ProtectedRoute: Verificando acceso...');
  console.log('  - isLoading:', isLoading);
  console.log('  - isAuthenticated:', isAuthenticated);
  console.log('  - user:', user);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    console.log('⏳ ProtectedRoute: Mostrando loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    console.log('❌ ProtectedRoute: Usuario NO autenticado, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ ProtectedRoute: Usuario autenticado, permitiendo acceso');
  // Si está autenticado, renderizar children o Outlet
  return children ? <>{children}</> : <Outlet />;
};
