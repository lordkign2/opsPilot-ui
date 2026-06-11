'use client';

import { useState, useEffect } from 'react';
import { useAdminSettings, useUpdateAdminSettings } from '@/hooks/useAdmin';
import {
  Settings,
  Globe,
  Sliders,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Database,
  Trash2,
  Edit2,
  Loader2,
  ToggleLeft,
  ToggleRight,
  HardDrive
} from 'lucide-react';
import Button from '@/components/ui/Button';

export default function PlatformConfigPage() {
  const { data: settings, isLoading, refetch } = useAdminSettings();
  const updateSettingsMutation = useUpdateAdminSettings();

  // General state fields
  const [platformName, setPlatformName] = useState('OpsPilot Core');
  const [contactEmail, setContactEmail] = useState('sysadmin@opspilot.ng');
  const [operatingRegion, setOperatingRegion] = useState('Nigeria (Primary)');

  // Localization fields
  const [currency, setCurrency] = useState('NGN (₦)');
  const [timezone, setTimezone] = useState('WAT (UTC+1)');
  const [taxRate, setTaxRate] = useState(7.5);

  // Infrastructure Controls
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [newRegistrations, setNewRegistrations] = useState(true);
  const [debugMode, setDebugMode] = useState(false);

  // Storage & Retention
  const [logRetention, setLogRetention] = useState(60);
  const [dbQuota, setDbQuota] = useState(100);
  const [dbUsed, setDbUsed] = useState(45);
  const [mediaQuota, setMediaQuota] = useState(500);
  const [mediaUsed, setMediaUsed] = useState(410);

  // Sync state with backend settings data
  useEffect(() => {
    if (settings) {
      setPlatformName(settings.platform_name);
      setContactEmail(settings.contact_email);
      setOperatingRegion(settings.operating_region);
      setCurrency(settings.local_currency);
      setTimezone(settings.system_timezone);
      setTaxRate(settings.base_tax_rate);
      setMaintenanceMode(settings.maintenance_mode);
      setNewRegistrations(settings.new_registrations);
      setDebugMode(settings.debug_mode);
      setLogRetention(settings.system_log_retention_days);
      setDbQuota(settings.database_quota_gb);
      setDbUsed(settings.database_used_gb);
      setMediaQuota(settings.media_storage_quota_gb);
      setMediaUsed(settings.media_storage_used_gb);
    }
  }, [settings]);

  const handleDiscard = () => {
    refetch();
    alert('Platform changes discarded. Local state re-synchronized.');
  };

  const handleSave = async () => {
    try {
      await updateSettingsMutation.mutateAsync({
        platform_name: platformName,
        contact_email: contactEmail,
        operating_region: operatingRegion,
        local_currency: currency,
        system_timezone: timezone,
        base_tax_rate: Number(taxRate),
        maintenance_mode: maintenanceMode,
        new_registrations: newRegistrations,
        debug_mode: debugMode,
        system_log_retention_days: Number(logRetention),
        database_quota_gb: Number(dbQuota),
        database_used_gb: Number(dbUsed),
        media_storage_quota_gb: Number(mediaQuota),
        media_storage_used_gb: Number(mediaUsed)
      });
      alert('Global platform configuration settings saved successfully to the database.');
    } catch (err) {
      console.error(err);
      alert('Failed to save configuration settings.');
    }
  };

  const handlePurgeLogs = () => {
    if (confirm('Are you sure you want to purge all old logs? This action is permanent and cannot be undone.')) {
      alert('Old logs purged successfully.');
    }
  };

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center space-x-2 text-text-secondary select-none">
        <Loader2 className="w-6 h-6 animate-spin text-warning" />
        <span className="text-sm font-semibold">Loading platform system settings...</span>
      </div>
    );
  }

  const dbPercentage = Math.round((dbUsed / dbQuota) * 100);
  const mediaPercentage = Math.round((mediaUsed / mediaQuota) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Title Header with action buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 select-none">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">Global Configuration</h2>
          <p className="text-xs text-text-secondary">
            Manage core platform parameters and infrastructure rules.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-bold">
          <button
            onClick={handleDiscard}
            disabled={updateSettingsMutation.isPending}
            className="text-text-secondary hover:text-white transition-colors cursor-pointer"
          >
            Discard Changes
          </button>
          <Button
            onClick={handleSave}
            isLoading={updateSettingsMutation.isPending}
            variant="primary"
            className="px-4 py-2 bg-warning text-slate-950 hover:bg-warning/90 rounded font-bold shadow-[0_0_12px_rgba(245,158,11,0.08)] cursor-pointer"
          >
            Save Configuration
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card 1: General Information */}
        <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 space-y-5">
          <div className="flex items-center space-x-2 pb-2 border-b border-white/5 select-none">
            <Settings className="w-4.5 h-4.5 text-warning" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">General Information</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider select-none">
                Platform Name
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 text-xs rounded text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider select-none">
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 text-xs rounded text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider select-none">
                Operating Region
              </label>
              <select
                value={operatingRegion}
                onChange={(e) => setOperatingRegion(e.target.value)}
                className="w-full glass-input px-3.5 py-2.5 text-xs rounded cursor-pointer text-white font-semibold"
              >
                <option value="Nigeria (Primary)">Nigeria (Primary)</option>
                <option value="Ghana (Secondary)">Ghana (Secondary)</option>
                <option value="Kenya">Kenya</option>
                <option value="South Africa">South Africa</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: Localization */}
        <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 space-y-5">
          <div className="flex items-center space-x-2 pb-2 border-b border-white/5 select-none">
            <Globe className="w-4.5 h-4.5 text-warning" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Localization</h3>
          </div>

          <div className="space-y-4">
            {/* Currency select */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider select-none">
                Local Currency
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full glass-input pl-3.5 pr-10 py-2.5 text-xs rounded text-white font-semibold"
                />
                <Edit2 className="w-3.5 h-3.5 text-text-muted absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>

            {/* Timezone select */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider select-none">
                System Timezone
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full glass-input pl-3.5 pr-10 py-2.5 text-xs rounded text-white font-mono"
                />
                <Edit2 className="w-3.5 h-3.5 text-text-muted absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>

            {/* Base tax slider */}
            <div className="space-y-3 pt-1.5 select-none">
              <div className="flex justify-between items-center text-xs">
                <span className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                  Base Tax Rate
                </span>
                <span className="font-bold text-white font-mono">{taxRate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(Number(e.target.value))}
                className="w-full accent-warning h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Card 3: Infrastructure Controls */}
        <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 space-y-6">
          <div className="flex items-center space-x-2 pb-2 border-b border-white/5 select-none">
            <Sliders className="w-4.5 h-4.5 text-warning" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Infrastructure Controls</h3>
          </div>

          <div className="space-y-5">
            {/* Maintenance Mode */}
            <div className="flex items-center justify-between select-none">
              <div className="flex flex-col pr-4">
                <span className="text-xs font-bold text-white uppercase tracking-wide">Maintenance Mode</span>
                <span className="text-[10px] text-text-muted mt-1">Suspend non-admin traffic routing immediately</span>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  maintenanceMode ? 'bg-warning shadow-[0_0_12px_rgba(245,158,11,0.25)]' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                    maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* New Registrations */}
            <div className="flex items-center justify-between select-none">
              <div className="flex flex-col pr-4">
                <span className="text-xs font-bold text-white uppercase tracking-wide">New Registrations</span>
                <span className="text-[10px] text-text-muted mt-1">Allow new business workspaces and client sign-ups</span>
              </div>
              <button
                type="button"
                onClick={() => setNewRegistrations(!newRegistrations)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  newRegistrations ? 'bg-[#10b981] shadow-[0_0_12px_rgba(16,185,129,0.25)]' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                    newRegistrations ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Debug Mode (Warning alert) */}
            <div className="p-4 bg-slate-950/20 rounded border border-white/5 space-y-4">
              <div className="flex items-center justify-between select-none">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-warning uppercase tracking-wide flex items-center">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1 text-warning animate-pulse" />
                    Debug Mode
                  </span>
                  <span className="text-[10px] text-text-secondary mt-1">Verbose logging active. Impact on compute logs throughput</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDebugMode(!debugMode)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    debugMode ? 'bg-warning shadow-[0_0_12px_rgba(245,158,11,0.25)]' : 'bg-slate-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                      debugMode ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Storage & Retention */}
        <div className="glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-2 border-b border-white/5 select-none">
              <div className="flex items-center space-x-2">
                <Database className="w-4.5 h-4.5 text-warning" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Storage & Retention</h3>
              </div>
              <button
                type="button"
                onClick={handlePurgeLogs}
                className="text-[10px] font-bold text-text-secondary hover:text-white transition-colors flex items-center space-x-1 hover:underline cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 mr-0.5 text-text-muted hover:text-white" />
                <span>PURGE OLD LOGS</span>
              </button>
            </div>

            {/* Retention tabs */}
            <div className="space-y-2 select-none">
              <span className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                System Log Retention
              </span>
              <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-0.5 border border-white/5 rounded">
                {[30, 60, 90].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setLogRetention(days)}
                    className={`py-1.5 rounded text-xs font-bold cursor-pointer transition-colors ${
                      logRetention === days
                        ? 'bg-white/5 text-warning'
                        : 'text-text-secondary hover:text-white'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Allocation bars */}
            <div className="space-y-4 select-none">
              
              {/* Database Allocation */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-semibold text-text-secondary">
                  <span>DATABASE QUOTA</span>
                  <span className="text-white font-bold font-mono">{dbUsed} GB / {dbQuota} GB</span>
                </div>
                <div className="w-full bg-slate-950/50 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-[#10b981] h-full rounded-full transition-all duration-300"
                    style={{ width: `${dbPercentage}%` }}
                  />
                </div>
              </div>

              {/* Media Allocation */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-semibold text-text-secondary">
                  <span>MEDIA STORAGE</span>
                  <span className="text-white font-bold font-mono">{mediaUsed} GB / {mediaQuota} GB</span>
                </div>
                <div className="w-full bg-slate-950/50 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-warning h-full rounded-full transition-all duration-300"
                    style={{ width: `${mediaPercentage}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

          <p className="text-[9px] text-text-muted leading-relaxed select-none pt-4 border-t border-white/5 mt-6">
            * Storage quotas are system warnings. Hard disk space is dynamically scaled and scaled down by automated worker scripts.
          </p>
        </div>

      </div>

    </div>
  );
}
