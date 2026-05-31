export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/v1/auth/register',
    LOGIN: '/api/v1/auth/login',
    REFRESH: '/api/v1/auth/refresh',
    LOGOUT: '/api/v1/auth/logout',
    ME: '/api/v1/auth/me',
    CHANGE_PASSWORD: '/api/v1/auth/change-password',
  },
  BUSINESSES: {
    CURRENT: '/api/v1/businesses/current',
    BY_ID: (id: string) => `/api/v1/businesses/${id}`,
    BY_SLUG: (slug: string) => `/api/v1/businesses/slug/${slug}`,
  },
  CUSTOMERS: {
    BASE: '/api/v1/customers/',
    SEARCH: '/api/v1/customers/search',
    BY_ID: (id: string) => `/api/v1/customers/${id}`,
  },
  ORDERS: {
    BASE: '/api/v1/orders/',
    BY_ID: (id: string) => `/api/v1/orders/${id}`,
    STATUS: (id: string) => `/api/v1/orders/${id}/status`,
  },
  PAYMENTS: {
    INITIALIZE: '/api/v1/payments/initialize',
    VERIFY: (reference: string) => `/api/v1/payments/verify/${reference}`,
    HISTORY: '/api/v1/payments/history',
  },
  AI: {
    CHAT: '/api/v1/ai/chat',
    SUMMARY: '/api/v1/ai/summary',
    INSIGHTS: '/api/v1/ai/insights',
  },
  WORKFLOWS: {
    BASE: '/api/v1/workflows/',
    LOGS: '/api/v1/workflows/logs',
    BY_ID: (id: string) => `/api/v1/workflows/${id}`,
  },
  ADMIN: {
    HEALTH: '/api/v1/admin/system/health',
    LOGS: '/api/v1/admin/system/logs',
    MAINTENANCE: '/api/v1/admin/system/maintenance',
    BUSINESSES: '/api/v1/admin/businesses',
    USERS: '/api/v1/admin/users',
  },
  WEBSOCKET: '/api/v1/ws',
};
