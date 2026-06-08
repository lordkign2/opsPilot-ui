'use client';

import { useState } from 'react';
import { useAdminSystemHealth, useToggleMaintenance, useBroadcastSystemAlert } from '@/hooks/useAdmin';
import { Sliders, AlertTriangle, Radio, ShieldAlert, Cpu, Check, Loader2, Volume2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function SystemConfig() {
  const { data: health, isLoading: isHealthLoading, refetch } = useAdminSystemHealth();
  const toggleMutation = useToggleMaintenance();
  const broadcastMutation = useBroadcastSystemAlert();

  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [eventType, setEventType] = useState('system_alert');
  const [maintenanceInput, setMaintenanceInput] = useState(false);

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
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">System Configurations</h2>
        <p className="text-xs text-text-secondary mt-1">Configure global variables, toggle system flags, and direct cluster behaviors.</p>
      </div>

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

    </div>
  );
}
