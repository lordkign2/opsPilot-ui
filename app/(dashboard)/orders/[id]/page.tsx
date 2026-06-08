'use client';

import { use, useState, useEffect } from 'react';
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
  ChevronDown,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useOrderDetail, useUpdateOrderStatus } from '@/hooks/useOrders';
import { useCustomerDetail } from '@/hooks/useCustomers';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  // Fetch dynamic order details
  const { data: order, isLoading: orderLoading, error: orderError } = useOrderDetail(id);
  
  // Fetch dynamic customer details based on customer_id
  const { data: customer, isLoading: customerLoading } = useCustomerDetail(order?.customer_id || null);

  const updateStatusMutation = useUpdateOrderStatus();
  const [orderStatus, setOrderStatus] = useState('pending');

  useEffect(() => {
    if (order?.status) {
      setOrderStatus(order.status);
    }
  }, [order?.status]);

  const handleStatusChange = async (newStatus: string) => {
    setOrderStatus(newStatus);
    try {
      await updateStatusMutation.mutateAsync({ orderId: id, status: newStatus });
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  if (orderLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="text-xs text-text-secondary">Loading operations order telemetry...</span>
      </div>
    );
  }

  if (orderError || !order) {
    return (
      <div className="p-8 text-center text-xs text-danger glass-card rounded-custom-md border border-white/5 bg-slate-900/10 space-y-4 max-w-md mx-auto mt-12">
        <AlertTriangle className="w-8 h-8 text-danger mx-auto" />
        <p className="font-semibold text-white">Order Record Unavailable</p>
        <p className="text-text-secondary leading-relaxed">
          The requested order ID could not be loaded. Please ensure the backend server is active.
        </p>
        <Link href="/orders" className="inline-block mt-2">
          <Button variant="outline" size="sm">Back to Queue</Button>
        </Link>
      </div>
    );
  }

  const orderNumber = `ORD-${order.id.slice(0, 8).toUpperCase()}`;
  const subtotal = order.total_amount / 1.075;
  const vat = order.total_amount - subtotal;

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-success/15 border border-success/30 text-success';
      case 'processing':
        return 'bg-primary/15 border border-primary/30 text-primary';
      case 'cancelled':
        return 'bg-danger/15 border border-danger/30 text-danger';
      case 'pending':
      default:
        return 'bg-warning/15 border border-warning/30 text-warning';
    }
  };

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
          <h1 className="text-lg font-bold text-white tracking-wide font-mono">{orderNumber}</h1>
          <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getStatusBadgeClass(order.status)}`}>
            {order.status}
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
              <span className="text-[10px] text-text-muted">1 Item</span>
            </div>

            {/* List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs py-2 border-b border-white/5 last:border-0 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-custom-sm bg-slate-950/40 border border-white/10 flex items-center justify-center text-text-secondary">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Enterprise Operations Checkout</span>
                    <span className="text-[10px] text-text-muted mt-0.5 block font-mono">SKU: OP-ENTERPRISE-POS</span>
                  </div>
                </div>
                <div className="flex items-center space-x-12 text-right">
                  <div className="text-text-muted font-mono">
                    Qty: <span className="text-white">1</span>
                  </div>
                  <div className="text-text-secondary font-mono">₦ {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className="text-white font-bold font-mono w-24 text-right">₦ {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </div>
              </div>
            </div>

            {/* Pricing Summary Block */}
            <div className="bg-slate-950/30 border border-white/5 rounded-custom-sm p-4 space-y-2.5 text-xs text-text-secondary w-full max-w-[360px] ml-auto">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white">₦ {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (7.5%)</span>
                <span className="font-mono text-white">₦ {vat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-2.5 text-sm font-bold text-white">
                <span>Total</span>
                <span className="font-mono text-primary shadow-[0_0_10px_rgba(0,245,255,0.05)]">₦ {order.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
              <div className="relative">
                <span className={`absolute -left-[31px] top-0.5 flex h-4 w-4 rounded-full items-center justify-center border border-slate-950 ${order.status === 'completed' ? 'bg-success' : 'bg-primary'}`}>
                  <span className="w-1.5 h-1.5 bg-slate-950 rounded-full" />
                </span>
                <div className="space-y-1">
                  <span className="font-bold text-white block">Order Status: {order.status.toUpperCase()}</span>
                  <span className="text-[10px] text-text-secondary leading-relaxed block">
                    {order.notes || 'Transaction checkout recorded in operation logs.'}
                  </span>
                  <span className="text-[10px] text-text-muted block font-mono">
                    {new Date(order.created_at).toLocaleString()}
                  </span>
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
                <h3 className="text-sm font-bold text-white">Payment Recorded</h3>
                <span className="text-xs text-text-secondary block">Transaction successfully written to ledger.</span>
                <div className="grid grid-cols-3 gap-6 text-[10px] text-text-secondary pt-2">
                  <div>Amount: <span className="text-white block font-semibold mt-0.5">₦ {order.total_amount.toLocaleString()}</span></div>
                  <div>Status: <span className="text-white block font-mono mt-0.5">Approved</span></div>
                  <div>Gateway: <span className="text-white block font-semibold mt-0.5">Paystack Gateway</span></div>
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
            {customerLoading ? (
              <div className="flex items-center space-x-2 text-xs text-text-secondary">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>Fetching customer profile...</span>
              </div>
            ) : customer ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {customer.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-xs">
                  <span className="font-bold text-white block">{customer.name}</span>
                  <span className="text-[10px] text-text-secondary block mt-0.5">{customer.email || 'No email registered'}</span>
                  <span className="text-[10px] text-text-secondary block mt-0.5 font-mono">{customer.phone}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-text-muted">
                No customer profile resolved for this order ID.
              </div>
            )}
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
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updateStatusMutation.isPending}
                    className="w-full glass-input px-3.5 py-2.5 text-xs rounded-custom-sm appearance-none cursor-pointer pr-10 disabled:opacity-55"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {updateStatusMutation.isPending ? (
                    <Loader2 className="w-4 h-4 text-primary absolute right-3 top-1/2 -translate-y-1/2 animate-spin" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
