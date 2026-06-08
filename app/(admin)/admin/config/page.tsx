'use client';

import { useState } from 'react';
import { useAdminSystemHealth, useToggleMaintenance, useBroadcastSystemAlert } from '@/hooks/useAdmin';
import { Sliders, AlertTriangle, Radio, ShieldAlert, Cpu, Loader2, Volume2, Database, Layers, RadioTower, HelpCircle, Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function SystemConfig() {
  const { data: health, isLoading: isHealthLoading, refetch } = useAdminSystemHealth();
  const toggleMutation = useToggleMaintenance();
  const broadcastMutation = useBroadcastSystemAlert();

  const [activeTab, setActiveTab] = useState<'system' | 'tiers' | 'flags'>('system');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [eventType, setEventType] = useState('system_alert');

  // Retrieve current maintenance mode from health mock/real state
  const isMaintenanceActive = toggleMutation.isSuccess 
    ? (toggleMutation.data?.maintenance_mode_active ?? false)
    : false;

  const handleToggleMaintenance = async () => {
    const nextState = !isMaintenanceActive;
    if (nextState && !confirm('WARNING: Activating maintenance mode will block all standard workspace traffic and POS operations globally. Are you sure you want to proceed?')) return;
    
    try {
      await toggleMutation.mutateAsync(nextState);
      refetch();
    } catch (err) {
      console.error(err);
      alert('Failed to update maintenance state.');
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    try {
      const res = await broadcastMutation.mutateAsync({
        message: broadcastMessage,
        eventType,
      });
      alert(`Broadcast successful! Message delivered to ${res?.broadcast_count || 0} active user session(s).`);
      setBroadcastMessage('');
    } catch (err) {
      console.error(err);
      alert('Failed to broadcast alert.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Switcher Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 select-none">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Infrastructure Control</h2>
          <p className="text-xs text-text-secondary mt-1">Manage global subscription plans, feature toggles, and system alerts.</p>
        </div>

        <nav className="flex space-x-1.5 bg-slate-950/40 p-0.5 rounded border border-white/5 text-xs text-text-secondary">
          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2 rounded transition-colors font-bold cursor-pointer ${
              activeTab === 'system' ? 'bg-white/5 text-primary' : 'hover:text-white'
            }`}
          >
            System Controls
          </button>
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-4 py-2 rounded transition-colors font-bold cursor-pointer ${
              activeTab === 'tiers' ? 'bg-white/5 text-primary' : 'hover:text-white'
            }`}
          >
            Tiers & Pricing
          </button>
          <button
            onClick={() => setActiveTab('flags')}
            className={`px-4 py-2 rounded transition-colors font-bold cursor-pointer ${
              activeTab === 'flags' ? 'bg-white/5 text-primary' : 'hover:text-white'
            }`}
          >
            Feature Flags
          </button>
        </nav>
      </div>

      {/* ── Tab Content ── */}

      {activeTab === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Maintenance Control Card */}
          <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2.5">
                  <ShieldAlert className="w-4.5 h-4.5 text-warning" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Maintenance Controls</h3>
                </div>
              </div>

              {/* Warning Alert Box */}
              {isMaintenanceActive ? (
                <div className="bg-danger/10 border border-danger/25 rounded p-4 text-xs leading-relaxed text-danger flex items-start space-x-3 select-none">
                  <AlertTriangle className="w-5 h-5 shrink-0 animate-bounce mt-0.5" />
                  <div>
                    <p className="font-extrabold text-white">MAINTENANCE MODE ACTIVE</p>
                    <p className="text-[10px] text-text-secondary mt-1">Standard business APIs are blocked in Redis. All POS checkout transactions, order creation, and worker queues are suspended except administrative logins.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950/40 border border-white/5 rounded p-4 text-xs leading-relaxed text-text-secondary flex items-start space-x-3 select-none">
                  <Cpu className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-white">System Status: Online</p>
                    <p className="text-[10px] text-text-secondary mt-1">Standard API endpoint validation is fully active. Traffic, event worker jobs, and POS checkouts function normal.</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-slate-950/30 rounded border border-white/5 select-none">
                <div className="flex flex-col pr-4">
                  <span className="text-xs font-bold text-white uppercase tracking-wide">Toggle Maintenance Mode</span>
                  <span className="text-[10px] text-text-muted mt-1">Blocks regular API requests immediately if set to active</span>
                </div>

                <button
                  type="button"
                  onClick={handleToggleMaintenance}
                  disabled={toggleMutation.isPending}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isMaintenanceActive ? 'bg-danger shadow-[0_0_12px_rgba(239,68,68,0.3)]' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                      isMaintenanceActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-bold text-text-secondary uppercase select-none">
              <span>Last change: Just now</span>
              <span className="flex items-center space-x-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isMaintenanceActive ? 'bg-danger animate-ping' : 'bg-success'}`} />
                <span>{isMaintenanceActive ? 'Mode Active' : 'Normal State'}</span>
              </span>
            </div>
          </div>

          {/* Right Column: WebSocket System Alert Broadcast */}
          <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6">
            <form onSubmit={handleBroadcast} className="space-y-5">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2.5">
                  <Radio className="w-4.5 h-4.5 text-primary" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Global System Broadcast</h3>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                  Event Classification
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full glass-input px-3.5 py-2.5 text-xs rounded cursor-pointer font-semibold"
                >
                  <option value="system_alert">Standard System Alert (system_alert)</option>
                  <option value="system_maintenance">Maintenance Update Alert (system_maintenance)</option>
                  <option value="critical_error">Critical Infrastructure Alert (critical_error)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                  Alert Message Body
                </label>
                <textarea
                  rows={4}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Type critical notice content here. It will immediately pop up for all users on active workspaces globally..."
                  className="w-full glass-input px-3.5 py-2.5 text-xs rounded resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={broadcastMutation.isPending}
                disabled={!broadcastMessage.trim()}
                className="w-full flex items-center justify-center space-x-2 py-3 text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.05)] cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-slate-950" />
                <span>Fanout Broadcast Alert</span>
              </Button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'tiers' && (
        <div className="space-y-6">
          {/* Info Banner showing Endpoint Null status */}
          <div className="bg-warning/5 border border-warning/15 rounded p-4 text-xs leading-relaxed text-warning flex items-start space-x-3 select-none">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-white">Tier Management Offline (null)</p>
              <p className="text-[10px] text-text-secondary mt-1">There are currently no registered API routes in the backend endpoints list to perform CRUD operations on subscription tiers. This view represents the pricing tiers configured in frontend model bindings.</p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex justify-between items-center select-none">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Subscription & Pricing Tiers</h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 bg-slate-900 border border-white/5 rounded text-[10px] font-bold text-text-secondary hover:text-white cursor-pointer transition-colors">
                Audit Logs
              </button>
              <button className="px-3 py-1.5 bg-warning/10 border border-warning/20 hover:bg-warning/15 rounded text-[10px] font-bold text-warning cursor-pointer transition-colors flex items-center space-x-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Tier</span>
              </button>
            </div>
          </div>

          {/* Four Pricing Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 select-none">
            
            {/* Starter */}
            <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-5 flex flex-col justify-between h-[360px]">
              <div>
                <div className="flex justify-between items-start border-b border-white/5 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">Starter</h4>
                    <span className="text-[9px] text-text-secondary mt-1 block">1,204 Active Tenants</span>
                  </div>
                  <ToggleRight className="w-6 h-6 text-primary cursor-pointer" />
                </div>
                
                <h3 className="text-xl font-black text-white mt-4">₦15,000<span className="text-xs text-text-secondary font-normal">/mo</span></h3>
                
                <ul className="text-[10px] text-text-secondary space-y-2 mt-4">
                  <li className="flex items-center text-success font-semibold">✓ 1,000 AI Inferences/mo</li>
                  <li className="flex items-center text-success font-semibold">✓ 2 Admin Users</li>
                  <li className="flex items-center text-success font-semibold">✓ Standard Community Support</li>
                  <li className="flex items-center text-text-muted">✗ Custom Knowledge Base</li>
                </ul>
              </div>

              <button className="w-full py-2 bg-slate-950/60 border border-white/5 hover:bg-white/5 text-[10px] font-bold text-white rounded cursor-pointer transition-colors mt-4">
                Edit Tier
              </button>
            </div>

            {/* Growth */}
            <div className="glass-card bg-slate-900/10 border border-primary/25 rounded-custom-lg p-5 flex flex-col justify-between h-[360px] relative shadow-[0_0_15px_rgba(0,245,255,0.03)]">
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary/10 border border-primary/30 text-primary text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Popular</span>
              <div>
                <div className="flex justify-between items-start border-b border-white/5 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">Growth</h4>
                    <span className="text-[9px] text-text-secondary mt-1 block">3,850 Active Tenants</span>
                  </div>
                  <ToggleRight className="w-6 h-6 text-primary cursor-pointer" />
                </div>
                
                <h3 className="text-xl font-black text-white mt-4">₦45,000<span className="text-xs text-text-secondary font-normal">/mo</span></h3>
                
                <ul className="text-[10px] text-text-secondary space-y-2 mt-4">
                  <li className="flex items-center text-success font-semibold">✓ 10,000 AI Inferences/mo</li>
                  <li className="flex items-center text-success font-semibold">✓ 5 Admin Users</li>
                  <li className="flex items-center text-success font-semibold">✓ Priority Email Support</li>
                  <li className="flex items-center text-success font-semibold">✓ Custom Knowledge Base (100MB)</li>
                </ul>
              </div>

              <button className="w-full py-2 bg-primary/10 border border-primary/25 hover:bg-primary/15 text-[10px] font-bold text-primary rounded cursor-pointer transition-colors mt-4">
                Edit Tier
              </button>
            </div>

            {/* Enterprise */}
            <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-5 flex flex-col justify-between h-[360px]">
              <div>
                <div className="flex justify-between items-start border-b border-white/5 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">Enterprise</h4>
                    <span className="text-[9px] text-text-secondary mt-1 block">412 Active Tenants</span>
                  </div>
                  <ToggleRight className="w-6 h-6 text-primary cursor-pointer" />
                </div>
                
                <h3 className="text-xl font-black text-white mt-4">₦120,000<span className="text-xs text-text-secondary font-normal">/mo</span></h3>
                
                <ul className="text-[10px] text-text-secondary space-y-2 mt-4">
                  <li className="flex items-center text-success font-semibold">✓ Unlimited Inferences (FUP)</li>
                  <li className="flex items-center text-success font-semibold">✓ Unlimited Users</li>
                  <li className="flex items-center text-success font-semibold">✓ 24/7 Dedicated Support</li>
                  <li className="flex items-center text-success font-semibold">✓ Advanced Observability Logs</li>
                </ul>
              </div>

              <button className="w-full py-2 bg-slate-950/60 border border-white/5 hover:bg-white/5 text-[10px] font-bold text-white rounded cursor-pointer transition-colors mt-4">
                Edit Tier
              </button>
            </div>

            {/* Custom/Legacy */}
            <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-5 flex flex-col justify-between h-[360px]">
              <div>
                <div className="flex justify-between items-start border-b border-white/5 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-wide">Custom / Legacy</h4>
                    <span className="text-[9px] text-text-secondary mt-1 block">89 Active Tenants</span>
                  </div>
                  <ToggleLeft className="w-6 h-6 text-text-muted cursor-pointer" />
                </div>
                
                <h3 className="text-sm font-bold text-white mt-6">Variable Pricing</h3>
                
                <ul className="text-[10px] text-text-secondary space-y-2 mt-4 leading-relaxed">
                  <li>Features and limits for custom plans are determined on a per-tenant basis via manual overrides.</li>
                </ul>
              </div>

              <button className="w-full py-2 bg-slate-950/60 border border-white/5 hover:bg-white/5 text-[10px] font-bold text-white rounded cursor-pointer transition-colors mt-4">
                Manage Overrides
              </button>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'flags' && (
        <div className="space-y-6">
          {/* Info Banner showing Endpoint Null status */}
          <div className="bg-warning/5 border border-warning/15 rounded p-4 text-xs leading-relaxed text-warning flex items-start space-x-3 select-none">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-white">Feature Flag Controls Offline (null)</p>
              <p className="text-[10px] text-text-secondary mt-1">There are currently no active HTTP routers in the backend registry to persist or update feature flag states. Toggles shown below operate in offline mock mode.</p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
            <div className="flex space-x-1.5 bg-slate-950/40 p-0.5 rounded border border-white/5 text-[10px] font-bold text-text-secondary">
              <button className="px-3 py-1.5 bg-white/5 text-white rounded">All Environments</button>
              <button className="px-3 py-1.5 rounded">Production</button>
              <button className="px-3 py-1.5 rounded">Staging</button>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5 text-xs text-text-secondary">
                <span>Sort by:</span>
                <select className="bg-slate-950 border border-white/5 text-white text-[10px] font-semibold px-2 py-1.5 rounded cursor-pointer">
                  <option>Last Updated</option>
                  <option>Flag Key (A-Z)</option>
                </select>
              </div>

              <button className="px-3 py-1.5 bg-warning/10 border border-warning/20 hover:bg-warning/15 rounded text-[10px] font-bold text-warning cursor-pointer transition-colors flex items-center space-x-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>New Feature Flag</span>
              </button>
            </div>
          </div>

          {/* Feature Flags Table */}
          <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg overflow-hidden shadow-2xl">
            <div className="overflow-x-auto select-none">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-text-muted text-[10px] uppercase font-bold tracking-wider bg-slate-950/20">
                    <th className="px-6 py-4">Flag Key</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Targeting</th>
                    <th className="px-6 py-4">Environment</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: 'ai_predictive_inventory', desc: 'Enables the new ML model for forecasting stock depletion rates based on seasonal trends.', target: '20% Rollout', targetColor: 'text-warning bg-warning/10 border-warning/20', envs: ['PROD', 'STG'], active: true },
                    { key: 'whatsapp_marketing_v2', desc: 'Activates the redesigned bulk messaging interface and template builder for customer engagement.', target: '3 Tenants', targetColor: 'text-primary bg-primary/10 border-primary/20', envs: ['PROD', 'STG'], active: false },
                    { key: 'legacy_billing_deprecation', desc: 'Forces redirection from legacy payment portal to the new Stripe-integrated billing settings.', target: 'Global', targetColor: 'text-[#10b981] bg-success/15 border-success/30', envs: ['PROD', 'STG'], active: true },
                  ].map((flag) => (
                    <tr key={flag.key} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-all">
                      <td className="px-6 py-4 font-mono text-white font-bold">{flag.key}</td>
                      <td className="px-6 py-4 text-text-secondary leading-relaxed max-w-xs">{flag.desc}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block text-[9px] font-extrabold px-2.5 py-0.5 rounded border uppercase tracking-wider ${flag.targetColor}`}>
                          {flag.target}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1.5 font-bold font-mono text-[9px]">
                          {flag.envs.map((env) => (
                            <span key={env} className={`px-1.5 py-0.5 rounded border ${
                              env === 'PROD' 
                                ? 'bg-danger/5 border-danger/20 text-danger' 
                                : 'bg-[#10b981]/10 border-success/30 text-[#10b981]'
                            }`}>
                              {env}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="cursor-pointer">
                          {flag.active ? (
                            <ToggleRight className="w-7 h-7 text-primary" />
                          ) : (
                            <ToggleLeft className="w-7 h-7 text-text-muted" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
