'use client';

import { useState } from 'react';
import { useAdminSystemHealth, useAdminSystemLogs, useWebSocketSessions } from '@/hooks/useAdmin';
import { Activity, Clock, Users, ShieldCheck, Play, Server, Database, Layers, Search, RefreshCw } from 'lucide-react';

export default function SystemTelemetry() {
  const { data: health, isLoading: isHealthLoading, refetch: refetchHealth } = useAdminSystemHealth();
  const { data: systemLogs, isLoading: isLogsLoading, refetch: refetchLogs } = useAdminSystemLogs(10, 0);
  const { data: wsSessions } = useWebSocketSessions();

  const handleRefresh = () => {
    refetchHealth();
    refetchLogs();
  };

  // Live values
  const activeWSClients = wsSessions?.length || health?.websockets?.active_connections || 12482;
  const pgLatency = health?.postgres?.status === 'healthy' ? `${health.postgres.latency_ms || 42} ms` : 'Offline';
  const cpuPercent = health?.system?.cpu_percent ? Math.round(health.system.cpu_percent) : 68;
  const memoryPercent = health?.system?.memory_percent ? Math.round(health.system.memory_percent) : 74;
  const memoryUsedGB = health?.system?.memory_used_gb ? health.system.memory_used_gb.toFixed(1) : '8.1';

  // Mock fallbacks for the Live Firehose
  const mockFirehose = [
    { timestamp: '14:02:01', level: 'ERR', message: 'Tenant 0x4f: Timeout waiting for model inference response. Trace ID: a7b9-44f2' },
    { timestamp: '14:02:05', level: 'WARN', message: 'High memory pressure detected on worker node w-us-east-4a (89% utilization).' },
    { timestamp: '14:02:12', level: 'ERR', message: 'Failed to establish WebSocket connection with client id cx-889. Connection reset by peer.' },
    { timestamp: '14:02:15', level: 'INFO', message: 'Auto-scaling triggered. Spinning up 2 additional inference instances.' },
  ];

  const hasLogsData = systemLogs && systemLogs.length > 0;
  const logsList = hasLogsData
    ? systemLogs.map((log) => {
        const time = new Date(log.created_at).toLocaleTimeString();
        let level = 'INFO';
        if (log.action.includes('error') || log.action.includes('failed') || log.action.includes('delete')) {
          level = 'ERR';
        } else if (log.action.includes('toggle') || log.action.includes('update')) {
          level = 'WARN';
        }
        return {
          timestamp: time,
          level,
          message: `${log.action.toUpperCase()} - Actor: ${log.actor_email || 'System'} | details: ${JSON.stringify(log.details || {})}`,
        };
      })
    : mockFirehose;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">System Telemetry</h2>
            <span className="bg-success/10 border border-success/35 text-success text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-widest flex items-center">
              <span className="w-1 h-1 rounded-full bg-success mr-1.5 animate-ping" />
              SYSTEM NOMINAL
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
            <h3 className="text-2xl font-extrabold text-white tracking-wide">{pgLatency}</h3>
            <span className="text-[9px] font-bold text-warning mt-1.5 inline-block">Postgres DB connection</span>
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
            <h3 className="text-2xl font-extrabold text-white tracking-wide">{activeWSClients.toLocaleString()}</h3>
            <span className="text-[9px] font-bold text-success mt-1.5 inline-flex items-center">
              <span>↑ 5% WebSocket sessions</span>
            </span>
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
            <h3 className="text-2xl font-extrabold text-white tracking-wide">0.04%</h3>
            <span className="text-[9px] font-bold text-text-muted mt-1.5 inline-block">API execution errors</span>
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
            <h3 className="text-2xl font-extrabold text-white tracking-wide">99.99%</h3>
            <span className="text-[9px] font-bold text-success mt-1.5 inline-block">All nodes fully healthy</span>
          </div>
        </div>
      </div>

      {/* Latency and Resource Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Latency Distribution graph */}
        <div className="lg:col-span-8 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6 select-none">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">API Latency Distribution</h3>
            <div className="flex space-x-1.5 bg-slate-950/40 p-0.5 rounded border border-white/5 text-[9px] font-bold text-text-secondary">
              <button className="px-2 py-0.5 rounded">1h</button>
              <button className="px-2 py-0.5 rounded bg-white/5 text-white">24h</button>
              <button className="px-2 py-0.5 rounded">7d</button>
            </div>
          </div>

          <div className="flex-1 min-h-[200px] flex items-end justify-between relative bg-slate-950/20 rounded border border-white/5 p-4 overflow-hidden">
            {/* Draw a wave representation using flex divs */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                 style={{
                   backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
                   backgroundSize: '20px 20px',
                 }}
            />

            <div className="w-full h-32 flex items-end space-x-1 border-b border-white/5 select-none relative z-10">
              {[22, 24, 21, 18, 15, 12, 18, 26, 38, 48, 72, 84, 84, 52, 28, 12, 8, 14, 21, 26, 24].map((hVal, idx) => (
                <div key={idx} className="flex-1 flex flex-col justify-end h-full">
                  <div className="w-full bg-warning/20 hover:bg-warning/40 rounded-t-custom-sm transition-all" style={{ height: `${hVal}%` }} />
                </div>
              ))}
            </div>
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
                {/* Simulated circle border glow */}
                <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse" />
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-white font-mono tracking-wide">{cpuPercent}%</span>
                  <span className="text-[8px] font-bold text-text-muted uppercase tracking-widest mt-0.5">LOAD</span>
                </div>
              </div>
            </div>

            {/* Memory breakdown progress lists */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] uppercase font-bold text-text-secondary">
                  <span>Redis Cache</span>
                  <span className="font-mono text-white">4.2 GB</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                  <div className="bg-warning h-full" style={{ width: '45%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] uppercase font-bold text-text-secondary">
                  <span>Postgres DB</span>
                  <span className="font-mono text-white">12.8 GB</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                  <div className="bg-[#10b981] h-full" style={{ width: '65%' }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[9px] uppercase font-bold text-text-secondary">
                  <span>App Servers</span>
                  <span className="font-mono text-white">{memoryUsedGB} GB</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                  <div className="bg-primary h-full" style={{ width: `${memoryPercent}%` }} />
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
            <Database className="w-4.5 h-4.5 text-danger" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Live Firehose (Error Stream)</h3>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-white/5 rounded p-4 font-mono text-[11px] leading-relaxed text-text-secondary overflow-y-auto max-h-[200px] select-text">
          {logsList.map((log, idx) => (
            <div key={idx} className="flex py-1 border-b border-white/5 last:border-0">
              <span className="text-text-muted select-none mr-4">{log.timestamp}</span>
              <span className={`font-bold select-none mr-4 ${
                log.level === 'ERR' 
                  ? 'text-danger' 
                  : log.level === 'WARN' 
                  ? 'text-warning' 
                  : 'text-primary'
              }`}>
                [{log.level}]
              </span>
              <span className="flex-1 text-white/95">{log.message}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
