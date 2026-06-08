import Sidebar from '@/components/layouts/Sidebar';
import Topbar from '@/components/layouts/Topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background text-text-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#0e1628]/40 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

