import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

// Types and Schemas

export interface SystemHealthData {
  status: string;
  timestamp: string;
  services: {
    postgres: 'connected' | 'disconnected';
    redis: 'connected' | 'disconnected';
  };
  metrics: {
    websocket_sessions: number;
    memory_usage_percent: number;
    cpu_usage_percent: number;
  };
}

export interface SystemLog {
  id: string;
  action: string;
  module?: string;
  actor_id?: string;
  actor_email?: string;
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface BusinessTenant {
  id: string;
  name: string;
  slug: string;
  industry?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlatformUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  business_id?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface GlobalWorkflow {
  id: string;
  name: string;
  business_id: string;
  business_name?: string;
  trigger_type: string;
  is_active: boolean;
  created_at: string;
}

export interface WebSocketSession {
  client_id: string;
  business_id?: string;
  user_id?: string;
  connected_at: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  description?: string;
  version: string;
  created_at: string;
  updated_at: string;
}

// ── System Health & Telemetry ───────────────────────────────

export function useAdminSystemHealth() {
  return useQuery({
    queryKey: ['admin', 'system-health'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.HEALTH);
      return response.data?.data as SystemHealthData;
    },
    refetchInterval: 10000, // Refetch health telemetry every 10s
  });
}

export function useAdminSystemLogs(limit = 100, offset = 0) {
  return useQuery({
    queryKey: ['admin', 'system-logs', limit, offset],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.LOGS, {
        params: { limit, offset },
      });
      return response.data?.data as SystemLog[];
    },
  });
}

// Toggle maintenance mode
export function useToggleMaintenance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (isActive: boolean) => {
      const response = await apiClient.post(API_ENDPOINTS.ADMIN.MAINTENANCE, {
        is_active: isActive,
      });
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'system-health'] });
    },
  });
}

// ── Business Workspace Tenants ──────────────────────────────

export function useAdminBusinesses(limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['admin', 'businesses', limit, offset],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.BUSINESSES, {
        params: { limit, offset },
      });
      return {
        data: (response.data?.data || []) as BusinessTenant[],
        total: response.data?.meta?.total || 0,
      };
    },
  });
}

export function useToggleBusinessStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (businessId: string) => {
      const response = await apiClient.post(`${API_ENDPOINTS.ADMIN.BUSINESSES}/${businessId}/toggle`);
      return response.data?.data as BusinessTenant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'businesses'] });
    },
  });
}

export function useDeleteBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (businessId: string) => {
      const response = await apiClient.delete(`${API_ENDPOINTS.ADMIN.BUSINESSES}/${businessId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'businesses'] });
    },
  });
}

export function usePurgeBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (businessId: string) => {
      const response = await apiClient.delete(`${API_ENDPOINTS.ADMIN.BUSINESSES}/${businessId}/purge`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'businesses'] });
    },
  });
}

// ── User Management ──────────────────────────────────────────

export function useAdminUsers(limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['admin', 'users', limit, offset],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.USERS, {
        params: { limit, offset },
      });
      return {
        data: (response.data?.data || []) as PlatformUser[],
        total: response.data?.meta?.total || 0,
      };
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      const response = await apiClient.post(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/role`, { role });
      return response.data?.data as PlatformUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.post(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/toggle`);
      return response.data?.data as PlatformUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.delete(`${API_ENDPOINTS.ADMIN.USERS}/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

export function usePurgeUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.delete(`${API_ENDPOINTS.ADMIN.USERS}/${userId}/purge`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

// ── Global Workflows ────────────────────────────────────────

export function useAdminGlobalWorkflows(limit = 100, offset = 0) {
  return useQuery({
    queryKey: ['admin', 'global-workflows', limit, offset],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/admin/workflows', {
        params: { limit, offset },
      });
      return {
        data: (response.data?.data || []) as GlobalWorkflow[],
        total: response.data?.meta?.total || 0,
      };
    },
  });
}

// ── WebSocket Direct Controls ────────────────────────────────

export function useWebSocketSessions() {
  return useQuery({
    queryKey: ['admin', 'websocket-sessions'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/admin/websocket/sessions');
      return (response.data?.data || []) as WebSocketSession[];
    },
    refetchInterval: 10000,
  });
}

export function useBroadcastSystemAlert() {
  return useMutation({
    mutationFn: async ({ message, eventType = 'system_alert' }: { message: string; eventType?: string }) => {
      const response = await apiClient.post('/api/v1/admin/websocket/broadcast', {
        message,
        event_type: eventType,
      });
      return response.data?.data;
    },
  });
}

// ── AI Prompt Registry & Templates ───────────────────────────

export function usePromptTemplates() {
  return useQuery({
    queryKey: ['ai', 'prompts'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/ai/prompts');
      return (response.data || []) as PromptTemplate[];
    },
  });
}

export function useCreatePromptTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; content: string; description?: string; version: string }) => {
      const response = await apiClient.post('/api/v1/ai/prompts', payload);
      return response.data as PromptTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai', 'prompts'] });
    },
  });
}

// ── Global System Settings ───────────────────────────────────

export interface SystemSettings {
  global_mfa_requirement: boolean;
  strict_password_complexity: boolean;
  idle_session_timeout: number;
  max_concurrent_sessions: number;
  admin_ip_whitelist: string;
  global_rate_limit: number;
  allowed_cors_domains: string;
  active_signing_keys_count: number;
  platform_name: string;
  contact_email: string;
  operating_region: string;
  local_currency: string;
  system_timezone: string;
  base_tax_rate: number;
  maintenance_mode: boolean;
  new_registrations: boolean;
  debug_mode: boolean;
  system_log_retention_days: number;
  database_quota_gb: number;
  database_used_gb: number;
  media_storage_quota_gb: number;
  media_storage_used_gb: number;
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/admin/settings');
      return response.data?.data as SystemSettings;
    },
  });
}

export function useUpdateAdminSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<SystemSettings>) => {
      const response = await apiClient.put('/api/v1/admin/settings', payload);
      return response.data?.data as SystemSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'system-health'] });
    },
  });
}

export interface BusinessLocation {
  business_id: string;
  name: string;
  plan: string;
  mrr: number;
  lat: number;
  lng: number;
  is_active: boolean;
}

export interface LatencyDataPoint {
  time: string;
  latency: number;
}

export interface TelemetryData {
  total_nrr: number;
  churn_rate: number;
  locations: BusinessLocation[];
  latency_metrics: {
    avg_latency: number;
    p95_latency: number;
    error_rate: number;
    latency_distribution: LatencyDataPoint[];
  };
}

export function useAdminTelemetry() {
  return useQuery({
    queryKey: ['admin', 'telemetry'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/admin/telemetry');
      return response.data?.data as TelemetryData;
    },
    refetchInterval: 15000,
  });
}


