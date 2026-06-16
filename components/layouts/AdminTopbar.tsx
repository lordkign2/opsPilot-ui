'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search, User, LogOut, ChevronRight, Activity, ShieldAlert, Cpu } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import { useWebSocketSessions } from '@/hooks/useAdmin';

export default function AdminTopbar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const { data: wsSessions } = useWebSocketSessions();

  // Determine current page metadata from pathname
  const getPageMetadata = () => {
    const defaultMeta = { breadcrumbs: ['Admin Portal'], title: 'Dashboard Overview' };
    if (pathname.includes('/admin/overview')) {
      return { breadcrumbs: ['Admin Portal', 'Overview'], title: 'Platform Overview' };
    }
    if (pathname.includes('/admin/tenants')) {
      return { breadcrumbs: ['Admin Portal', 'Tenants'], title: 'Tenant Management' };
    }
    if (pathname.includes('/admin/config')) {
      return { breadcrumbs: ['Admin Portal', 'Config'], title: 'System Configurations' };
    }
    if (pathname.includes('/admin/prompts')) {
      return { breadcrumbs: ['Admin Portal', 'Prompts'], title: 'Prompt Registry & Routing' };
    }
    if (pathname.includes('/admin/models')) {
      return { breadcrumbs: ['Admin Portal', 'Models'], title: 'Model Configuration' };
    }
    if (pathname.includes('/admin/observability')) {
      return { breadcrumbs: ['Admin Portal', 'Observability'], title: 'System Telemetry' };
    }
    return defaultMeta;
  };

  const { breadcrumbs, title } = getPageMetadata();
  const activeSessionsCount = wsSessions?.length || 0;

  return (
    <header className="h-16 bg-[#0b1120] border-b border-white/5 flex items-center justify-between px-6 z-20 shrink-0 select-none">
      
      {/* Left side: Page Title & Breadcrumbs */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-1.5 text-xs text-text-muted">
          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb} className="flex items-center space-x-1.5">
              <span className={cn(idx === breadcrumbs.length - 1 ? "text-text-secondary font-medium" : "text-text-muted")}>
                {crumb}
              </span>
              {idx < breadcrumbs.length - 1 && (
                <ChevronRight className="w-3 h-3 text-text-muted" />
              )}
            </div>
          ))}
        </div>
        <h1 className="text-sm font-bold text-white tracking-wide mt-0.5">
          {title}
        </h1>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="w-4 h-4 text-text-muted absolute left-3" />
          <input
            type="text"
            placeholder="Search prompts, tenants, logs..."
            className="bg-slate-950/40 border border-white/5 text-text-primary placeholder:text-text-muted text-xs pl-9 pr-4 py-2 rounded-custom-sm focus:outline-none focus:ring-1 focus:ring-warning/40 focus:border-warning/40 w-64 transition-all"
          />
        </div>

        {/* WebSocket Session Count Indicator */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-success/15 border border-success/30 rounded-custom-sm text-xs font-semibold text-success">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span className="font-mono">{activeSessionsCount} Clients Online</span>
        </div>

        {/* System Health State */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-950/40 border border-white/5 rounded-custom-sm text-xs text-text-secondary">
          <Cpu className="w-3.5 h-3.5 text-warning" />
          <span className="font-bold text-white uppercase tracking-wider text-[10px]">SYSTEM NOMINAL</span>
        </div>

        {/* Notifications */}
        <button className="p-2 text-text-secondary hover:text-text-primary rounded-custom-sm hover:bg-white/5 transition-all relative cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-warning rounded-full shadow-[0_0_5px_#F59E0B]" />
        </button>

        {/* User profile / Logout */}
        <div className="flex items-center space-x-2 border-l border-white/5 pl-4">
          <div className="w-7 h-7 bg-warning/10 border border-warning/20 rounded-full flex items-center justify-center text-warning font-semibold text-xs shadow-[0_0_10px_rgba(245,158,11,0.05)]">
            {user?.first_name ? user.first_name[0].toUpperCase() : 'S'}
          </div>
          <div className="text-left hidden md:block select-none">
            <p className="text-xs font-semibold text-white leading-tight">
              {user?.first_name || 'Admin'} {user?.last_name || 'System'}
            </p>
            <p className="text-[10px] text-text-muted capitalize">
              {user?.role === 'super_admin' ? 'Superuser' : 'Administrator'}
            </p>
          </div>
          
          <button
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            className="p-2 text-text-secondary hover:text-danger rounded-custom-sm hover:bg-white/5 transition-all ml-2 cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
