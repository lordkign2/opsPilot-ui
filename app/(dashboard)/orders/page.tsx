'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Download,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Kanban,
  TableProperties,
  ArrowRight,
  Eye,
  Plus,
  Loader2
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useOrders } from '@/hooks/useOrders';
import { useCustomers } from '@/hooks/useCustomers';
import { Order, Customer } from '@/types/api';

interface OrderItem {
  id: string;
  customerName: string;
  customerEmail: string;
  itemsCount: string;
  amount: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  created: string;
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 20;

  // React Query hooks
  const { data: regularData, isLoading: ordersLoading, error: ordersError } = useOrders(page, perPage);
  const { data: customerData } = useCustomers(1, 100); // load customer context to resolve IDs

  const orders = (regularData?.data || []) as Order[];
  const totalItems = regularData?.total || 0;
  const customers = (customerData?.data || []) as Customer[];

  const getCustomerInfo = (customerId: string) => {
    const cust = customers.find((c: Customer) => c.id === customerId);
    return {
      name: cust?.name || 'Customer Workspace',
      email: cust?.email || 'procurement@workspace.io',
    };
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'PROCESSING':
        return 'bg-primary/10 border-primary/20 text-primary';
      case 'PENDING':
        return 'bg-warning/10 border-warning/20 text-warning';
      case 'COMPLETED':
        return 'bg-success/10 border-success/20 text-success';
      case 'CANCELLED':
        return 'bg-danger/10 border-danger/20 text-danger';
      default:
        return 'bg-white/5 border-white/10 text-white';
    }
  };

  // Filter and process orders
  const processedOrders: OrderItem[] = orders.map((ord: Order) => {
    const custInfo = getCustomerInfo(ord.customer_id);
    return {
      id: ord.id,
      customerName: custInfo.name,
      customerEmail: custInfo.email,
      itemsCount: '1 item', // Mock/default items quantity based on total
      amount: `₦ ${ord.total_amount.toLocaleString()}`,
      status: ord.status.toUpperCase() as OrderItem['status'],
      created: new Date(ord.created_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  });

  const filteredOrders = processedOrders.filter((ord: OrderItem) => {
    const matchesSearch =
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'ALL' || ord.status === activeTab;
    return matchesSearch && matchesTab;
  });


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide uppercase">Order Queue</h1>
          <p className="text-xs text-text-secondary mt-1">
            Manage and track inbound operational requests.
          </p>
        </div>
        <div className="flex space-x-3">
          {/* View Switcher Toggle */}
          <div className="flex bg-slate-950/40 border border-white/5 rounded-custom-sm p-0.5 text-xs text-text-secondary select-none">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-custom-sm cursor-pointer transition-all ${
                viewMode === 'table' ? 'bg-white/5 text-white font-semibold' : 'hover:text-text-primary'
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-custom-sm cursor-pointer transition-all ${
                viewMode === 'kanban' ? 'bg-white/5 text-white font-semibold' : 'hover:text-text-primary'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
          </div>

          <Button variant="outline" className="flex items-center space-x-2 text-xs">
            <Download className="w-4 h-4 text-text-secondary" />
            <span>Export</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2 text-xs">
            <Filter className="w-4 h-4 text-text-secondary" />
            <span>Advanced Filter</span>
          </Button>
        </div>
      </div>

      {/* Tabs list (mockup design tabs) */}
      {viewMode === 'table' && (
        <div className="flex border-b border-white/5 space-x-6 text-xs overflow-x-auto pb-0.5 select-none">
          {[
            { id: 'ALL', label: 'All Orders', count: 1204 },
            { id: 'PENDING', label: 'Pending' },
            { id: 'PROCESSING', label: 'Processing' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'CANCELLED', label: 'Cancelled' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 font-semibold uppercase tracking-wider relative cursor-pointer transition-colors ${
                  isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="text-[9px] bg-slate-900 border border-white/5 px-2 py-0.5 rounded-full text-text-muted">
                      {tab.count}
                    </span>
                  )}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="ordersTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Table / Kanban toggle renderer */}
      {ordersLoading ? (
        <div className="flex items-center justify-center min-h-[300px] glass-card rounded-custom-md border border-white/5">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : ordersError ? (
        <div className="p-8 text-center text-xs text-danger glass-card rounded-custom-md border border-white/5 bg-slate-900/10">
          ⚠️ Failed to load orders from backend. Ensure API server is running.
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="p-12 text-center text-xs text-text-muted glass-card rounded-custom-md border border-white/5 bg-slate-900/10">
          No orders found in this queue.
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW MATCHING MOCKUP */
        <div className="glass-card rounded-custom-md border border-white/5 bg-slate-900/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-text-muted text-[10px] uppercase font-semibold">
                  <th className="px-6 py-4 w-12">
                    <input type="checkbox" className="rounded border-white/10 bg-slate-900 focus:ring-0" />
                  </th>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Created</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord: OrderItem) => (
                  <tr
                    key={ord.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-all group"
                  >
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-white/10 bg-slate-900 focus:ring-0" />
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-primary">
                      <Link href={`/orders/${ord.id}`} className="hover:underline flex items-center space-x-1.5">
                        <span>#{ord.id.slice(0, 8)}</span>
                        <Eye className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-semibold block">{ord.customerName}</span>
                      <span className="text-[10px] text-text-muted block mt-0.5 font-mono">{ord.customerEmail}</span>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{ord.itemsCount}</td>
                    <td className="px-6 py-4 text-right text-white font-mono">{ord.amount}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center text-[9px] font-bold px-2 py-0.5 rounded border ${getStatusStyles(
                          ord.status
                        )}`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-text-secondary font-mono">{ord.created}</td>
                    <td className="px-6 py-4 text-center">
                      <Link href={`/orders/${ord.id}`}>
                        <button className="p-1 hover:bg-white/5 rounded text-text-secondary hover:text-white cursor-pointer transition-all">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="bg-[#0b1120]/40 px-6 py-4 border-t border-white/5 flex items-center justify-between text-xs text-text-secondary">
            <span>
              Showing <span className="text-white font-medium">{(page - 1) * perPage + 1}</span> to{' '}
              <span className="text-white font-medium">{Math.min(page * perPage, totalItems)}</span> of{' '}
              <span className="text-white font-medium">{totalItems}</span> entries
            </span>
            <div className="flex items-center space-x-4">
              <span className="text-text-muted">
                Page {page} of {Math.ceil(totalItems / perPage) || 1}
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
        </div>
      ) : (
        /* KANBAN BOARD VIEW MATCHING ROADMAP */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'] as const).map((col) => {
            const colOrders = filteredOrders.filter((ord: OrderItem) => ord.status === col);
            return (
              <div key={col} className="glass-card rounded-custom-md border border-white/5 bg-slate-900/10 flex flex-col h-[520px]">
                {/* Column Header */}
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-slate-900/20">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{col}</span>
                  <span className="text-[10px] bg-slate-950 border border-white/5 px-2 py-0.5 rounded-full text-text-muted">
                    {colOrders.length}
                  </span>
                </div>

                {/* Column Body (Cards) */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3">
                  {colOrders.map((ord: any) => (
                    <Link href={`/orders/${ord.id}`} key={ord.id} className="block">
                      <div className="p-4 bg-slate-900 border border-white/5 rounded-custom-sm hover:border-primary/50 hover:shadow-[0_0_10px_rgba(0,245,255,0.05)] transition-all space-y-3 cursor-pointer relative group">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-bold text-primary font-mono">#{ord.id.slice(0, 8)}</span>
                          <span className="text-[10px] text-text-muted font-mono">{ord.created}</span>
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block group-hover:text-primary transition-colors">
                            {ord.customerName}
                          </span>
                          <span className="text-[10px] text-text-muted block mt-0.5 font-mono">{ord.customerEmail}</span>
                        </div>
                        <div className="flex justify-between items-baseline pt-1 border-t border-white/5">
                          <span className="text-[10px] text-text-secondary">{ord.itemsCount}</span>
                          <span className="text-xs font-bold text-white font-mono">{ord.amount}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {colOrders.length === 0 && (
                    <div className="h-24 flex items-center justify-center text-xs text-text-muted border border-dashed border-white/5 rounded-custom-sm">
                      No orders
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
