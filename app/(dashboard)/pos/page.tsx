'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Cpu,
  Wifi,
  Zap,
  Cable,
  Code,
  Wrench,
  Plus,
  Minus,
  Trash2,
  X,
  CreditCard,
  Wallet,
  Smartphone,
  CheckCircle,
  Loader2,
  ExternalLink,
  ChevronDown,
  ShoppingCart,
  Package
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useCustomers } from '@/hooks/useCustomers';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { Customer } from '@/types/api';
import { useEffect as useReactEffect } from 'react';

interface Product {
  sku: string;
  name: string;
  price: number;
  category: 'Hardware' | 'Software' | 'Services' | 'Accessories';
  icon: any;
}

const mockProducts: Product[] = [
  { sku: 'HW-101', name: 'Industrial AI Sensor', price: 145000, category: 'Hardware', icon: Cpu },
  { sku: 'HW-205', name: 'Edge Gateway Router', price: 210000, category: 'Hardware', icon: Wifi },
  { sku: 'HW-088', name: 'Power Module Alpha', price: 85500, category: 'Hardware', icon: Zap },
  { sku: 'ACC-012', name: 'Shielded CAT6 Cable', price: 15000, category: 'Accessories', icon: Cable },
  { sku: 'LIC-001', name: 'API Integration License', price: 50000, category: 'Software', icon: Code },
  { sku: 'SRV-001', name: 'On-Site Setup Service', price: 120000, category: 'Services', icon: Wrench },
];

interface CartItem {
  product: Product;
  quantity: number;
}

const RenderProductIcon = ({ icon }: { icon: any }) => {
  const IconComponent = icon || Package;
  return <IconComponent className="w-5 h-5 text-text-secondary" />;
};

