'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search, User, LogOut, ChevronRight, Briefcase } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

export default function Topbar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  // Generate breadcrumb links from path
  const getBreadcrumbs = () => {
    if (pathname === '/') return ['Dashboard'];
    const parts = pathname.split('/').filter(Boolean);
    return ['Dashboard', ...parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1))];
  };

  const breadcrumbs = getBreadcrumbs();
  const currentPageTitle = breadcrumbs[breadcrumbs.length - 1];

  return (
    <header className="h-16 bg-[#0b1120] border-b border-white/5 flex items-center justify-between px-6 z-20">
      
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
          {currentPageTitle}
        </h1>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="w-4 h-4 text-text-muted absolute left-3" />
          <input
            type="text"
            placeholder="Search operations..."
            className="bg-slate-950/40 border border-white/5 text-text-primary placeholder:text-text-muted text-xs pl-9 pr-4 py-2 rounded-custom-sm focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 w-64 transition-all"
          />
        </div>

        {/* Notifications */}
        <button className="p-2 text-text-secondary hover:text-text-primary rounded-custom-sm hover:bg-white/5 transition-all relative cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_5px_#00F5FF]" />
        </button>

        {/* Workspace Switcher */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-950/40 border border-white/5 px-3 py-1.5 rounded-custom-sm text-xs text-text-secondary select-none">
          <Briefcase className="w-3.5 h-3.5 text-primary" />
          <span className="font-semibold text-white truncate max-w-[120px]">
            {user?.business_id ? 'Workspace Core' : 'Setup Required'}
          </span>
        </div>

        {/* User profile / Logout */}
        <div className="flex items-center space-x-2 border-l border-white/5 pl-4">
          <div className="w-7 h-7 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary font-semibold text-xs shadow-[0_0_10px_rgba(0,245,255,0.05)]">
            {user?.first_name ? user.first_name[0].toUpperCase() : 'A'}
          </div>
          <div className="text-left hidden md:block select-none">
            <p className="text-xs font-semibold text-white leading-tight">
              {user?.first_name || 'Admin'} {user?.last_name || ''}
            </p>
            <p className="text-[10px] text-text-muted capitalize">
              {user?.role || 'Manager'}
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

