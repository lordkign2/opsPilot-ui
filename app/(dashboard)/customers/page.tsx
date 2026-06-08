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
  ChevronRight
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface CustomerItem {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  initials: string;
  segments: { name: string; type: 'vip' | 'loyal' | 'at-risk' | 'new' }[];
  spend: string;
  orders: number;
  lastOrder: string;
  lastOrderCritical?: boolean;
}

const mockCustomers: CustomerItem[] = [
  {
    id: 'CUS-8821',
    name: 'Adeola Folami',
    phone: '+234 803 123 4567',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=80',
    initials: 'AF',
    segments: [
      { name: 'VIP', type: 'vip' },
      { name: 'Loyal', type: 'loyal' },
    ],
    spend: '₦ 4,250,000',
    orders: 142,
    lastOrder: 'Today, 10:42 AM',
  },
  {
    id: 'CUS-3390',
    name: 'Chinedu Okafor',
    phone: '+234 812 987 6543',
    avatar: '',
    initials: 'CO',
    segments: [{ name: 'At Risk', type: 'at-risk' }],
    spend: '₦ 850,000',
    orders: 24,
    lastOrder: '45 days ago',
    lastOrderCritical: true,
  },
  {
    id: 'CUS-9912',
    name: 'Ken Eze',
    phone: '+234 905 555 1234',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=80',
    initials: 'KE',
    segments: [{ name: 'New', type: 'new' }],
    spend: '₦ 45,000',
    orders: 2,
    lastOrder: 'Oct 12, 2023',
  },
  {
    id: 'CUS-1104',
    name: 'Zainab Aliyu',
    phone: '+234 809 111 2222',
    avatar: '',
    initials: 'ZA',
    segments: [{ name: 'Loyal', type: 'loyal' }],
    spend: '₦ 1,120,000',
    orders: 58,
    lastOrder: 'Oct 10, 2023',
  },
];

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getSegmentStyles = (type: string) => {
    switch (type) {
      case 'vip':
        return 'bg-warning/10 border-warning/20 text-warning';
      case 'loyal':
        return 'bg-success/10 border-success/20 text-success';
      case 'at-risk':
        return 'bg-danger/10 border-danger/20 text-danger';
      case 'new':
        return 'bg-primary/10 border-primary/20 text-primary';
      default:
        return 'bg-white/5 border-white/10 text-white';
    }
  };

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
        <div className="overflow-x-auto">
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
              {mockCustomers.map((cust) => (
                <tr
                  key={cust.id}
                  onClick={() => setSelectedCustomer(cust)}
                  className="border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer transition-all"
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-white/10 bg-slate-900 focus:ring-0" />
                  </td>
                  <td className="px-6 py-4 flex items-center space-x-3">
                    {cust.avatar ? (
                      <img src={cust.avatar} alt={cust.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-[10px]">
                        {cust.initials}
                      </div>
                    )}
                    <div>
                      <span className="text-white font-semibold block">{cust.name}</span>
                      <span className="text-[10px] text-text-muted mt-0.5 block font-mono">ID: {cust.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-text-secondary font-mono">{cust.phone}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {cust.segments.map((seg) => (
                        <span
                          key={seg.name}
                          className={`inline-flex items-center text-[9px] font-bold px-2 py-0.5 rounded-full border ${getSegmentStyles(
                            seg.type
                          )}`}
                        >
                          {seg.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-white font-mono">{cust.spend}</td>
                  <td className="px-6 py-4 text-center text-text-secondary font-mono">{cust.orders}</td>
                  <td
                    className={`px-6 py-4 text-right font-mono ${
                      cust.lastOrderCritical ? 'text-danger font-semibold' : 'text-text-secondary'
                    }`}
                  >
                    {cust.lastOrder}
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
        </div>

        {/* Pagination Table Footer */}
        <div className="bg-[#0b1120]/40 px-6 py-4 border-t border-white/5 flex items-center justify-between text-xs text-text-secondary">
          <span>
            Showing <span className="text-white font-medium">1</span> to{' '}
            <span className="text-white font-medium">4</span> of{' '}
            <span className="text-white font-medium">1,248</span> customers
          </span>
          <div className="flex space-x-2">
            <button className="p-1.5 glass-card border border-white/15 rounded hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1.5 glass-card border border-white/15 rounded hover:bg-white/5 transition-all cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Profile Side Drawer overlay */}
      <AnimatePresence>
        {selectedCustomer && (
          <>
            {/* Backdrop opacity */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
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
                  onClick={() => setSelectedCustomer(null)}
                  className="p-1.5 hover:bg-white/5 rounded text-text-secondary hover:text-white cursor-pointer transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Profile card summary */}
              <div className="flex items-center space-x-4 bg-slate-900/40 p-4 rounded-custom-md border border-white/5">
                {selectedCustomer.avatar ? (
                  <img
                    src={selectedCustomer.avatar}
                    alt={selectedCustomer.name}
                    className="w-16 h-16 rounded-full object-cover border border-primary/20"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-lg">
                    {selectedCustomer.initials}
                  </div>
                )}
                <div className="space-y-1">
                  <h3 className="text-md font-bold text-white">{selectedCustomer.name}</h3>
                  <span className="text-xs text-text-muted font-mono block">ID: {selectedCustomer.id}</span>
                  <div className="flex gap-1.5 flex-wrap pt-0.5">
                    {selectedCustomer.segments.map((seg) => (
                      <span
                        key={seg.name}
                        className={`inline-flex items-center text-[8px] font-bold px-2 py-0.5 rounded-full border ${getSegmentStyles(
                          seg.type
                        )}`}
                      >
                        {seg.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic stats row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-4 rounded-custom-sm bg-slate-900/20 border border-white/5 space-y-1">
                  <span className="text-[9px] uppercase font-semibold text-text-muted tracking-wide block">Total spend</span>
                  <span className="text-md font-bold text-white font-mono">{selectedCustomer.spend}</span>
                </div>
                <div className="glass-card p-4 rounded-custom-sm bg-slate-900/20 border border-white/5 space-y-1">
                  <span className="text-[9px] uppercase font-semibold text-text-muted tracking-wide block">Total orders</span>
                  <span className="text-md font-bold text-white font-mono">{selectedCustomer.orders}</span>
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
                <div className="bg-primary/5 border border-primary/20 rounded-custom-md p-4 text-xs leading-relaxed text-text-primary space-y-2">
                  <div className="flex items-center space-x-1.5 text-primary font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Propensity Score: High Retention</span>
                  </div>
                  <p>
                    Adeola shows a strong repeat buyer profile with zero friction flags in payment history. Her buying velocity suggests a potential re-order of spare modules around late November. We recommend targeting her with early Q4 logistics priority promos.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
