'use client';

import { useAdminSystemHealth, useAdminSystemLogs, useWebSocketSessions, useAdminTelemetry } from '@/hooks/useAdmin';
import { Clock, Users, ShieldCheck, Activity, Server, Database, Search, RefreshCw } from 'lucide-react';

export default function SystemTelemetry() {
  const { data: health, isLoading: isHealthLoading, refetch: refetchHealth } = useAdminSystemHealth();
  const { data: systemLogs, isLoading: isLogsLoading, refetch: refetchLogs } = useAdminSystemLogs(50, 0);
  const { data: wsSessions } = useWebSocketSessions();
  const { data: telemetry, isLoading: isTelemetryLoading, refetch: refetchTelemetry } = useAdminTelemetry();

  const handleRefresh = () => {
    refetchHealth();
    refetchLogs();
    refetchTelemetry();
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

  // Latency Metrics Bindings
  const avgLatencyVal = telemetry?.latency_metrics?.avg_latency !== undefined ? `${telemetry.latency_metrics.avg_latency}ms` : '—';
  const errorRateVal = telemetry?.latency_metrics?.error_rate !== undefined ? `${telemetry.latency_metrics.error_rate}%` : '—';
  const latencyPoints = telemetry?.latency_metrics?.latency_distribution || [];

  // SVG Chart Setup
  const svgWidth = 600;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 30;

  let pathData = '';
  let areaData = '';
  let pointsCoords: Array<{ x: number; y: number; time: string; val: number }> = [];

  if (latencyPoints.length > 0) {
    const latencies = latencyPoints.map(p => p.latency);
    const minLat = Math.min(...latencies) - 5;
    const maxLat = Math.max(...latencies) + 5;
    const range = maxLat - minLat || 1;

    pointsCoords = latencyPoints.map((p, idx) => {
      const x = paddingX + (idx * (svgWidth - paddingX * 2)) / (latencyPoints.length - 1);
      const y = svgHeight - paddingY - ((p.latency - minLat) * (svgHeight - paddingY * 2)) / range;
      return { x, y, time: p.time, val: p.latency };
    });

    pathData = `M ${pointsCoords[0].x} ${pointsCoords[0].y} ` + 
      pointsCoords.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ');

    areaData = `${pathData} L ${pointsCoords[pointsCoords.length - 1].x} ${svgHeight - paddingY} L ${pointsCoords[0].x} ${svgHeight - paddingY} Z`;
  }

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
            <h3 className="text-2xl font-extrabold text-white tracking-wide">
              {isTelemetryLoading ? '...' : avgLatencyVal}
            </h3>
            <span className="text-[9px] text-success mt-1.5 block">Global request duration average</span>
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
            <h3 className="text-2xl font-extrabold text-white tracking-wide">
              {isTelemetryLoading ? '...' : errorRateVal}
            </h3>
            <span className="text-[9px] text-success mt-1.5 block">Failed request metrics</span>
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
            <h3 className="text-2xl font-extrabold text-white tracking-wide uppercase font-sans">
              {pgStatus === 'connected' && redisStatus === 'connected' ? 'Healthy' : 'Degraded'}
            </h3>
            <span className="text-[9px] text-success mt-1.5 block">Postgres & Redis connected</span>
          </div>
        </div>
      </div>

      {/* Latency and Resource Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Latency Distribution graph */}
        <div className="lg:col-span-8 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6 select-none">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">API Latency Distribution</h3>
            <span className="text-[9px] font-bold text-primary bg-primary/5 border border-primary/10 px-2 py-0.5 rounded uppercase font-mono">Live Stream</span>
          </div>

          <div className="flex-1 min-h-[220px] flex items-center justify-center bg-slate-950/20 rounded border border-white/5 p-4 overflow-hidden relative">
            {isTelemetryLoading ? (
              <span className="text-xs text-text-muted animate-pulse uppercase tracking-wider font-mono">Rendering curves...</span>
            ) : pointsCoords.length > 0 ? (
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#00F5FF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                <line x1={paddingX} y1={(svgHeight) / 2} x2={svgWidth - paddingX} y2={(svgHeight) / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />
                <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="rgba(255,255,255,0.05)" strokeDasharray="3" />

                {/* Fill Area */}
                <path d={areaData} fill="url(#chartAreaGrad)" />

                {/* Line Path */}
                <path d={pathData} fill="none" stroke="#00F5FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Dots & Values */}
                {pointsCoords.map((c, idx) => (
                  <g key={idx} className="group/node cursor-pointer">
                    <circle cx={c.x} cy={c.y} r="4" fill="#00F5FF" stroke="#0b1120" strokeWidth="2" />
                    <circle cx={c.x} cy={c.y} r="10" fill="transparent" />
                    
                    {/* Hover tooltip values */}
                    <text x={c.x} y={c.y - 12} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle" className="opacity-0 group-hover/node:opacity-100 transition-opacity font-mono bg-slate-900 px-1 py-0.5 rounded">
                      {c.val}ms
                    </text>

                    {/* Time Label on X-axis */}
                    {idx % 2 === 0 && (
                      <text x={c.x} y={svgHeight - 10} fill="#6b7280" fontSize="8" fontWeight="bold" textAnchor="middle" className="font-mono">
                        {c.time}
                      </text>
                    )}
                  </g>
                ))}
              </svg>
            ) : (
              <span className="text-xs text-text-muted font-mono">Telemetry metric sets empty</span>
            )}
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
                  <span className="font-mono text-white">14.2%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                  <div className="bg-warning h-full opacity-80" style={{ width: '14.2%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] uppercase font-bold text-text-secondary">
                  <span>Postgres Database Memory</span>
                  <span className="font-mono text-white">28.5%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                  <div className="bg-primary h-full opacity-80" style={{ width: '28.5%' }} />
                </div>
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
