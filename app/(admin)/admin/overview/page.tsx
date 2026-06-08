'use client';

import { useAdminSystemHealth, useAdminBusinesses } from '@/hooks/useAdmin';
import { Shield, Activity, Calendar, Download, RefreshCw, Layers, Building, Cpu, Database } from 'lucide-react';

export default function PlatformOverview() {
  const { data: health, isLoading: isHealthLoading, refetch: refetchHealth } = useAdminSystemHealth();
  const { data: businesses, isLoading: isBizLoading } = useAdminBusinesses(1, 0);

  const activeBusinessesCount = businesses?.total ?? null;

  const handleRefresh = () => {
    refetchHealth();
  };

  const cpuPercent = health?.metrics?.cpu_usage_percent !== undefined ? Math.round(health.metrics.cpu_usage_percent) : null;
  const memoryPercent = health?.metrics?.memory_usage_percent !== undefined ? Math.round(health.metrics.memory_usage_percent) : null;
  const dbStatus = health?.services?.postgres || null;

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Platform Overview</h2>
          <p className="text-xs text-text-secondary mt-1">Real-time global metrics for the OpsPilot infrastructure.</p>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleRefresh}
            className="p-2 bg-slate-900 border border-white/5 text-text-secondary hover:text-white rounded hover:bg-white/5 cursor-pointer transition-colors"
            title="Force refresh status"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-2 bg-slate-900 border border-white/5 px-3 py-2 rounded text-xs text-text-secondary select-none font-semibold">
            <Calendar className="w-3.5 h-3.5 text-warning" />
            <span>Last 30 Days</span>
          </div>

          <button className="flex items-center space-x-2 bg-warning/10 border border-warning/20 hover:bg-warning/15 px-3 py-2 rounded text-xs font-bold text-warning cursor-pointer transition-colors shadow-[0_0_15px_rgba(245,158,11,0.05)]">
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Real-time Infrastructure Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        
        {/* NRR Card */}
        <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-5 flex flex-col justify-between h-32 hover:border-white/10 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Total NRR</span>
            <div className="p-1.5 rounded-custom-sm bg-warning/5 border border-warning/10 text-warning">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white tracking-wide">—</h3>
            <span className="text-[9px] text-text-muted mt-1.5 block">Endpoint not connected (null)</span>
          </div>
        </div>

        {/* Active Businesses Tenant Card */}
        <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-5 flex flex-col justify-between h-32 hover:border-white/10 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Active Businesses</span>
            <div className="p-1.5 rounded-custom-sm bg-primary/5 border border-primary/10 text-primary">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white tracking-wide">
              {isBizLoading ? '...' : activeBusinessesCount !== null ? activeBusinessesCount : '—'}
            </h3>
            <span className="text-[9px] text-success mt-1.5 block">Calculated from business tenants</span>
          </div>
        </div>

        {/* Churn Rate Card */}
        <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-5 flex flex-col justify-between h-32 hover:border-white/10 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Churn Rate</span>
            <div className="p-1.5 rounded-custom-sm bg-danger/5 border border-danger/10 text-danger">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white tracking-wide">—</h3>
            <span className="text-[9px] text-text-muted mt-1.5 block">Endpoint not connected (null)</span>
          </div>
        </div>

        {/* System Uptime Card */}
        <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-5 flex flex-col justify-between h-32 hover:border-white/10 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">System Status</span>
            <div className="p-1.5 rounded-custom-sm bg-success/5 border border-success/10 text-success">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white tracking-wide capitalize">
              {isHealthLoading ? '...' : health?.status || '—'}
            </h3>
            <span className="text-[9px] text-success mt-1.5 block">
              {dbStatus === 'connected' ? 'All databases operational' : 'Database connection state unknown'}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Map and Metrics Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Business Density Map Placeholder */}
        <div className="lg:col-span-8 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6 select-none">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Business Density Map</h3>
            <span className="text-[9px] font-bold text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase font-mono">Nigeria</span>
          </div>

          <div className="flex-1 min-h-[300px] flex items-center justify-center bg-slate-950/20 rounded border border-white/5 overflow-hidden p-6 select-none">
            <div className="text-center space-y-2">
              <Building className="w-8 h-8 text-text-muted mx-auto opacity-50" />
              <p className="text-xs text-white font-semibold uppercase tracking-wider">Location Telemetry Offline</p>
              <p className="text-[10px] text-text-secondary max-w-xs">Geographical mapping endpoint is not connected (null). Dynamic density coordinates cannot be rendered.</p>
            </div>
          </div>
        </div>

        {/* Right Column: System Health stats */}
        <div className="lg:col-span-4 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3 select-none">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">System Health</h3>
              <Activity className="w-4 h-4 text-primary" />
            </div>

            {/* API Latency Placeholder */}
            <div className="space-y-2 mb-6 select-none">
              <div className="flex justify-between text-[11px]">
                <span className="text-text-secondary">API Latency (p95)</span>
                <span className="font-mono text-text-muted">N/A</span>
              </div>
              <div className="h-10 bg-slate-950/40 rounded border border-white/5 flex items-center justify-center text-[10px] text-text-muted">
                Latency endpoint offline (null)
              </div>
            </div>

            {/* Error Rate Placeholder */}
            <div className="space-y-2 mb-6 select-none">
              <div className="flex justify-between text-[11px]">
                <span className="text-text-secondary">Error Rate (1h)</span>
                <span className="font-mono text-text-muted">N/A</span>
              </div>
              <div className="h-10 bg-slate-950/40 rounded border border-white/5 flex items-center justify-center text-[10px] text-text-muted">
                Error rate metrics offline (null)
              </div>
            </div>

            {/* Infrastructure Loading Bars */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] uppercase font-bold text-text-secondary">
                  <span>DB Compute load (CPU)</span>
                  <span className="font-mono text-white">
                    {cpuPercent !== null ? `${cpuPercent}%` : '—'}
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className="bg-primary h-full transition-all duration-500"
                    style={{ width: `${cpuPercent || 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] uppercase font-bold text-text-secondary">
                  <span>Redis memory capacity</span>
                  <span className="font-mono text-white">
                    {memoryPercent !== null ? `${memoryPercent}%` : '—'}
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className="bg-warning h-full transition-all duration-500"
                    style={{ width: `${memoryPercent || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Chart: MRR Growth & Plan Distribution Placeholder */}
      <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 select-none">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">MRR Growth & Plan Distribution</h3>
            <span className="text-[10px] text-text-muted mt-0.5 block">Monthly recurring revenue segmented by tier</span>
          </div>
        </div>

        <div className="h-64 flex flex-col items-center justify-center border border-white/5 bg-slate-950/20 rounded p-6">
          <Database className="w-8 h-8 text-text-muted mb-2 opacity-50" />
          <p className="text-xs text-white font-semibold uppercase tracking-wider">Billing Telemetry Offline</p>
          <p className="text-[10px] text-text-secondary max-w-sm text-center mt-1">
            The global monthly recurring revenue and plan distribution analytics API endpoint is not connected (null). 
            Aggregate statistics cannot be computed.
          </p>
        </div>
      </div>

    </div>
  );
}
