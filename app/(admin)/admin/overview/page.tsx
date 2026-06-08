'use client';

import { useState } from 'react';
import { useAdminSystemHealth, useAdminBusinesses } from '@/hooks/useAdmin';
import { BarChart, LineChart, Shield, Activity, Calendar, Download, RefreshCw, Layers, MapPin, Building } from 'lucide-react';

export default function PlatformOverview() {
  const { data: health, isLoading: isHealthLoading, refetch: refetchHealth } = useAdminSystemHealth();
  const { data: businesses, isLoading: isBizLoading } = useAdminBusinesses(1, 0);

  const activeBusinessesCount = businesses?.total || 1248; // Fallback to mockup value if 0

  // Mock charts data
  const mrrData = [
    { month: 'Jan', starter: 2.1, growth: 12.3, enterprise: 16.4 },
    { month: 'Feb', starter: 2.3, growth: 13.1, enterprise: 17.2 },
    { month: 'Mar', starter: 2.1, growth: 12.8, enterprise: 16.9 },
    { month: 'Apr', starter: 2.9, growth: 15.2, enterprise: 20.1 },
    { month: 'May', starter: 3.1, growth: 16.3, enterprise: 21.8 },
    { month: 'Jun', starter: 3.5, growth: 18.5, enterprise: 24.3 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Platform Overview</h2>
          <p className="text-xs text-text-secondary mt-1">Real-time global metrics for the OpsPilot infrastructure.</p>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => refetchHealth()}
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
            <h3 className="text-2xl font-extrabold text-white tracking-wide">₦42.8M</h3>
            <span className="text-[10px] font-bold text-success mt-1.5 inline-flex items-center">
              <span>↑ +12.4% vs last month</span>
            </span>
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
              {isBizLoading ? '...' : activeBusinessesCount.toLocaleString()}
            </h3>
            <span className="text-[10px] font-bold text-success mt-1.5 inline-flex items-center">
              <span>↑ +45 new this week</span>
            </span>
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
            <h3 className="text-2xl font-extrabold text-white tracking-wide">1.2%</h3>
            <span className="text-[10px] font-bold text-success mt-1.5 inline-flex items-center">
              <span>↓ -0.4% vs last month</span>
            </span>
          </div>
        </div>

        {/* System Uptime Card */}
        <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-5 flex flex-col justify-between h-32 hover:border-white/10 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">System Uptime</span>
            <div className="p-1.5 rounded-custom-sm bg-success/5 border border-success/10 text-success">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white tracking-wide">99.99%</h3>
            <span className="text-[10px] font-bold text-success mt-1.5 inline-flex items-center">
              <span className="w-1.5 h-1.5 bg-success rounded-full mr-1.5 animate-ping" />
              <span>All systems operational</span>
            </span>
          </div>
        </div>
      </div>

      {/* Middle Map and Metrics Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Business Density Map */}
        <div className="lg:col-span-8 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Business Density Map</h3>
            <span className="text-[9px] font-bold text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase font-mono">Nigeria</span>
          </div>

          <div className="flex-1 min-h-[300px] flex items-center justify-center relative bg-slate-950/20 rounded border border-white/5 overflow-hidden">
            {/* Nigeria map graphic overlay container */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                 style={{
                   backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.5px)',
                   backgroundSize: '16px 16px',
                 }}
            />

            {/* Custom map representation inside canvas wrapper */}
            <div className="relative w-64 h-64 border border-white/5 bg-slate-900/20 rounded-full flex items-center justify-center">
              {/* Density plots representation */}
              <div className="absolute top-1/3 left-1/3 w-4 h-4 rounded-full bg-warning/80 flex items-center justify-center shadow-[0_0_15px_#F59E0B] animate-ping" />
              <div className="absolute top-1/3 left-1/3 w-3 h-3 rounded-full bg-warning border-2 border-slate-950 z-10" />
              
              <div className="absolute bottom-1/3 right-1/3 w-3 h-3 rounded-full bg-primary/80 flex items-center justify-center shadow-[0_0_12px_#00F5FF] animate-pulse" />
              <div className="absolute bottom-1/3 right-1/3 w-2 h-2 rounded-full bg-primary border border-slate-950 z-10" />

              <div className="absolute top-1/2 right-1/4 w-3.5 h-3.5 rounded-full bg-warning/80 flex items-center justify-center shadow-[0_0_12px_#F59E0B]" />
              <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-warning border border-slate-950 z-10" />

              <div className="absolute bottom-1/2 left-1/4 w-2.5 h-2.5 rounded-full bg-primary/80 flex items-center justify-center shadow-[0_0_8px_#00F5FF]" />
              <div className="absolute bottom-1/2 left-1/4 w-1.5 h-1.5 rounded-full bg-primary border border-slate-950 z-10" />

              <span className="text-[10px] text-text-muted select-none font-mono uppercase tracking-widest">Map Simulation</span>
            </div>

            {/* Bottom Legend */}
            <div className="absolute bottom-4 left-4 space-y-2 text-[10px] font-bold text-text-secondary select-none">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-warning border border-slate-950" />
                <span>High Density (&gt;500)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary border border-slate-950" />
                <span>Medium Density</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: System Health stats */}
        <div className="lg:col-span-4 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">System Health</h3>
              <Activity className="w-4 h-4 text-primary" />
            </div>

            {/* API Latency Sparkline */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-[11px]">
                <span className="text-text-secondary">API Latency (p95)</span>
                <span className="font-mono text-primary font-bold">
                  {health?.postgres?.latency_ms ? `${health.postgres.latency_ms}ms` : '42ms'}
                </span>
              </div>
              {/* Latency Graphic Sparkline */}
              <div className="h-10 bg-slate-950/40 rounded border border-white/5 flex items-end px-2 py-1 space-x-1 overflow-hidden">
                {[45, 48, 41, 38, 42, 49, 44, 42, 45, 39, 42, 46, 42].map((val, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-primary/40 rounded-t-custom-sm"
                    style={{ height: `${(val / 60) * 100}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Error Rate Sparkline */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-[11px]">
                <span className="text-text-secondary">Error Rate (1h)</span>
                <span className="font-mono text-danger font-bold">0.02%</span>
              </div>
              {/* Error Graphic Sparkline */}
              <div className="h-10 bg-slate-950/40 rounded border border-white/5 flex items-end px-2 py-1 space-x-1 overflow-hidden">
                {[0.01, 0.02, 0.05, 0.01, 0.03, 0.01, 0.02, 0.01, 0.02, 0.04, 0.01, 0.02, 0.02].map((val, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-danger/40 rounded-t-custom-sm"
                    style={{ height: `${(val / 0.08) * 100}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Infrastructure Loading Bars */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] uppercase font-bold text-text-secondary">
                  <span>DB Compute load</span>
                  <span className="font-mono text-white">
                    {health?.system?.cpu_percent ? `${Math.round(health.system.cpu_percent)}%` : '64%'}
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className="bg-primary h-full transition-all duration-500"
                    style={{ width: `${health?.system?.cpu_percent || 64}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] uppercase font-bold text-text-secondary">
                  <span>Redis memory capacity</span>
                  <span className="font-mono text-white">
                    {health?.system?.memory_percent ? `${Math.round(health.system.memory_percent)}%` : '82%'}
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-white/5">
                  <div
                    className="bg-warning h-full transition-all duration-500"
                    style={{ width: `${health?.system?.memory_percent || 82}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Chart: MRR Growth & Plan Distribution */}
      <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">MRR Growth & Plan Distribution</h3>
            <span className="text-[10px] text-text-muted mt-0.5 block">Monthly recurring revenue segmented by tier</span>
          </div>
          
          <div className="flex space-x-1.5 bg-slate-950/40 p-0.5 rounded border border-white/5 text-[9px] font-bold text-text-secondary select-none">
            <button className="px-3 py-1 rounded bg-white/5 text-white">Line</button>
            <button className="px-3 py-1 rounded">Bar</button>
          </div>
        </div>

        {/* Visual Simulated Stacked Bar Chart */}
        <div className="h-64 flex items-end justify-between px-4 pb-2 border-b border-white/5">
          {mrrData.map((item) => {
            const total = item.starter + item.growth + item.enterprise;
            const starterPercent = (item.starter / total) * 100;
            const growthPercent = (item.growth / total) * 100;
            const enterprisePercent = (item.enterprise / total) * 100;

            return (
              <div key={item.month} className="flex-1 flex flex-col items-center max-w-[80px]">
                {/* Stacked columns */}
                <div className="w-12 rounded-t-custom-sm overflow-hidden flex flex-col-reverse" style={{ height: `${(total / 50) * 200}px` }}>
                  {/* Starter block */}
                  <div className="bg-primary/80 hover:bg-primary transition-colors cursor-pointer" style={{ height: `${starterPercent}%` }} title={`Starter: ₦${item.starter}M`} />
                  {/* Growth block */}
                  <div className="bg-warning/80 hover:bg-warning transition-colors cursor-pointer" style={{ height: `${growthPercent}%` }} title={`Growth: ₦${item.growth}M`} />
                  {/* Enterprise block */}
                  <div className="bg-[#10b981] hover:bg-success transition-colors cursor-pointer" style={{ height: `${enterprisePercent}%` }} title={`Enterprise: ₦${item.enterprise}M`} />
                </div>
                
                {/* X Axis labels */}
                <span className="mt-3 text-[10px] text-text-secondary font-semibold font-mono uppercase">{item.month}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center space-x-8 mt-4 text-[10px] font-bold text-text-secondary select-none">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded bg-primary" />
            <span>Starter Tier</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded bg-warning" />
            <span>Growth Tier</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded bg-[#10b981]" />
            <span>Enterprise Tier</span>
          </div>
        </div>
      </div>

    </div>
  );
}
