'use client';

import { useAdminSystemHealth, useAdminSystemLogs, useWebSocketSessions } from '@/hooks/useAdmin';
import { Clock, Users, ShieldCheck, Activity, Server, Database, Search, RefreshCw } from 'lucide-react';

export default function SystemTelemetry() {
  const { data: health, isLoading: isHealthLoading, refetch: refetchHealth } = useAdminSystemHealth();
  const { data: systemLogs, isLoading: isLogsLoading, refetch: refetchLogs } = useAdminSystemLogs(50, 0);
  const { data: wsSessions } = useWebSocketSessions();

  const handleRefresh = () => {
    refetchHealth();
    refetchLogs();
  };

  // Live values
  const activeWSClients = wsSessions !== undefined ? wsSessions.length : (health?.metrics?.websocket_sessions !== undefined ? health.metrics.websocket_sessions : null);
  const cpuPercent = health?.metrics?.cpu_usage_percent !== undefined ? Math.round(health.metrics.cpu_usage_percent) : null;
  const memoryPercent = health?.metrics?.memory_usage_percent !== undefined ? Math.round(health.metrics.memory_usage_percent) : null;
  const pgStatus = health?.services?.postgres || null;
  const redisStatus = health?.services?.redis || null;

  const hasLogsData = systemLogs && systemLogs.length > 0;
  const logsList = hasLogsData
    ? systemLogs.map((log) => {
        const time = log.created_at ? new Date(log.created_at).toLocaleTimeString() : '—';
        let level = 'INFO';
        if (log.action.includes('error') || log.action.includes('failed') || log.action.includes('delete') || log.action.includes('purge')) {
          level = 'ERR';
        } else if (log.action.includes('toggle') || log.action.includes('update') || log.action.includes('role')) {
          level = 'WARN';
        }
        return {
          timestamp: time,
          level,
          message: `${log.action.toUpperCase()} | Module: ${log.module} | Actor ID: ${log.actor_id || 'System'} | IP: ${log.ip_address || 'Internal'}`,
        };
      })
    : [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">System Telemetry</h2>
            <span className="bg-success/10 border border-success/35 text-success text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-widest flex items-center">
              <span className={`w-1 h-1 rounded-full mr-1.5 ${health?.status === 'healthy' ? 'bg-success animate-ping' : 'bg-warning'}`} />
              SYSTEM {health?.status === 'healthy' ? 'NOMINAL' : health?.status ? health.status.toUpperCase() : 'UNKNOWN'}
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">Real-time telemetry, server compute metrics, and compliance error logs stream.</p>
        </div>
        
        <div className="flex items-center space-x-3 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search logs/metrics..."
              className="bg-slate-950/40 border border-white/5 text-[11px] text-text-primary placeholder:text-text-muted pl-8 pr-3 py-1.5 rounded focus:outline-none focus:border-primary/50 text-white w-48"
            />
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 bg-slate-900 border border-white/5 text-text-secondary hover:text-white rounded hover:bg-white/5 cursor-pointer transition-colors"
            title="Refresh System Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Telemetry Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        
        {/* Latency */}
        <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-5 flex flex-col justify-between h-32 hover:border-white/10 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Avg Latency (Global)</span>
            <div className="p-1.5 rounded-custom-sm bg-warning/5 border border-warning/10 text-warning">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white tracking-wide">—</h3>
            <span className="text-[9px] text-text-muted mt-1.5 block">Endpoint not connected (null)</span>
          </div>
        </div>

        {/* Active WS Connections */}
        <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-5 flex flex-col justify-between h-32 hover:border-white/10 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Active Connections</span>
            <div className="p-1.5 rounded-custom-sm bg-primary/5 border border-primary/10 text-primary">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white tracking-wide">
              {activeWSClients !== null ? activeWSClients.toLocaleString() : '—'}
            </h3>
            <span className="text-[9px] text-success mt-1.5 block">Active WebSocket clients</span>
          </div>
        </div>

        {/* Error Rate */}
        <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-5 flex flex-col justify-between h-32 hover:border-white/10 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Error Rate (1h)</span>
            <div className="p-1.5 rounded-custom-sm bg-danger/5 border border-danger/10 text-danger">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white tracking-wide">—</h3>
            <span className="text-[9px] text-text-muted mt-1.5 block">Metrics endpoint offline (null)</span>
          </div>
        </div>

        {/* Cluster Health */}
        <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-5 flex flex-col justify-between h-32 hover:border-white/10 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Cluster Health</span>
            <div className="p-1.5 rounded-custom-sm bg-success/5 border border-success/10 text-success">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white tracking-wide uppercase">
              {pgStatus === 'connected' && redisStatus === 'connected' ? 'Healthy' : 'Degraded'}
            </h3>
            <span className="text-[9px] text-success mt-1.5 block">Postgres & Redis connected</span>
          </div>
        </div>
      </div>

      {/* Latency and Resource Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Latency Distribution graph placeholder */}
        <div className="lg:col-span-8 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 flex flex-col select-none">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">API Latency Distribution</h3>
          </div>

          <div className="flex-1 min-h-[200px] flex flex-col items-center justify-center bg-slate-950/20 rounded border border-white/5 p-6">
            <Clock className="w-8 h-8 text-text-muted mb-2 opacity-50" />
            <p className="text-xs text-white font-semibold uppercase tracking-wider">Latency Stream Offline</p>
            <p className="text-[10px] text-text-secondary max-w-sm text-center mt-1">
              Hourly latency distribution tracking endpoint is not connected (null). Latency curves cannot be populated.
            </p>
          </div>
        </div>

        {/* Compute Usage and Memory Load */}
        <div className="lg:col-span-4 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 flex flex-col justify-between select-none">
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Core Compute CPU</h3>
              <Server className="w-4.5 h-4.5 text-primary" />
            </div>

            {/* Circular Load Meter */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-28 h-28 flex items-center justify-center border-4 border-slate-950 bg-slate-950/40 rounded-full shadow-[0_0_20px_rgba(0,245,255,0.05)]">
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse" />
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-white font-mono tracking-wide">
                    {cpuPercent !== null ? `${cpuPercent}%` : '—'}
                  </span>
                  <span className="text-[8px] font-bold text-text-muted uppercase tracking-widest mt-0.5">CPU LOAD</span>
                </div>
              </div>
            </div>

            {/* Memory breakdown progress lists */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] uppercase font-bold text-text-secondary">
                  <span>Redis Cache Memory</span>
                  <span className="font-mono text-white">—</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 border border-white/5 opacity-50" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] uppercase font-bold text-text-secondary">
                  <span>Postgres Database Memory</span>
                  <span className="font-mono text-white">—</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 border border-white/5 opacity-50" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] uppercase font-bold text-text-secondary">
                  <span>Web App Server Memory</span>
                  <span className="font-mono text-white">
                    {memoryPercent !== null ? `${memoryPercent}%` : '—'}
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                  <div className="bg-primary h-full animate-pulse" style={{ width: `${memoryPercent || 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Firehose compliance log feed */}
      <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-5">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5 select-none">
          <div className="flex items-center space-x-2">
            <Database className="w-4.5 h-4.5 text-danger animate-pulse" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live SOC2 Audit Firehose (System Logs)</h3>
          </div>
        </div>

        {isLogsLoading ? (
          <div className="flex justify-center items-center py-6 text-xs text-text-muted">Loading logs...</div>
        ) : logsList.length > 0 ? (
          <div className="bg-slate-950/80 border border-white/5 rounded p-4 font-mono text-[10px] leading-relaxed text-text-secondary overflow-y-auto max-h-[200px] select-text">
            {logsList.map((log, idx) => (
              <div key={idx} className="flex py-1 border-b border-white/5 last:border-0 hover:bg-white/5 px-1 rounded transition-colors">
                <span className="text-text-muted select-none mr-4 font-bold">{log.timestamp}</span>
                <span className={`font-bold select-none mr-4 ${
                  log.level === 'ERR' 
                    ? 'text-danger' 
                    : log.level === 'WARN' 
                    ? 'text-warning' 
                    : 'text-primary'
                }`}>
                  [{log.level}]
                </span>
                <span className="flex-1 text-white/90">{log.message}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-text-muted bg-slate-950/40 rounded border border-white/5">
            No compliance log runs found on the backend system logs feed.
          </div>
        )}
      </div>

    </div>
  );
}
