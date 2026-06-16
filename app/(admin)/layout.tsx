'use client';

import AdminSidebar from '@/components/layouts/AdminSidebar';
import AdminTopbar from '@/components/layouts/AdminTopbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background text-text-primary">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto bg-[#0e1628]/40 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
