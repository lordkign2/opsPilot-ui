'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CreditCard, Landmark, PhoneCall, ShieldCheck, Lock, Calendar, Loader2, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CompletePayment() {
  const [activeMethod, setActiveMethod] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert('Payment authorization simulated successfully.');
    }, 1500);
  };

  const planAmount = 450000;
  const addonAmount = 25000;
  const subtotal = planAmount + addonAmount;
  const vat = 10250; // Dynamic or fixed matching mock order #OP-2024-8931
  const total = subtotal + vat;

  return (
    <div className="min-h-screen bg-[#070b15] text-text-primary flex flex-col justify-between font-sans">
      
      {/* 1. Logo Header */}
      <header className="h-16 bg-[#0b1120] border-b border-white/5 flex items-center justify-center shrink-0 z-20 select-none">
        <Link href="/" className="text-base font-black tracking-wider text-white uppercase font-sans">
          OpsPilot
        </Link>
      </header>

      {/* 2. Checkout Panel Split */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 flex items-center justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
          
          {/* Left Panel: Payment Method forms */}
          <div className="lg:col-span-7 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Card Title */}
              <div className="border-b border-white/5 pb-3">
                <h2 className="text-lg font-bold text-white tracking-wide">Complete Payment</h2>
                <span className="text-[10px] text-text-secondary mt-1 flex items-center select-none uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5 text-[#10b981] mr-1.5" />
                  Secure, encrypted transaction
                </span>
              </div>

              {/* Method tabs */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950/40 p-0.5 border border-white/5 rounded select-none">
                {[
                  { id: 'card', name: 'Card', icon: CreditCard },
                  { id: 'transfer', name: 'Transfer', icon: Landmark },
                  { id: 'ussd', name: 'USSD', icon: PhoneCall }
                ].map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setActiveMethod(method.id as any)}
                      className={`flex items-center justify-center space-x-2 py-2.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                        activeMethod === method.id 
                          ? 'bg-white/5 text-primary' 
                          : 'text-text-secondary hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{method.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Render dynamic payment forms based on selected tab */}
              {activeMethod === 'card' && (
                <form onSubmit={handlePay} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider select-none">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="e.g. OLUWAKEMI ADEBAYO"
                      className="w-full glass-input px-3.5 py-2.5 text-xs rounded uppercase"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider select-none">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        className="w-full glass-input pl-3.5 pr-16 py-2.5 text-xs rounded font-mono"
                      />
                      {/* Mastercard/Visa mock overlay */}
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[8px] font-extrabold text-white/40 uppercase tracking-widest border border-white/10 px-1 rounded select-none">
                        Visa / MC
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider select-none">
                        Expiry Date
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full glass-input pl-3.5 pr-10 py-2.5 text-xs rounded font-mono"
                        />
                        <Calendar className="w-3.5 h-3.5 text-text-muted absolute right-3.5 top-1/2 -translate-y-1/2 select-none" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider select-none">
                        CVV
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          maxLength={3}
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="123"
                          className="w-full glass-input pl-3.5 pr-10 py-2.5 text-xs rounded font-mono"
                        />
                        <Lock className="w-3.5 h-3.5 text-text-muted absolute right-3.5 top-1/2 -translate-y-1/2 select-none" />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isProcessing}
                    className="w-full flex items-center justify-center py-3 text-xs font-bold shadow-[0_0_15px_rgba(0,245,255,0.08)] cursor-pointer"
                  >
                    <span>Pay ₦{total.toLocaleString()}</span>
                  </Button>
                </form>
              )}

              {activeMethod === 'transfer' && (
                <div className="bg-slate-950/20 border border-white/5 rounded p-5 space-y-4 select-none">
                  <div className="text-center space-y-2">
                    <Landmark className="w-8 h-8 text-primary mx-auto opacity-75" />
                    <p className="text-xs text-white font-semibold uppercase tracking-wider">Bank Transfer Reference</p>
                    <p className="text-[10px] text-text-secondary max-w-xs mx-auto">Please make bank transfer to the following account details. Click confirm once payment has been dispatched from your bank app.</p>
                  </div>

                  <div className="space-y-2 border-t border-white/5 pt-4 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-text-muted uppercase">Bank Name</span>
                      <span className="text-white font-bold">Wema Bank (Providus)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted uppercase">Account Number</span>
                      <span className="text-white font-bold tracking-widest">1029482901</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted uppercase">Account Name</span>
                      <span className="text-white font-bold">OpsPilot Infrastructure</span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    onClick={() => alert('Confirming transfer...')}
                    className="w-full flex items-center justify-center py-3 text-xs font-bold shadow-[0_0_15px_rgba(0,245,255,0.08)] cursor-pointer mt-4"
                  >
                    <span>Confirm Bank Transfer</span>
                  </Button>
                </div>
              )}

              {activeMethod === 'ussd' && (
                <div className="bg-slate-950/20 border border-white/5 rounded p-5 space-y-4 select-none">
                  <div className="text-center space-y-2">
                    <PhoneCall className="w-8 h-8 text-primary mx-auto opacity-75" />
                    <p className="text-xs text-white font-semibold uppercase tracking-wider">Dial USSD Code</p>
                    <p className="text-[10px] text-text-secondary max-w-xs mx-auto">Select your bank from the options below and dial the generated USSD code on your registered mobile device.</p>
                  </div>

                  <div className="space-y-3 border-t border-white/5 pt-4">
                    <select className="w-full glass-input px-3.5 py-2.5 text-xs rounded cursor-pointer font-semibold">
                      <option>GTBank (*737#)</option>
                      <option>Zenith Bank (*966#)</option>
                      <option>Access Bank (*901#)</option>
                    </select>

                    <div className="p-3 bg-slate-950 rounded border border-white/5 text-center font-mono text-xs font-bold text-white tracking-widest select-all">
                      *737*1*2*485250#
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Compliance stamp */}
            <div className="pt-6 border-t border-white/5 mt-6 flex items-center justify-center space-x-2 text-[9px] font-bold text-text-muted uppercase tracking-wider select-none">
              <ShieldCheck className="w-4 h-4 text-[#10b981]" />
              <span>PCI DSS Compliant • 256-Bit SSL</span>
            </div>
          </div>

          {/* Right Panel: Order Summary */}
          <div className="lg:col-span-5 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-5 flex flex-col justify-between select-none">
            <div className="space-y-4">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Order Summary</h3>
                <span className="text-[9px] text-text-secondary mt-1 block font-mono">Order #OP-2024-8931</span>
              </div>

              {/* Subscription Details items */}
              <div className="space-y-3.5 pt-2">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">Enterprise AI Ops Plan</span>
                    <span className="text-[9px] text-text-secondary mt-0.5">Annual Subscription</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-white">₦{planAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white">Data Migration Add-on</span>
                    <span className="text-[9px] text-text-secondary mt-0.5">One-time fee</span>
                  </div>
                  <span className="text-xs font-bold font-mono text-white">₦{addonAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 mt-6 space-y-4">
              <div className="space-y-2 text-xs font-semibold text-text-secondary">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (7.5%)</span>
                  <span className="font-mono text-white">₦{vat.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-white/5 text-xs font-bold uppercase">
                <span className="text-white">Total</span>
                <div className="flex flex-col text-right">
                  <span className="text-lg font-black text-primary font-mono shadow-[0_0_15px_rgba(0,245,255,0.05)]">
                    ₦{total.toLocaleString()}
                  </span>
                  <span className="text-[8px] text-text-muted mt-0.5 font-mono">NGN</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* 3. Footer Bar */}
      <footer className="h-14 bg-[#0b1120]/60 border-t border-white/5 px-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-text-secondary select-none shrink-0 gap-2 py-3">
        <span>© 2024 OpsPilot Infrastructure. Securely processed in Nigeria.</span>
        
        <div className="flex items-center space-x-4">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Security Standards</a>
        </div>
      </footer>

    </div>
  );
}
