'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building,
  Sliders,
  Terminal,
  Cpu,
  Activity,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Settings,
  HelpCircle,
  Zap,
  Lock
} from 'lucide-react';
import { useSidebarStore } from '@/store/useSidebarStore';
import { cn } from '@/lib/utils';

const adminNavItems = [
  { name: 'Security Audit', href: '/admin/overview', icon: ShieldAlert },
  { name: 'Tenants', href: '/admin/tenants', icon: Building },
  { name: 'MFA Config', href: '/admin/mfa', icon: Lock },
  { name: 'API Management', href: '/admin/prompts', icon: Terminal },
  { name: 'Platform Settings', href: '/admin/platform', icon: Settings },
  { name: 'System Telemetry', href: '/admin/observability', icon: Activity },
  { name: 'Node Control', href: '/admin/models', icon: Cpu },
];


export default function AdminSidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapsed } = useSidebarStore();

  return (
    <aside
      className={cn(
        "h-screen bg-[#0b1120] border-r border-white/5 flex flex-col transition-all duration-300 z-30 select-none relative shrink-0",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header / Logo */}
      <div className="h-20 flex flex-col justify-center px-4 border-b border-white/5 overflow-hidden">
        <Link href="/admin/overview" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 min-w-[32px] rounded-custom-sm bg-warning/10 border border-warning/20 flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.05)]">
            <ShieldAlert className="w-4 h-4 text-warning" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-base font-black tracking-wider text-white uppercase font-sans leading-none">
                OpsPilot
              </span>
              <span className="text-[7px] font-bold text-warning tracking-widest uppercase mt-1">
                SUPER ADMIN PORTAL
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-custom-sm transition-all duration-200 group relative",
                isActive
                  ? "bg-warning/5 text-warning border-l-2 border-warning"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className={cn("w-5 h-5 min-w-[20px]", isActive ? "text-warning animate-pulse" : "text-text-secondary group-hover:text-text-primary")} />
              
              {!isCollapsed && (
                <span className="ml-3 text-sm font-medium transition-all duration-300">
                  {item.name}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-14 hidden group-hover:block bg-[#111827] border border-white/10 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Area */}
      <div className="p-3 border-t border-white/5 space-y-3">
        {/* Deploy Update Action */}
        <button
          className={cn(
            "w-full py-2.5 flex items-center justify-center rounded-custom-md border transition-all duration-200 text-xs font-semibold cursor-pointer",
            "bg-warning/10 border-warning/20 text-warning hover:bg-warning/15 hover:border-warning/30"
          )}
        >
          <Zap className="w-4 h-4 mr-2" />
          {!isCollapsed && <span>Deploy Update</span>}
        </button>

        {/* Settings / Support Row */}
        {!isCollapsed ? (
          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-text-secondary">
            <button
              className="flex flex-col items-center justify-center py-2 rounded-custom-sm border border-transparent hover:border-white/5 hover:bg-white/5 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <Settings className="w-4 h-4 mb-1" />
              <span>Settings</span>
            </button>
            <button
              className="flex flex-col items-center justify-center py-2 rounded-custom-sm border border-transparent hover:border-white/5 hover:bg-white/5 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 mb-1" />
              <span>Support</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <button
              className="p-2 rounded hover:bg-white/5 text-text-secondary hover:text-white cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Collapse Toggle Button */}
        <button
          onClick={toggleCollapsed}
          className="w-full py-1.5 flex items-center justify-center rounded-custom-sm text-text-secondary hover:text-text-primary hover:bg-white/5 cursor-pointer border border-white/5 bg-[#0b1120]"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center space-x-2 text-xs">
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Menu</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