export default function POSPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'Transfer' | 'Link'>('Card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);

  // Diagnostic log for icons
  useReactEffect(() => {
    console.log('POS Diagnostic - Lucide Icons:', { Cpu, Wifi, Zap, Cable, Code, Wrench, Package, ShoppingCart });
  }, []);

  // Load backend customers context for checkout
  const { data: customerData, isLoading: customersLoading } = useCustomers(1, 100);
  const customers = (customerData?.data || []) as Customer[];

  const categories = ['All Items', 'Hardware', 'Software', 'Services', 'Accessories'];

  // Add to cart
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.sku === product.sku);
      if (existing) {
        return prevCart.map((item) =>
          item.product.sku === product.sku ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  // Decrement quantity
  const decrementQuantity = (sku: string) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.sku === sku);
      if (!existing) return prevCart;
      if (existing.quantity === 1) {
        return prevCart.filter((item) => item.product.sku !== sku);
      }
      return prevCart.map((item) =>
        item.product.sku === sku ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  // Remove completely
  const removeItem = (sku: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.sku !== sku));
  };

  // Clear cart
  const clearCart = () => setCart([]);

  // Filter products
  const filteredProducts = mockProducts.filter((p) => {
    const matchesCategory = selectedCategory === 'All Items' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const vat = subtotal * 0.075;
  const discount = 0; // standard mockup layout
  const total = subtotal + vat - discount;
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Get quantity in cart for badges
  const getProductCartQuantity = (sku: string) => {
    return cart.find((item) => item.product.sku === sku)?.quantity || 0;
  };

  // Handle Checkout
  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;
    if (!selectedCustomerId) {
      alert('Please select a customer to confirm the order.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.post(API_ENDPOINTS.ORDERS.BASE, {
        customer_id: selectedCustomerId,
        total_amount: total,
        notes: `POS checkout using ${paymentMethod}`
      });

      const orderData = response.data?.data;
      setSuccessOrderId(orderData?.id || 'Success');
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    } catch (err) {
      console.error('POS Checkout Error:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch overflow-hidden">
      {/* Left Column: Product Search and Catalog Grid */}
      <div className="lg:col-span-8 flex flex-col h-full overflow-hidden space-y-4">
        {/* Search Header Row */}
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, SKUs, or scan barcode..."
              className="w-full glass-input pl-10 pr-4 py-2.5 text-xs rounded-custom-sm font-sans"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] bg-slate-900 border border-white/10 px-1.5 py-0.5 rounded font-mono text-text-muted select-none">
              ⌘K
            </span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex space-x-3 overflow-x-auto pb-1 select-none scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(0,245,255,0.05)]'
                  : 'bg-slate-900/40 border-white/5 text-text-secondary hover:border-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-text-muted border border-dashed border-white/5 rounded-custom-md bg-slate-900/5">
              No matching products found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              {filteredProducts.map((p) => {
                const qty = getProductCartQuantity(p.sku);
                const isAdded = qty > 0;

                return (
                  <button
                    key={p.sku}
                    onClick={() => addToCart(p)}
                    className={`glass-card p-5 rounded-custom-md border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 hover:scale-[1.01] relative ${
                      isAdded
                        ? 'border-success/30 bg-success/[0.02] shadow-[0_0_15px_rgba(16,185,129,0.02)]'
                        : 'border-white/5 bg-slate-900/10 hover:border-white/10'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start w-full">
                      <div className="w-9 h-9 rounded-custom-sm bg-slate-950/40 border border-white/10 flex items-center justify-center text-text-secondary">
                        <RenderProductIcon icon={p.icon} />
                      </div>
                      <span className="text-[9px] font-mono bg-slate-950/60 border border-white/10 px-2 py-0.5 rounded text-text-muted uppercase tracking-wider">
                        {p.sku}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold text-white leading-snug tracking-wide group-hover:text-primary">
                        {p.name}
                      </h3>
                      <span className="text-sm font-bold text-primary font-mono block">
                        ₦ {p.price.toLocaleString()}
                      </span>
                    </div>

                    {/* Added Tag indicator */}
                    {isAdded && (
                      <span className="absolute top-2.5 left-2.5 inline-flex items-center text-[9px] font-bold px-2 py-0.5 rounded-full bg-success/15 border border-success/35 text-success">
                        <span className="w-1 h-1 rounded-full bg-success mr-1.5 animate-ping" />
                        {qty === 1 ? '• Added' : `• Added (${qty})`}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Current Order Panel */}
      <div className="lg:col-span-4 glass-card rounded-custom-md p-4 flex flex-col h-full overflow-hidden bg-slate-950/20 border border-white/5">
        {successOrderId ? (
          /* SUCCESS SCREEN DISPLAY */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6">
            <div className="w-16 h-16 rounded-full bg-success/10 border border-success/30 flex items-center justify-center text-success animate-bounce">
              <CheckCircle className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Transaction Completed</h3>
              <p className="text-xs text-text-secondary max-w-[240px] mx-auto leading-relaxed">
                Order successfully verified and compiled in database queue.
              </p>
              <span className="text-[10px] font-mono text-primary bg-primary/5 border border-primary/20 px-3 py-1 rounded-full inline-block mt-2">
                ID: {successOrderId.slice(0, 8)}...
              </span>
            </div>
            <div className="w-full space-y-3 pt-4">
              <Button
                variant="primary"
                onClick={() => setSuccessOrderId(null)}
                className="w-full text-xs font-bold"
              >
                New Transaction
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/orders')}
                className="w-full text-xs font-semibold flex items-center justify-center space-x-2"
              >
                <span>View Queue</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          /* ACTIVE CHECKOUT SCREEN */
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 select-none">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4 text-primary" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Current Order</h2>
              </div>
              {cart.length > 0 && (
                <div className="flex items-center space-x-3">
                  <span className="text-[9px] bg-primary/10 border border-primary/20 text-primary font-mono font-bold px-2 py-0.5 rounded-full">
                    {totalItemsCount} Items
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-[10px] text-danger hover:underline font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Empty
                  </button>
                </div>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-3 p-4 select-none">
                  <div className="w-12 h-12 rounded-full border border-dashed border-white/10 flex items-center justify-center text-text-muted">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-text-muted">Order is currently empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.sku}
                    className="p-3 bg-slate-900/40 border border-white/5 rounded-custom-sm flex items-center justify-between text-xs space-x-3"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-white block truncate">{item.product.name}</span>
                      <span className="text-[10px] text-text-muted mt-0.5 block font-mono">
                        ₦ {item.product.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2.5">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-slate-950/60 border border-white/10 rounded p-0.5 text-xs text-white font-mono select-none">
                        <button
                          onClick={() => decrementQuantity(item.product.sku)}
                          className="p-1 hover:bg-white/5 rounded cursor-pointer"
                        >
                          <Minus className="w-3 h-3 text-text-secondary" />
                        </button>
                        <span className="px-2 font-bold">{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item.product)}
                          className="p-1 hover:bg-white/5 rounded cursor-pointer"
                        >
                          <Plus className="w-3 h-3 text-text-secondary" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.sku)}
                        className="p-1.5 hover:bg-white/5 rounded text-text-muted hover:text-danger cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Customer Lookup Dropdown Selector */}
            <div className="border-t border-white/5 pt-4 pb-4 space-y-2 select-none">
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                Select Customer Workspace
              </label>
              {customersLoading ? (
                <div className="flex items-center space-x-2 text-xs text-text-muted">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  <span>Loading customer index...</span>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 text-xs rounded-custom-sm appearance-none cursor-pointer pr-10"
                  >
                    <option value="" disabled>-- Choose customer record --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.phone})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-text-muted absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              )}
            </div>

            {/* Totals Block */}
            <div className="bg-slate-950/30 border border-white/5 rounded-custom-sm p-4 space-y-2.5 text-xs text-text-secondary select-none">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-white">₦ {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (7.5%)</span>
                <span className="font-mono text-white">₦ {vat.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className="font-mono text-success">- ₦ {discount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-2.5 text-sm font-bold text-white">
                <span>Total</span>
                <span className="font-mono text-primary shadow-[0_0_10px_rgba(0,245,255,0.05)]">
                  ₦ {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Method Selector Grid */}
            <div className="mt-4 grid grid-cols-4 gap-2 text-[10px] font-bold text-text-secondary select-none">
              {[
                { key: 'Cash', label: 'Cash', icon: Wallet },
                { key: 'Card', label: 'Card', icon: CreditCard },
                { key: 'Transfer', label: 'Transfer', icon: Smartphone },
                { key: 'Link', label: 'Link', icon: Smartphone } // link checkout
              ].map((method) => {
                const Icon = method.icon;
                const active = paymentMethod === method.key;
                return (
                  <button
                    key={method.key}
                    onClick={() => setPaymentMethod(method.key as any)}
                    className={`flex flex-col items-center justify-center py-2.5 rounded border transition-all duration-200 cursor-pointer ${
                      active
                        ? 'bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(0,245,255,0.05)]'
                        : 'bg-slate-900/40 border-white/5 text-text-secondary hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Submit checkout CTA */}
            <div className="mt-4">
              <Button
                variant="primary"
                onClick={handleConfirmOrder}
                isLoading={isSubmitting}
                disabled={cart.length === 0 || !selectedCustomerId}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-custom-md font-sans text-xs font-bold shadow-[0_0_20px_rgba(0,245,255,0.1)]"
              >
                <span>Confirm Order</span>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
