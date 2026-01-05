// En desarrollo usa el proxy de Vite, en producción usa la URL completa
export const API_CONFIG = {
  BASE_URL: import.meta.env.DEV ? '' : 'https://api.grupoterranova.com.mx',
  API_VERSION: 'v1',
  TIMEOUT: 30000,
} as const;

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    REFRESH: '/api/v1/auth/refresh-token',
  },

  // Organizations
  ORGANIZATIONS: '/api/v1/organizations',

  // Users
  USERS: '/api/v1/users',

  // Properties
  PROPERTIES: '/api/v1/properties',

  // Leads
  LEADS: '/api/v1/leads',

  // Deals
  DEALS: '/api/v1/deals',

  // Contracts
  CONTRACTS: '/api/v1/contracts',

  // Developments
  DEVELOPMENTS: '/api/v1/developments',

  // Lots
  LOTS: '/api/v1/lots',

  // Reports
  REPORTS: '/api/v1/reports',

  // Commissions
  COMMISSIONS: '/api/v1/commissions',

  // Shifts
  SHIFTS: '/api/v1/shifts',
} as const;
