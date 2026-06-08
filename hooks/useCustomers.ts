import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export function useCustomers(page = 1, perPage = 20) {
  return useQuery({
    queryKey: ['customers', page, perPage],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.CUSTOMERS.BASE, {
        params: { page, per_page: perPage },
      });
      // Response format contains paginated_response data: { success, data: [...], total, page, per_page }
      return response.data;
    },
  });
}

export function useSearchCustomers(query: string, page = 1, perPage = 20) {
  return useQuery({
    queryKey: ['customers', 'search', query, page, perPage],
    queryFn: async () => {
      if (!query.trim()) return null;
      const response = await apiClient.get(API_ENDPOINTS.CUSTOMERS.SEARCH, {
        params: { query, page, per_page: perPage },
      });
      return response.data;
    },
    enabled: !!query.trim(),
  });
}

export function useCustomerDetail(customerId: string | null) {
  return useQuery({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      if (!customerId) return null;
      const response = await apiClient.get(API_ENDPOINTS.CUSTOMERS.BY_ID(customerId));
      return response.data.data;
    },
    enabled: !!customerId,
  });
}

export function useCustomerInsights(customerId: string | null) {
  return useQuery({
    queryKey: ['customer-insights', customerId],
    queryFn: async () => {
      if (!customerId) return null;
      const response = await apiClient.post(`${API_ENDPOINTS.AI.CHAT.replace('/chat', '')}/customer-insights`, {
        customer_id: customerId,
      });
      return response.data.data;
    },
    enabled: !!customerId,
  });
}
