'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Download,
  Search,
  Filter,
  Calendar,
  MoreVertical,
  X,
  TrendingUp,
  History,
  CreditCard,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import Button from '@/components/ui/Button';
import {
  useCustomers,
  useSearchCustomers,
  useCustomerInsights
} from '@/hooks/useCustomers';

interface CustomerItem {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  spend?: string;
  orders?: number;
  lastOrder?: string;
}

export default function CustomersPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 20;

  // React Query hooks for fetching data
  const { data: regularData, isLoading: listLoading, error: listError } = useCustomers(page, perPage);
  const { data: searchData, isLoading: searchLoading } = useSearchCustomers(searchQuery, page, perPage);

  // Dynamic values based on search state
  const isSearching = !!searchQuery.trim();
  const isLoading = isSearching ? searchLoading : listLoading;
  const apiResponse = isSearching ? searchData : regularData;
  const customers = apiResponse?.data || [];
  const totalItems = apiResponse?.total || 0;

  // Drawer details hook
  const { data: customerInsights, isLoading: insightsLoading } = useCustomerInsights(selectedCustomerId);

  const getSegmentStyles = (index: number) => {
    // Generate segment types based on mock data rules for display
    const types = ['vip', 'loyal', 'new'];
    const type = types[index % types.length];
    switch (type) {
      case 'vip':
        return 'bg-warning/10 border-warning/20 text-warning';
      case 'loyal':
        return 'bg-success/10 border-success/20 text-success';
      case 'new':
        return 'bg-primary/10 border-primary/20 text-primary';
      default:
        return 'bg-white/5 border-white/10 text-white';
    }
  };

  const getSegmentLabel = (index: number) => {
    const labels = ['VIP', 'Loyal', 'New'];
    return labels[index % labels.length];
  };

  // Find currently active customer from the list
  const activeCustomer = customers.find((c: any) => c.id === selectedCustomerId);

  return (
    <div className="space-y-6 relative h-full">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide uppercase">Customer Directory</h1>
          <p className="text-xs text-text-secondary mt-1">
            Manage and segment your AI-profiled customer base.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2 text-xs">
            <Download className="w-4 h-4 text-text-secondary" />
            <span>Export</span>
          </Button>
          <Button variant="primary" className="flex items-center space-x-2 text-xs">
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </Button>
        </div>
      </div>

      {/* Filter and search row */}
      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, or ID..."
            className="w-full glass-input pl-9 pr-4 py-2.5 text-xs rounded-custom-sm"
          />
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 glass-card hover:bg-white/5 border border-white/10 px-4 py-2 rounded-custom-sm text-xs text-text-secondary cursor-pointer transition-all">
            <Filter className="w-4 h-4 text-primary" />
            <span>All Segments</span>
          </button>
          <button className="flex items-center space-x-2 glass-card hover:bg-white/5 border border-white/10 px-4 py-2 rounded-custom-sm text-xs text-text-secondary cursor-pointer transition-all">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Any Date</span>
          </button>
        </div>
      </div>

      {/* Customers Table Container */}
      <div className="glass-card rounded-custom-md border border-white/5 bg-slate-900/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto min-h-[200px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : listError ? (
            <div className="p-8 text-center text-xs text-danger">
              ⚠️ Failed to load customers from backend. Ensure API server is running.
            </div>
          ) : customers.length === 0 ? (
            <div className="p-12 text-center text-xs text-text-muted">
              No customers found. Click "Add Customer" to create one.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-text-muted text-[10px] uppercase font-semibold">
                  <th className="px-6 py-4 w-12">
                    <input type="checkbox" className="rounded border-white/10 bg-slate-900 focus:ring-0" />
                  </th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">AI Segments</th>
                  <th className="px-6 py-4 text-right">Total Spend</th>
                  <th className="px-6 py-4 text-center">Orders</th>
                  <th className="px-6 py-4 text-right">Last Order</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((cust: any, index: number) => (
                  <tr
                    key={cust.id}
                    onClick={() => setSelectedCustomerId(cust.id)}
                    className="border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer transition-all"
                  >
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-white/10 bg-slate-900 focus:ring-0" />
                    </td>
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-[10px]">
                        {cust.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-white font-semibold block">{cust.name}</span>
                        <span className="text-[10px] text-text-muted mt-0.5 block font-mono">ID: {cust.id.slice(0, 8)}...</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary font-mono">{cust.phone}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center text-[9px] font-bold px-2 py-0.5 rounded-full border ${getSegmentStyles(
                            index
                          )}`}
                        >
                          {getSegmentLabel(index)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-white font-mono">₦ {((index + 1) * 350000).toLocaleString()}</td>
                    <td className="px-6 py-4 text-center text-text-secondary font-mono">{(index + 1) * 12}</td>
                    <td className="px-6 py-4 text-right font-mono text-text-secondary">
                      {index % 2 === 0 ? 'Today, 10:42 AM' : 'Oct 10, 2023'}
                    </td>
                    <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button className="p-1 hover:bg-white/5 rounded text-text-secondary hover:text-white cursor-pointer transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Table Footer */}
        <div className="bg-[#0b1120]/40 px-6 py-4 border-t border-white/5 flex items-center justify-between text-xs text-text-secondary">
          <span>
            Showing <span className="text-white font-medium">{(page - 1) * perPage + 1}</span> to{' '}
            <span className="text-white font-medium">
              {Math.min(page * perPage, totalItems)}
            </span> of{' '}
            <span className="text-white font-medium">{totalItems}</span> customers
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-1.5 glass-card border border-white/15 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => (p * perPage < totalItems ? p + 1 : p))}
              disabled={page * perPage >= totalItems}
              className="p-1.5 glass-card border border-white/15 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Profile Side Drawer overlay */}
      <AnimatePresence>
        {activeCustomer && (
          <>
            {/* Backdrop opacity */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomerId(null)}
              className="absolute inset-0 bg-slate-950/80 z-40 rounded-custom-md"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-full max-w-[480px] bg-surface border-l border-white/5 shadow-2xl z-50 p-6 flex flex-col space-y-6 overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Customer Profile</span>
                </div>
                <button
                  onClick={() => setSelectedCustomerId(null)}
                  className="p-1.5 hover:bg-white/5 rounded text-text-secondary hover:text-white cursor-pointer transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile card summary */}
              <div className="flex items-center space-x-4 bg-slate-900/40 p-4 rounded-custom-md border border-white/5">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-lg">
                  {activeCustomer.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="space-y-1">
                  <h3 className="text-md font-bold text-white">{activeCustomer.name}</h3>
                  <span className="text-xs text-text-muted font-mono block">ID: {activeCustomer.id}</span>
                </div>
              </div>

              {/* Dynamic stats row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-custom-sm bg-slate-900/20 border border-white/5 space-y-1">
                  <span className="text-[9px] uppercase font-semibold text-text-muted tracking-wide block">Total spend</span>
                  <span className="text-md font-bold text-white font-mono">₦ 1,450,000</span>
                </div>
                <div className="glass-card p-4 rounded-custom-sm bg-slate-900/20 border border-white/5 space-y-1">
                  <span className="text-[9px] uppercase font-semibold text-text-muted tracking-wide block">Total orders</span>
                  <span className="text-md font-bold text-white font-mono">24</span>
                </div>
              </div>

              {/* Order History */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
                  <History className="w-4 h-4 text-primary" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Order History</h4>
                </div>
                <div className="space-y-2">
                  {[
                    { id: 'ORD-2023-8842', desc: 'Industrial AI Sensor Module', status: 'Delivered', date: 'Oct 24, 2023', amt: '₦290,000' },
                    { id: 'ORD-2023-8711', desc: 'Edge Gateway Router', status: 'Delivered', date: 'Sep 15, 2023', amt: '₦85,000' }
                  ].map((ord) => (
                    <div key={ord.id} className="p-3 bg-slate-900/40 rounded-custom-sm border border-white/5 flex items-center justify-between text-xs hover:bg-white/5 transition-all">
                      <div>
                        <span className="font-semibold text-white block">{ord.id}</span>
                        <span className="text-[10px] text-text-muted block mt-0.5">{ord.desc}</span>
                        <span className="text-[10px] text-text-muted block mt-0.5">{ord.date}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-mono block">{ord.amt}</span>
                        <span className="inline-flex items-center text-[9px] font-bold text-success mt-1 uppercase">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment History */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Payment History</h4>
                </div>
                <div className="space-y-2">
                  {[
                    { ref: 'TRX-9982-AB', method: 'Bank Transfer', status: 'Fully Paid', amt: '₦290,000' }
                  ].map((pay) => (
                    <div key={pay.ref} className="p-3 bg-slate-900/40 rounded-custom-sm border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-white block">{pay.ref}</span>
                        <span className="text-[10px] text-text-muted block mt-0.5">{pay.method}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-mono block">{pay.amt}</span>
                        <span className="inline-flex items-center text-[9px] font-bold text-success mt-1 uppercase">
                          {pay.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights Card */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 border-b border-white/5 pb-2">
                  <MessageSquare className="w-4 h-4 text-primary animate-pulse" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Customer Insights</h4>
                </div>
                {insightsLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                ) : customerInsights ? (
                  <div className="bg-primary/5 border border-primary/20 rounded-custom-md p-4 text-xs leading-relaxed text-text-primary space-y-2">
                    <div className="flex items-center space-x-1.5 text-primary font-bold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Behavioral Profile</span>
                    </div>
                    <p className="whitespace-pre-wrap">{customerInsights.insights || customerInsights}</p>
                  </div>
                ) : (
                  <div className="text-text-muted text-xs p-2">No behavioral insights compiled for this customer.</div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
