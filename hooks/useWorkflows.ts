import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export interface WorkflowCondition {
  field: string;
  operator: string; // 'eq', 'ne', 'gt', 'ge', 'lt', 'le', 'contains', 'is_true', 'is_false'
  value: any;
}

export interface WorkflowAction {
  type: string; // 'send_notification', 'generate_ai_message', 'send_whatsapp', 'send_email', 'create_task'
  params: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  log_depth: 'all' | 'errors_only' | 'none';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkflowExecutionLog {
  id: string;
  workflow_id: string;
  workflow_name: string;
  business_id: string;
  status: 'success' | 'failed' | 'skipped' | string;
  error_message?: string;
  created_at: string;
}

// Fetch all workflows
export function useWorkflows() {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.WORKFLOWS.BASE);
      // Response contains success_response format: { status: 'success', data: [...] }
      return (response.data?.data || []) as Workflow[];
    },
  });
}

// Fetch execution logs
export function useWorkflowLogs(offset = 0, limit = 20) {
  return useQuery({
    queryKey: ['workflow-logs', offset, limit],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.WORKFLOWS.LOGS, {
        params: { offset, limit },
      });
      return (response.data?.data || []) as WorkflowExecutionLog[];
    },
  });
}

// Create a new workflow
export function useCreateWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Workflow, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await apiClient.post(API_ENDPOINTS.WORKFLOWS.BASE, payload);
      return response.data?.data as Workflow;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}

// Update an existing workflow
export function useUpdateWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      workflowId,
      payload,
    }: {
      workflowId: string;
      payload: Partial<Omit<Workflow, 'id' | 'created_at' | 'updated_at'>>;
    }) => {
      const response = await apiClient.patch(API_ENDPOINTS.WORKFLOWS.BY_ID(workflowId), payload);
      return response.data?.data as Workflow;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
      queryClient.invalidateQueries({ queryKey: ['workflow', variables.workflowId] });
    },
  });
}

// Delete a workflow
export function useDeleteWorkflow() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workflowId: string) => {
      const response = await apiClient.delete(API_ENDPOINTS.WORKFLOWS.BY_ID(workflowId));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
}
