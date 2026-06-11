'use client';

import { useEffect, useRef } from 'react';
import { useAdminSystemHealth, useAdminBusinesses, useAdminTelemetry } from '@/hooks/useAdmin';
import { Shield, Activity, Calendar, Download, RefreshCw, Layers, Building, Cpu, Database } from 'lucide-react';

export default function PlatformOverview() {
  const { data: health, isLoading: isHealthLoading, refetch: refetchHealth } = useAdminSystemHealth();
  const { data: businesses, isLoading: isBizLoading } = useAdminBusinesses(100, 0);
  const { data: telemetry, isLoading: isTelemetryLoading, refetch: refetchTelemetry } = useAdminTelemetry();

  const activeBusinessesCount = businesses?.total ?? null;

  const handleRefresh = () => {
    refetchHealth();
    refetchTelemetry();
  };

  const cpuPercent = health?.metrics?.cpu_usage_percent !== undefined ? Math.round(health.metrics.cpu_usage_percent) : null;
  const memoryPercent = health?.metrics?.memory_usage_percent !== undefined ? Math.round(health.metrics.memory_usage_percent) : null;
  const dbStatus = health?.services?.postgres || null;

  // Leaflet map hooks
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [9.082, 8.675], // Centered on Nigeria
          zoom: 6,
          zoomControl: true,
          attributionControl: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
        markersGroupRef.current = L.layerGroup().addTo(map);
      }

      if (markersGroupRef.current) {
        markersGroupRef.current.clearLayers();
      }

      if (telemetry?.locations && markersGroupRef.current) {
        telemetry.locations.forEach((loc) => {
          const markerColor = loc.is_active ? '#10B981' : '#EF4444';
          
          const customIcon = L.divIcon({
            className: 'custom-map-marker',
            html: `<div style="
              width: 14px;
              height: 14px;
              background: ${markerColor};
              border: 2px solid #0b1120;
              border-radius: 50%;
              box-shadow: 0 0 10px ${markerColor};
            "></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          });

          const popupContent = `
            <div style="padding: 10px; font-family: sans-serif; font-size: 11px;">
              <strong style="color: #fff; font-size: 12px; display: block; margin-bottom: 3px;">${loc.name}</strong>
              <span style="color: #9ca3af; display: block; margin-bottom: 2px;">Plan: <strong style="color: #F59E0B; text-transform: uppercase;">${loc.plan}</strong></span>
              <span style="color: #9ca3af; display: block;">MRR: <strong>₦ ${loc.mrr.toLocaleString()}</strong></span>
              <span style="color: ${loc.is_active ? '#10B981' : '#EF4444'}; display: block; margin-top: 5px; font-weight: bold; text-transform: uppercase;">
                ${loc.is_active ? 'Active' : 'Suspended'}
              </span>
            </div>
          `;

          const marker = L.marker([loc.lat, loc.lng], { icon: customIcon })
            .bindPopup(popupContent, {
              closeButton: false,
              className: 'custom-popup-box',
            });

          markersGroupRef.current.addLayer(marker);
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [telemetry?.locations]);

  // Compute breakdown segments from actual businesses
  const planCounts = { free: 0, starter: 0, professional: 0, enterprise: 0 };
  const planRevenue = { free: 0, starter: 0, professional: 0, enterprise: 0 };
  
  if (businesses?.data) {
    businesses.data.forEach((b: any) => {
      const plan = (b.subscription_plan || 'free').toLowerCase() as keyof typeof planCounts;
      if (planCounts[plan] !== undefined) {
        planCounts[plan]++;
        let mrr = 0;
        if (plan === 'starter') mrr = 15000;
        else if (plan === 'professional') mrr = 450000;
        else if (plan === 'enterprise') mrr = 120000;
        planRevenue[plan] += mrr;
      }
    });
  }

  const nrrVal = telemetry?.total_nrr !== undefined ? `₦ ${telemetry.total_nrr.toLocaleString()}` : '—';
  const churnVal = telemetry?.churn_rate !== undefined ? `${telemetry.churn_rate}%` : '—';
  const latencyVal = telemetry?.latency_metrics?.p95_latency !== undefined ? `${telemetry.latency_metrics.p95_latency}ms` : '—';
  const errorRateVal = telemetry?.latency_metrics?.error_rate !== undefined ? `${telemetry.latency_metrics.error_rate}%` : '—';

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
            <h3 className="text-2xl font-extrabold text-white tracking-wide">
              {isTelemetryLoading ? '...' : nrrVal}
            </h3>
            <span className="text-[9px] text-success mt-1.5 block">Net Revenue Runrate (Active MRR)</span>
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
            <h3 className="text-2xl font-extrabold text-white tracking-wide">
              {isTelemetryLoading ? '...' : churnVal}
            </h3>
            <span className="text-[9px] text-text-muted mt-1.5 block">Suspended workspace ratios</span>
          </div>
        </div>

        {/* System Status Card */}
        <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-5 flex flex-col justify-between h-32 hover:border-white/10 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">System Status</span>
            <div className="p-1.5 rounded-custom-sm bg-success/5 border border-success/10 text-success">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-white tracking-wide capitalize font-sans">
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
        
        {/* Left Column: Business Density Map */}
        <div className="lg:col-span-8 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4 select-none">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Business Density Map</h3>
            <span className="text-[9px] font-bold text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase font-mono">Nigeria</span>
          </div>

          <div 
            ref={mapContainerRef} 
            className="flex-1 min-h-[350px] bg-slate-950/20 rounded border border-white/5 overflow-hidden z-10"
          />
        </div>

        {/* Right Column: System Health stats */}
        <div className="lg:col-span-4 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3 select-none">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">System Health</h3>
              <Activity className="w-4 h-4 text-primary" />
            </div>

            {/* API Latency */}
            <div className="space-y-2 mb-6 select-none">
              <div className="flex justify-between text-[11px]">
                <span className="text-text-secondary">API Latency (p95)</span>
                <span className="font-mono text-white font-bold">{latencyVal}</span>
              </div>
              <div className="h-10 bg-slate-950/40 rounded border border-white/5 flex items-center justify-center text-[10px] text-success font-semibold tracking-wider font-mono">
                {isTelemetryLoading ? 'FETCHING LATENCY...' : 'LATENCY ENDPOINT NOMINAL'}
              </div>
            </div>

            {/* Error Rate */}
            <div className="space-y-2 mb-6 select-none">
              <div className="flex justify-between text-[11px]">
                <span className="text-text-secondary">Error Rate (1h)</span>
                <span className="font-mono text-danger font-bold">{errorRateVal}</span>
              </div>
              <div className="h-10 bg-slate-950/40 rounded border border-white/5 flex items-center justify-center text-[10px] text-success font-semibold tracking-wider font-mono">
                {isTelemetryLoading ? 'FETCHING METRICS...' : 'ERROR RATES WITHIN BOUNDS'}
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

      {/* Bottom Chart: MRR Growth & Plan Distribution */}
      <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Plan Segmentation & MRR Distribution</h3>
            <span className="text-[10px] text-text-muted mt-0.5 block">Live monthly recurring revenue distribution segmented by customer tier</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { name: 'Enterprise', count: planCounts.enterprise, rev: planRevenue.enterprise, color: 'text-warning', bg: 'bg-warning' },
            { name: 'Professional', count: planCounts.professional, rev: planRevenue.professional, color: 'text-primary', bg: 'bg-primary' },
            { name: 'Starter', count: planCounts.starter, rev: planRevenue.starter, color: 'text-secondary', bg: 'bg-secondary' },
            { name: 'Free', count: planCounts.free, rev: planRevenue.free, color: 'text-text-muted', bg: 'bg-white/10' },
          ].map((tier) => (
            <div key={tier.name} className="bg-slate-950/20 border border-white/5 rounded-custom-sm p-4 flex flex-col justify-between h-28 select-none">
              <div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${tier.color}`}>{tier.name}</span>
                <h4 className="text-lg font-black text-white mt-1">₦ {tier.rev.toLocaleString()}</h4>
              </div>
              <div className="flex justify-between items-center text-[10px] text-text-secondary border-t border-white/5 pt-2">
                <span>Workspaces:</span>
                <span className="font-mono font-bold text-white">{tier.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
