import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export function useAIRecommendations() {
  return useQuery({
    queryKey: ['ai-recommendations'],
    queryFn: async () => {
      const response = await apiClient.post(`${API_ENDPOINTS.AI.CHAT.replace('/chat', '')}/recommendations`);
      return response.data.data;
    },
  });
}

export function useAISummary(timeframe = 'week') {
  return useQuery({
    queryKey: ['ai-summary', timeframe],
    queryFn: async () => {
      const response = await apiClient.post(`${API_ENDPOINTS.AI.CHAT.replace('/chat', '')}/summary`, {
        timeframe,
      });
      return response.data.data;
    },
  });
}
