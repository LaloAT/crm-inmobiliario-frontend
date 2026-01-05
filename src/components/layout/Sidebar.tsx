import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCircle,
  Handshake,
  FileText,
  MapPin,
  Grid3x3,
  BarChart3,
  DollarSign,
  Clock,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Propiedades', path: '/properties', icon: Building2 },
  { name: 'Leads', path: '/leads', icon: Users },
  { name: 'Deals', path: '/deals', icon: Handshake },
  { name: 'Contratos', path: '/contracts', icon: FileText },
  { name: 'Desarrollos', path: '/developments', icon: MapPin },
  { name: 'Lotes', path: '/lots', icon: Grid3x3 },
  { name: 'Comisiones', path: '/commissions', icon: DollarSign },
  { name: 'Reportes', path: '/reports', icon: BarChart3 },
  { name: 'Usuarios', path: '/users', icon: UserCircle },
  { name: 'Turnos', path: '/shifts', icon: Clock },
  { name: 'Configuración', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  return (
    <aside
      className={`
        bg-white border-r border-gray-200
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        fixed left-0 top-0 h-screen z-30
        flex flex-col
      `}
    >
      {/* Logo y toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Building2 className="w-8 h-8 text-primary-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">CRM</h1>
              <p className="text-xs text-gray-500">Terranova</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <Building2 className="w-8 h-8 text-primary-600 mx-auto" />
        )}
        <button
          onClick={onToggle}
          className={`
            p-1.5 rounded-lg hover:bg-gray-100 transition-colors
            ${isCollapsed ? 'absolute right-2' : ''}
          `}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-3 py-2.5 rounded-lg
                  transition-colors duration-200
                  ${isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? item.name : ''}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.name}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            v1.0.0 &copy; {new Date().getFullYear()}
          </p>
        </div>
      )}
    </aside>
  );
};
