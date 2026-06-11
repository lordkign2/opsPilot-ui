'use client';

import { useState } from 'react';
import { useAdminBusinesses, useToggleBusinessStatus, useDeleteBusiness, usePurgeBusiness } from '@/hooks/useAdmin';
import { Plus, Search, ShieldAlert, Ban, Trash2, CheckCircle2, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function TenantManagement() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const offset = (page - 1) * limit;

  // Live queries
  const { data, isLoading, refetch } = useAdminBusinesses(limit, offset);
  const toggleMutation = useToggleBusinessStatus();
  const deleteMutation = useDeleteBusiness();
  const purgeMutation = usePurgeBusiness();

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleMutation.mutateAsync(id);
      refetch();
    } catch (err) {
      console.error(err);
      alert('Failed to update business status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to soft-delete this tenant? Access for all members will be blocked.')) return;
    try {
      await deleteMutation.mutateAsync(id);
      refetch();
    } catch (err) {
      console.error(err);
      alert('Failed to delete tenant.');
    }
  };

  const handlePurge = async (id: string) => {
    if (!confirm('WARNING: This will permanently purge the workspace database, removing all data. This action is irreversible. Proceed?')) return;
    try {
      await purgeMutation.mutateAsync(id);
      refetch();
    } catch (err) {
      console.error(err);
      alert('Failed to purge tenant.');
    }
  };

  const tenantsList = data?.data
    ? data.data.map((b) => {
        let mrr = 0;
        const planLower = (b.subscription_plan || 'free').toLowerCase();
        if (planLower === 'enterprise') mrr = 120000;
        else if (planLower === 'growth') mrr = 450000;
        else if (planLower === 'starter') mrr = 15000;

        return {
          id: b.id,
          name: b.name,
          slug: b.slug,
          industry: b.industry || 'General',
          mrr,
          created_at: b.created_at ? new Date(b.created_at).toISOString().split('T')[0] : 'N/A',
          is_active: b.is_active,
          plan: b.subscription_plan || 'free',
        };
      })
    : [];

  const totalCount = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Tenant Management</h2>
              <span className="bg-warning/10 border border-warning/30 text-warning text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {totalCount} Active
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1">Manage, impersonate, and audit registered businesses on the infrastructure.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <select className="bg-slate-900 border border-white/5 px-3 py-2 rounded text-xs text-text-secondary select-none font-semibold cursor-pointer">
            <option>All Plans</option>
            <option>Enterprise</option>
            <option>Growth</option>
            <option>Starter</option>
          </select>
          <select className="bg-slate-900 border border-white/5 px-3 py-2 rounded text-xs text-text-secondary select-none font-semibold cursor-pointer">
            <option>All Statuses</option>
            <option>Active</option>
            <option>Suspended</option>
          </select>

          <Button variant="primary" className="flex items-center space-x-2 py-2 text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.05)]">
            <Plus className="w-4 h-4 text-slate-950 stroke-[3px]" />
            <span>New Tenant</span>
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg overflow-hidden shadow-2xl">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 text-warning animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-text-muted text-[10px] uppercase font-bold tracking-wider bg-slate-950/20 select-none">
                  <th className="px-6 py-4">Business Name</th>
                  <th className="px-6 py-4">Plan</th>
                  <th className="px-6 py-4">MRR (₦)</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenantsList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-text-muted select-none">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <AlertCircle className="w-8 h-8 text-text-muted" />
                        <span className="text-sm font-semibold">No tenants found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tenantsList.map((tenant) => (
                    <tr key={tenant.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-all select-none">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-sm tracking-wide">{tenant.name}</span>
                          <span className="text-[10px] text-text-muted font-mono mt-0.5">ID: {tenant.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-text-primary capitalize">{tenant.plan}</td>
                      <td className="px-6 py-4 font-mono text-white font-bold">₦ {tenant.mrr.toLocaleString()}</td>
                      <td className="px-6 py-4 font-mono text-text-secondary">{tenant.created_at}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center text-[9px] font-extrabold px-2.5 py-0.5 rounded border uppercase tracking-widest ${
                          tenant.is_active
                            ? 'bg-success/15 border-success/30 text-success'
                            : 'bg-danger/15 border-danger/30 text-danger'
                        }`}>
                          <span className={`w-1 h-1 rounded-full mr-1.5 ${tenant.is_active ? 'bg-success animate-ping' : 'bg-danger'}`} />
                          {tenant.is_active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2.5">
                          <button
                            onClick={() => handleToggleStatus(tenant.id)}
                            disabled={toggleMutation.isPending}
                            className={`p-1.5 rounded transition-all cursor-pointer ${
                              tenant.is_active 
                                ? 'text-text-secondary hover:text-danger hover:bg-danger/10'
                                : 'text-text-secondary hover:text-success hover:bg-success/10'
                            }`}
                            title={tenant.is_active ? 'Suspend Workspace' : 'Activate Workspace'}
                          >
                            {tenant.is_active ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => handleDelete(tenant.id)}
                            disabled={deleteMutation.isPending}
                            className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/10 rounded transition-all cursor-pointer"
                            title="Soft Delete Tenant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handlePurge(tenant.id)}
                            disabled={purgeMutation.isPending}
                            className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/15 border border-transparent hover:border-danger/30 rounded transition-all cursor-pointer"
                            title="Hard GDPR Purge"
                          >
                            <ShieldAlert className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="p-4 border-t border-white/5 bg-slate-950/20 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          <span className="text-[10px] font-bold text-text-secondary uppercase">
            Showing {offset + 1} to {Math.min(offset + limit, totalCount)} of {totalCount} entries
          </span>
          
          <div className="flex items-center space-x-2 text-xs font-semibold text-text-secondary">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-1.5 rounded border border-white/5 bg-slate-900/60 hover:text-white disabled:opacity-40 disabled:hover:text-text-secondary cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages || 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx + 1)}
                className={`w-7 h-7 rounded border transition-colors cursor-pointer ${
                  page === idx + 1
                    ? 'bg-warning border-warning text-slate-950 font-extrabold shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                    : 'border-white/5 bg-slate-900/40 hover:text-white'
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages || totalPages === 0}
              className="p-1.5 rounded border border-white/5 bg-slate-900/60 hover:text-white disabled:opacity-40 disabled:hover:text-text-secondary cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
