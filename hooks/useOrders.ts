import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export function useOrders(page = 1, perPage = 20) {
  return useQuery({
    queryKey: ['orders', page, perPage],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ORDERS.BASE, {
        params: { page, per_page: perPage },
      });
      return response.data;
    },
  });
}

export function useOrderDetail(orderId: string | null) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      // Note: orderId might have a '#' symbol in the UI, we strip it in the route param check
      const cleanId = orderId.startsWith('#') ? orderId.slice(1) : orderId;
      // If the cleanId is not a valid uuid format, try to fetch current or check format
      const response = await apiClient.get(`${API_ENDPOINTS.ORDERS.BASE}${cleanId}`);
      return response.data.data;
    },
    enabled: !!orderId,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const cleanId = orderId.startsWith('#') ? orderId.slice(1) : orderId;
      const response = await apiClient.patch(`${API_ENDPOINTS.ORDERS.BASE}${cleanId}/status`, {
        status,
      });
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
