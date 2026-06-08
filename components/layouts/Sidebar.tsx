'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, ShoppingCart, CreditCard, MessageSquare, BarChart2, Settings, ChevronLeft, ChevronRight, Rocket } from 'lucide-react';
import { useSidebarStore } from '@/store/useSidebarStore';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'AI Assistant', href: '/ai', icon: MessageSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'Settings', href: '/settings', icon: Settings },
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
      <div className="h-16 flex items-center px-4 border-b border-white/5 justify-between">
        <Link href="/" className="flex items-center space-x-2.5 overflow-hidden">
          <div className="w-8 h-8 min-w-[32px] rounded-custom-sm bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_10px_rgba(0,245,255,0.05)]">
            <Rocket className="w-4 h-4 text-primary" />
          </div>
          {!isCollapsed && (
            <span className="text-md font-bold tracking-wider text-white uppercase animate-fade-in">
              OpsPilot
            </span>
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

      {/* Collapse Toggle Button */}
      <div className="p-3 border-t border-white/5 flex justify-end">
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

