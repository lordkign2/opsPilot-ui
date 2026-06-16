'use client';

import Sidebar from '@/components/layouts/Sidebar';
import Topbar from '@/components/layouts/Topbar';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isWorkflows = pathname === '/workflows';

  return (
    <div className="flex h-screen bg-background text-text-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className={cn(
          "flex-1 overflow-hidden",
          isWorkflows ? "bg-[#070b15]" : "overflow-y-auto bg-[#0e1628]/40 p-6"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}
