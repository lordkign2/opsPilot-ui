'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Printer,
  Edit,
  Package,
  CheckCircle,
  Truck,
  FileText,
  User,
  MapPin,
  Clock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const orderId = id ? `ORD-${id.toUpperCase()}` : 'ORD-2023-8842';

  const [orderStatus, setOrderStatus] = useState('Delivered');
  const [assignedStaff, setAssignedStaff] = useState('Amina O. (Warehouse)');

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center space-x-3">
          <Link href="/orders">
            <button className="p-2 hover:bg-white/5 rounded-custom-sm text-text-secondary hover:text-white cursor-pointer transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="text-lg font-bold text-white tracking-wide font-mono">{orderId}</h1>
          <span className="inline-flex items-center bg-success/15 border border-success/30 text-success text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Fulfilled
          </span>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2 text-xs">
            <Printer className="w-4 h-4 text-text-secondary" />
            <span>Print Invoice</span>
          </Button>
          <Button variant="primary" className="flex items-center space-x-2 text-xs">
            <Edit className="w-4 h-4" />
            <span>Edit Order</span>
          </Button>
        </div>
      </div>

      {/* Grid Layout (Two columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (Main Order Contents) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card 1: Line Items */}
          <div className="glass-card rounded-custom-md border border-white/5 bg-slate-900/10 overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Package className="w-4 h-4 text-primary" />
                <span>Line Items</span>
              </h2>
              <span className="text-[10px] text-text-muted">3 Items</span>
            </div>

            {/* List */}
            <div className="space-y-4">
              {/* Item 1 */}
              <div className="flex items-center justify-between text-xs py-2 border-b border-white/5 last:border-0 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-custom-sm bg-slate-950/40 border border-white/10 flex items-center justify-center text-text-secondary">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Industrial AI Sensor Module V2</span>
                    <span className="text-[10px] text-text-muted mt-0.5 block font-mono">SKU: SN-AI-002</span>
                  </div>
                </div>
                <div className="flex items-center space-x-12 text-right">
                  <div className="text-text-muted font-mono">
                    Qty: <span className="text-white">2</span>
                  </div>
                  <div className="text-text-secondary font-mono">₦145,000</div>
                  <div className="text-white font-bold font-mono w-24 text-right">₦290,000</div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center justify-between text-xs py-2 border-b border-white/5 last:border-0 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-custom-sm bg-slate-950/40 border border-white/10 flex items-center justify-center text-text-secondary">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Edge Gateway Router</span>
                    <span className="text-[10px] text-text-muted mt-0.5 block font-mono">SKU: GW-ED-001</span>
                  </div>
                </div>
                <div className="flex items-center space-x-12 text-right">
                  <div className="text-text-muted font-mono">
                    Qty: <span className="text-white">1</span>
                  </div>
                  <div className="text-text-secondary font-mono">₦85,000</div>
                  <div className="text-white font-bold font-mono w-24 text-right">₦85,000</div>
                </div>
              </div>
            </div>

            {/* Pricing Summary Block */}
            <div className="bg-slate-950/30 border border-white/5 rounded-custom-sm p-4 space-y-2.5 text-xs text-text-secondary w-full max-w-[360px] ml-auto">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white">₦375,000</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping (Express Logistics)</span>
                <span className="font-mono text-white">₦15,000</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (7.5%)</span>
                <span className="font-mono text-white">₦28,125</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-2.5 text-sm font-bold text-white">
                <span>Total</span>
                <span className="font-mono text-primary shadow-[0_0_10px_rgba(0,245,255,0.05)]">₦418,125</span>
              </div>
            </div>
          </div>

          {/* Card 2: Fulfillment Timeline */}
          <div className="glass-card rounded-custom-md border border-white/5 bg-slate-900/10 p-6 space-y-6">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-white/5 pb-3">
              <Clock className="w-4 h-4 text-primary animate-pulse" />
              <span>Fulfillment Timeline</span>
            </h2>

            {/* Vertical timeline */}
            <div className="relative border-l border-white/5 ml-3.5 pl-6 space-y-6 text-xs">
              {/* Event 1 */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 flex h-4 w-4 rounded-full bg-success items-center justify-center border border-slate-950 shadow-[0_0_8px_#10B981]">
                  <span className="w-1.5 h-1.5 bg-slate-950 rounded-full" />
                </span>
                <div className="space-y-1">
                  <span className="font-bold text-white block">Order Delivered</span>
                  <span className="text-[10px] text-text-secondary leading-relaxed block">Package signed by recipient.</span>
                  <span className="text-[10px] text-text-muted block font-mono">Oct 26, 09:15 WAT</span>
                </div>
              </div>

              {/* Event 2 */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 flex h-4 w-4 rounded-full bg-primary items-center justify-center border border-slate-950">
                  <span className="w-1.5 h-1.5 bg-slate-950 rounded-full animate-ping" />
                </span>
                <div className="space-y-1">
                  <span className="font-bold text-white block">Out for Delivery</span>
                  <span className="text-[10px] text-text-secondary leading-relaxed block">Handed over to Express Logistics dispatch.</span>
                  <span className="text-[10px] text-text-muted block font-mono">Oct 25, 08:30 WAT</span>
                </div>
              </div>

              {/* Event 3 */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 flex h-4 w-4 rounded-full bg-primary/20 items-center justify-center border border-slate-950">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                </span>
                <div className="space-y-1">
                  <span className="font-bold text-white block">Order Placed</span>
                  <span className="text-[10px] text-text-secondary leading-relaxed block">Payment verified and order created.</span>
                  <span className="text-[10px] text-text-muted block font-mono">Oct 24, 14:32 WAT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Payment Status */}
          <div className="glass-card rounded-custom-md border border-white/5 bg-slate-900/10 p-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-success">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Fully Paid</h3>
                <span className="text-xs text-text-secondary block">No outstanding balance.</span>
                <div className="grid grid-cols-3 gap-6 text-[10px] text-text-secondary pt-2">
                  <div>Method: <span className="text-white block font-semibold mt-0.5">Bank Transfer</span></div>
                  <div>Transaction ID: <span className="text-white block font-mono mt-0.5">TRX-9982-AB</span></div>
                  <div>Processed By: <span className="text-white block font-semibold mt-0.5">Paystack Gateway</span></div>
                </div>
              </div>
            </div>

            <Button variant="outline" className="flex items-center space-x-2 text-xs w-full md:w-auto">
              <FileText className="w-4 h-4 text-text-secondary" />
              <span>View Payment Record</span>
            </Button>
          </div>
        </div>

        {/* Right Column (Sidebar contextual panels) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card 1: Customer Profile */}
          <div className="glass-card rounded-custom-md border border-white/5 bg-slate-900/10 p-5 space-y-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-white/5 pb-2">
              <User className="w-4 h-4 text-primary" />
              <span>Customer Profile</span>
            </h2>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                CO
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Chidi Okafor</span>
                <span className="text-[10px] text-text-secondary block mt-0.5">chidi.o@techworks.ng</span>
                <span className="text-[10px] text-text-secondary block mt-0.5 font-mono">+234 803 123 4567</span>
              </div>
            </div>
          </div>

          {/* Card 2: Shipping Address */}
          <div className="glass-card rounded-custom-md border border-white/5 bg-slate-900/10 p-5 space-y-3">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-white/5 pb-2">
              <MapPin className="w-4 h-4 text-primary animate-pulse" />
              <span>Shipping Address</span>
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Plot 42, Industrial Estate Road,<br />
              Victoria Island, Lagos,<br />
              Nigeria.
            </p>
          </div>

          {/* Card 3: Fulfillment Controls */}
          <div className="glass-card rounded-custom-md border border-white/5 bg-slate-900/10 p-5 space-y-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
              Fulfillment Controls
            </h2>
            
            <div className="space-y-4">
              {/* Control 1 */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
                  Order Status
                </label>
                <div className="relative">
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full glass-input px-3.5 py-2 text-xs rounded-custom-sm appearance-none cursor-pointer pr-10"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Control 2 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <label className="block text-[10px] font-semibold text-text-secondary uppercase tracking-wider">
                    Assigned Staff
                  </label>
                  <button className="text-[10px] text-primary hover:underline font-bold cursor-pointer">
                    Change
                  </button>
                </div>
                <div className="flex items-center justify-between glass-input px-3.5 py-2.5 rounded-custom-sm border border-white/5 bg-slate-900/40 text-xs">
                  <span className="text-text-primary font-medium">{assignedStaff}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Recent History */}
          <div className="glass-card rounded-custom-md border border-white/5 bg-slate-900/10 p-5 space-y-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
              Recent History
            </h2>
            <div className="space-y-2.5 text-xs">
              {[
                { id: 'ORD-2023-7102', date: 'Sep 15, 2023', status: 'DELIVERED', color: 'text-success bg-success/10 border-success/20' },
                { id: 'ORD-2023-5521', date: 'Jul 02, 2023', status: 'DELIVERED', color: 'text-success bg-success/10 border-success/20' },
                { id: 'ORD-2023-4199', date: 'May 18, 2023', status: 'REFUNDED', color: 'text-text-muted bg-white/5 border-white/10' }
              ].map((past) => (
                <div key={past.id} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0 pb-2.5">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white font-mono block hover:text-primary cursor-pointer">{past.id}</span>
                    <span className="text-[10px] text-text-muted block font-mono">{past.date}</span>
                  </div>
                  <span className={`inline-flex items-center text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${past.color}`}>
                    {past.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
