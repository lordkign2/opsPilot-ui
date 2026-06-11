'use client';

import { useState, useEffect } from 'react';
import { useAdminSettings, useUpdateAdminSettings } from '@/hooks/useAdmin';
import {
  ShieldAlert,
  Lock,
  RotateCw,
  Plus,
  Trash2,
  Sliders,
  Play,
  CheckCircle,
  AlertOctagon,
  HelpCircle,
  Loader2,
  FileCode,
  Globe,
  Settings
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface IPWhitelistItem {
  ip: string;
  name: string;
  locked?: boolean;
}

export default function MfaConfigPage() {
  const { data: settings, isLoading, refetch } = useAdminSettings();
  const updateSettingsMutation = useUpdateAdminSettings();

  // Local state for the settings form fields
  const [globalMfa, setGlobalMfa] = useState(false);
  const [strictPassword, setStrictPassword] = useState(false);
  const [idleTimeout, setIdleTimeout] = useState(15);
  const [maxSessions, setMaxSessions] = useState(1);
  const [rateLimit, setRateLimit] = useState(2500);
  const [corsDomains, setCorsDomains] = useState('*.opspilot.io, api.partner-hub.com');
  const [signingKeys, setSigningKeys] = useState(3);
  const [whitelist, setWhitelist] = useState<IPWhitelistItem[]>([]);

  // New IP item dialog state
  const [newIp, setNewIp] = useState('');
  const [newIpName, setNewIpName] = useState('');
  const [showAddIp, setShowAddIp] = useState(false);

  // Synchronize local state when settings data is loaded from API
  useEffect(() => {
    if (settings) {
      setGlobalMfa(settings.global_mfa_requirement);
      setStrictPassword(settings.strict_password_complexity);
      setIdleTimeout(settings.idle_session_timeout);
      setMaxSessions(settings.max_concurrent_sessions);
      setRateLimit(settings.global_rate_limit);
      setCorsDomains(settings.allowed_cors_domains);
      setSigningKeys(settings.active_signing_keys_count);

      try {
        const parsed = JSON.parse(settings.admin_ip_whitelist);
        if (Array.isArray(parsed)) {
          setWhitelist(parsed);
        } else {
          setWhitelist(getDefaultWhitelist());
        }
      } catch {
        setWhitelist(getDefaultWhitelist());
      }
    }
  }, [settings]);

  const getDefaultWhitelist = (): IPWhitelistItem[] => [
    { ip: '192.168.1.0/24', name: 'HQ VPN Gateway' },
    { ip: '10.0.5.3/32', name: 'Primary Node Config' },
    { ip: '172.16.0.0/12', name: 'Revoked - Legacy DC', locked: true }
  ];

  const handleRollback = () => {
    refetch();
    alert('Local settings rolled back to current database state.');
  };

  const handleApplyChanges = async () => {
    try {
      await updateSettingsMutation.mutateAsync({
        global_mfa_requirement: globalMfa,
        strict_password_complexity: strictPassword,
        idle_session_timeout: Number(idleTimeout),
        max_concurrent_sessions: Number(maxSessions),
        global_rate_limit: Number(rateLimit),
        allowed_cors_domains: corsDomains,
        active_signing_keys_count: Number(signingKeys),
        admin_ip_whitelist: JSON.stringify(whitelist)
      });
      alert('Security policies and configuration settings updated successfully in the database.');
    } catch (err) {
      console.error(err);
      alert('Failed to save security settings changes.');
    }
  };

  const handleAddIp = () => {
    if (!newIp.trim() || !newIpName.trim()) return;
    setWhitelist([...whitelist, { ip: newIp.trim(), name: newIpName.trim() }]);
    setNewIp('');
    setNewIpName('');
    setShowAddIp(false);
  };

  const handleRemoveIp = (index: number) => {
    if (whitelist[index]?.locked) return;
    setWhitelist(whitelist.filter((_, idx) => idx !== index));
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center space-x-2 text-text-secondary select-none">
        <Loader2 className="w-6 h-6 animate-spin text-warning" />
        <span className="text-sm font-semibold">Loading security access settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Title & Control Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 select-none">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <Lock className="w-5 h-5 text-warning" />
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Security & Access Control</h2>
          </div>
          <p className="text-xs text-text-secondary">
            Manage global platform protection, authentication policies, and API integrity.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={handleRollback}
            disabled={updateSettingsMutation.isPending}
            className="px-4 py-2 bg-slate-900 border border-white/5 text-text-secondary hover:text-white rounded hover:bg-white/5 cursor-pointer font-bold transition-all disabled:opacity-50"
          >
            Rollback Config
          </button>
          <Button
            onClick={handleApplyChanges}
            isLoading={updateSettingsMutation.isPending}
            variant="primary"
            className="px-4 py-2 bg-warning text-slate-950 hover:bg-warning/90 font-bold shadow-[0_0_12px_rgba(245,158,11,0.08)] cursor-pointer"
          >
            Apply Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: MFA & Auth Policy */}
        <div className="lg:col-span-7 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 space-y-6">
          <div className="flex items-center space-x-2 pb-2 border-b border-white/5 select-none">
            <ShieldAlert className="w-4.5 h-4.5 text-warning" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">MFA & Auth Policy</h3>
          </div>

          <div className="space-y-6">
            
            {/* Global MFA Requirement toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-950/20 rounded border border-white/5 select-none">
              <div className="flex flex-col pr-4">
                <span className="text-xs font-bold text-white uppercase tracking-wide">Global MFA Requirement</span>
                <span className="text-[10px] text-text-muted mt-1">Enforce 2FA for all super administrator and platform operator roles</span>
              </div>
              <button
                type="button"
                onClick={() => setGlobalMfa(!globalMfa)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  globalMfa ? 'bg-warning shadow-[0_0_12px_rgba(245,158,11,0.25)]' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                    globalMfa ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Strict Password Complexity toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-950/20 rounded border border-white/5 select-none">
              <div className="flex flex-col pr-4">
                <span className="text-xs font-bold text-white uppercase tracking-wide">Strict Password Complexity</span>
                <span className="text-[10px] text-text-muted mt-1">Requires alphanumeric combinations + special chars + minimum 16 chars</span>
              </div>
              <button
                type="button"
                onClick={() => setStrictPassword(!strictPassword)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  strictPassword ? 'bg-warning shadow-[0_0_12px_rgba(245,158,11,0.25)]' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                    strictPassword ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Numeric timeouts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider select-none">
                  Idle Session Timeout (Minutes)
                </label>
                <input
                  type="number"
                  min={1}
                  value={idleTimeout}
                  onChange={(e) => setIdleTimeout(Number(e.target.value))}
                  className="w-full glass-input px-3.5 py-2.5 text-xs rounded text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider select-none">
                  Max Concurrent Sessions
                </label>
                <input
                  type="number"
                  min={1}
                  value={maxSessions}
                  onChange={(e) => setMaxSessions(Number(e.target.value))}
                  className="w-full glass-input px-3.5 py-2.5 text-xs rounded text-white font-mono"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Admin IP Whitelist */}
        <div className="lg:col-span-5 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5 select-none">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4.5 h-4.5 text-warning" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Admin IP Whitelist</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddIp(!showAddIp)}
                className="p-1 text-warning hover:text-white transition-colors"
                title="Add IP block configuration"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Add IP inline panel */}
            {showAddIp && (
              <div className="p-3 bg-slate-950/40 rounded border border-white/5 space-y-3 animate-fadeIn select-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="e.g. 192.168.1.0/24"
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                    className="glass-input px-2 py-1.5 rounded text-[11px] font-mono text-white"
                  />
                  <input
                    type="text"
                    placeholder="Gateway Name"
                    value={newIpName}
                    onChange={(e) => setNewIpName(e.target.value)}
                    className="glass-input px-2 py-1.5 rounded text-[11px] text-white"
                  />
                </div>
                <div className="flex justify-end space-x-2 text-[10px] font-bold">
                  <button
                    onClick={() => setShowAddIp(false)}
                    className="px-2.5 py-1 text-text-secondary hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddIp}
                    className="px-2.5 py-1 bg-warning text-slate-950 rounded hover:bg-warning/90"
                  >
                    Add CIDR
                  </button>
                </div>
              </div>
            )}

            {/* List IP Configurations */}
            <div className="space-y-2.5 select-none max-h-56 overflow-y-auto">
              {whitelist.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 rounded bg-slate-950/30 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white font-mono">{item.ip}</span>
                    <span className="text-[10px] text-text-secondary mt-0.5">{item.name}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveIp(idx)}
                    disabled={item.locked}
                    className={`p-1.5 rounded hover:bg-white/5 transition-colors ${
                      item.locked ? 'text-text-muted cursor-not-allowed opacity-35' : 'text-text-secondary hover:text-danger'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

          </div>

          <p className="text-[9px] text-text-muted leading-relaxed select-none pt-4 border-t border-white/5 mt-4">
            * Standard traffic requests matching whitelisted CIDR subnets are permitted. Lock overrides apply to master system core node loops.
          </p>
        </div>

      </div>

      {/* Middle Card: API & Integration Security */}
      <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 space-y-6">
        <div className="flex items-center space-x-2 pb-2 border-b border-white/5 select-none">
          <Sliders className="w-4.5 h-4.5 text-warning" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">API & Integration Security</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center select-none">
          {/* Rate limit slider */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                Global Rate Limit (Req/s)
              </span>
              <span className="text-xs font-bold text-white font-mono">{rateLimit} Req/s</span>
            </div>
            <input
              type="range"
              min="100"
              max="10000"
              step="100"
              value={rateLimit}
              onChange={(e) => setRateLimit(Number(e.target.value))}
              className="w-full accent-warning h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* CORS String inputs */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">
              Allowed CORS Domains
            </label>
            <div className="relative">
              <input
                type="text"
                value={corsDomains}
                onChange={(e) => setCorsDomains(e.target.value)}
                placeholder="e.g. *.opspilot.io, api.partner-hub.com"
                className="w-full glass-input px-3.5 py-2.5 text-xs rounded text-white font-mono"
              />
            </div>
          </div>

          {/* Rotation Keys */}
          <div className="md:col-span-2 space-y-2 text-center md:text-left">
            <span className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">
              Active Signing Keys
            </span>
            <div className="inline-flex items-center space-x-3 bg-slate-950/40 border border-white/5 px-4 py-2 rounded">
              <span className="text-sm font-bold text-white font-mono">{signingKeys} in rotation</span>
              <button
                type="button"
                onClick={() => setSigningKeys(signingKeys === 3 ? 4 : 3)}
                className="p-1 hover:text-white text-warning hover:rotate-180 transition-all cursor-pointer"
                title="Rotate Signing Keys"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Card: Recent Security Events */}
      <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 space-y-4">
        <div className="flex justify-between items-center select-none pb-2 border-b border-white/5">
          <div className="flex items-center space-x-2">
            <Globe className="w-4.5 h-4.5 text-warning" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Recent Security Events</h3>
          </div>
          <a
            href="/admin/observability"
            className="text-[10px] font-bold text-warning hover:underline flex items-center space-x-1"
          >
            <span>View Full Log</span>
            <span>&rarr;</span>
          </a>
        </div>

        {/* Security Logs Table */}
        <div className="overflow-x-auto select-none">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-text-muted text-[10px] uppercase font-bold tracking-wider bg-slate-950/20">
                <th className="px-4 py-3">Timestamp (UTC)</th>
                <th className="px-4 py-3">Event Type</th>
                <th className="px-4 py-3">Actor / IP</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { time: '2023-10-27T08:14:22Z', type: 'Admin Login', actor: 'superadmin', ip: '192.168.1.45', target: 'Auth Service', status: 'Success', statusColor: 'text-[#10b981] bg-success/15 border-success/30' },
                { time: '2023-10-27T07:55:01Z', type: 'Key Rotation', actor: 'system_auto', ip: 'internal', target: 'API Gateway (Key_v4)', status: 'Success', statusColor: 'text-[#10b981] bg-success/15 border-success/30' },
                { time: '2023-10-27T05:22:18Z', type: 'Config Change', actor: 'net_admin', ip: '10.0.0.5', target: 'IP Whitelist', status: 'Pending Review', statusColor: 'text-warning bg-warning/10 border-warning/20' },
                { time: '2023-10-26T23:11:05Z', type: 'Failed Login (MFA)', actor: 'unknown', ip: '45.33.22.11', target: 'Auth Service', status: 'Denied', statusColor: 'text-danger bg-danger/10 border-danger/20' },
                { time: '2023-10-26T18:40:00Z', type: 'Rate Limit Exceeded', actor: 'ext_client_b', ip: 'api.partner-hub.com', target: 'Endpoint /v1/data', status: 'Throttled', statusColor: 'text-warning bg-warning/10 border-warning/20' }
              ].map((row, idx) => (
                <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 font-mono text-white/70">{row.time}</td>
                  <td className="px-4 py-3 font-bold text-white">{row.type}</td>
                  <td className="px-4 py-3 text-text-secondary leading-relaxed">
                    <span className="font-semibold text-white/80">{row.actor}</span>
                    <span className="text-[10px] text-text-muted ml-1.5 font-mono">({row.ip})</span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary font-mono text-[11px]">{row.target}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded border uppercase tracking-wider ${row.statusColor}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
