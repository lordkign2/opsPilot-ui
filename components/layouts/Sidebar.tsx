'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  BarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Rocket,
  Store,
  Package,
  Lock,
  HelpCircle
} from 'lucide-react';
import { useSidebarStore } from '@/store/useSidebarStore';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'POS', href: '/pos', icon: Store },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'AI Assistant', href: '/ai', icon: MessageSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapsed } = useSidebarStore();

  return (
    <aside
      className={cn(
        "h-screen bg-[#0b1120] border-r border-white/5 flex flex-col transition-all duration-300 z-30 select-none relative",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header / Logo */}
      <div className="h-20 flex flex-col justify-center px-4 border-b border-white/5 overflow-hidden">
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 min-w-[32px] rounded-custom-sm bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_10px_rgba(0,245,255,0.05)]">
            <Rocket className="w-4 h-4 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-base font-black tracking-wider text-white uppercase font-sans leading-none">
                OpsPilot
              </span>
              <span className="text-[8px] font-bold text-text-muted tracking-widest uppercase mt-1">
                MISSION CONTROL
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-custom-sm transition-all duration-200 group relative",
                isActive
                  ? "bg-primary/5 text-primary border-l-2 border-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className={cn("w-5 h-5 min-w-[20px]", isActive ? "text-primary animate-pulse" : "text-text-secondary group-hover:text-text-primary")} />
              
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

      {/* Bottom Area: Open Register & Settings/Support */}
      <div className="p-3 border-t border-white/5 space-y-3">
        {/* Open Register */}
        <button
          className={cn(
            "w-full py-2.5 flex items-center justify-center rounded-custom-md border transition-all duration-200 text-xs font-semibold cursor-pointer",
            "bg-slate-900/40 border-white/5 text-white hover:bg-white/5 hover:border-white/10"
          )}
        >
          <Lock className="w-4 h-4 mr-2 text-text-secondary" />
          {!isCollapsed && <span>Open Register</span>}
        </button>

        {/* Settings / Support Row */}
        {!isCollapsed ? (
          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-text-secondary">
            <Link
              href="/settings"
              className="flex flex-col items-center justify-center py-2 rounded-custom-sm border border-transparent hover:border-white/5 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
              <Settings className="w-4 h-4 mb-1" />
              <span>Settings</span>
            </Link>
            <button
              className="flex flex-col items-center justify-center py-2 rounded-custom-sm border border-transparent hover:border-white/5 hover:bg-white/5 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 mb-1" />
              <span>Support</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Link
              href="/settings"
              className="p-2 rounded hover:bg-white/5 text-text-secondary hover:text-white"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
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


