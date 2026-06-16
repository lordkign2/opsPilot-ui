'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Truck, CheckCircle2, ChevronRight, Download, Package, Activity, Info, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function TrackConsignment() {
  const [trackingId, setTrackingId] = useState('');
  const [searchedId, setSearchedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setSearchedId(trackingId.trim());
      setIsLoading(false);
    }, 800);
  };

  // Mock tracking details for visual display matching the screenshot
  const isMockId = searchedId === 'ORD-2023-8842' || searchedId?.toLowerCase() === 'mock';

  return (
    <div className="min-h-screen bg-[#070b15] text-text-primary flex flex-col justify-between font-sans">
      
      {/* 1. Global Public Top Navigation Header */}
      <header className="h-16 bg-[#0b1120] border-b border-white/5 px-6 flex items-center justify-between select-none shrink-0 z-20">
        <div className="flex items-center space-x-12">
          {/* Logo */}
          <Link href="/" className="text-base font-black tracking-wider text-white uppercase font-sans">
            OpsPilot
          </Link>

          {/* Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-text-secondary">
            <Link href="/track" className="text-white border-b-2 border-primary pb-5 mt-5">Track Order</Link>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
            <a href="#" className="hover:text-white transition-colors">Help Center</a>
          </nav>
        </div>

        <div>
          <Link href="/login">
            <button className="px-4 py-2 bg-slate-900 border border-white/5 text-xs font-semibold text-text-secondary hover:text-white rounded hover:bg-white/5 cursor-pointer transition-colors">
              Sign In
            </button>
          </Link>
        </div>
      </header>

      {/* 2. Main content container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-10">
        
        {/* Track Title Panel */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-wide">Track Consignment</h1>
              <p className="text-xs text-text-secondary mt-1">Enter your OpsPilot tracking ID or reference number to view real-time fulfillment status.</p>
            </div>
            
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-success bg-success/15 border border-success/35 px-2.5 py-0.5 rounded-full select-none uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-ping mr-1" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="e.g. ORD-2023-8842"
                className="w-full bg-slate-950/40 border border-white/5 text-xs pl-10 pr-4 py-3 rounded text-white focus:outline-none focus:border-primary/50"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="px-6 text-xs font-bold text-slate-950 flex items-center space-x-1 shadow-[0_0_12px_rgba(0,245,255,0.08)] cursor-pointer"
            >
              <span>TRACK</span>
              <ChevronRight className="w-4 h-4 text-slate-950" />
            </Button>
          </form>
        </div>

        {/* Results view */}
        {searchedId && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Split top details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left detail card */}
              <div className="lg:col-span-4 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 flex flex-col justify-between select-none">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Active Consignment</span>
                      <span className="text-lg font-bold text-white font-mono mt-0.5">{searchedId}</span>
                    </div>

                    <span className="inline-flex items-center text-[9px] font-bold px-2 py-0.5 bg-primary/10 border border-primary/20 text-primary rounded-full uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse" />
                      In Transit
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Estimated Delivery</span>
                    <span className="text-xl font-black text-white font-sans mt-0.5">Oct 24, 14:00</span>
                    <span className="text-[9px] text-text-muted mt-0.5 font-mono">Local Time (WAT)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 mt-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Origin</span>
                    <span className="text-xs font-bold text-white mt-1">Lagos Hub</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Destination</span>
                    <span className="text-xs font-bold text-white mt-1">Abuja DC</span>
                  </div>
                </div>
              </div>

              {/* Right Map simulator card */}
              <div className="lg:col-span-8 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg relative overflow-hidden min-h-[200px] flex items-center justify-center select-none">
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                     style={{
                       backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.5px)',
                       backgroundSize: '20px 20px',
                     }}
                />

                {/* Map Graphics */}
                <div className="relative w-full h-full min-h-[220px] bg-slate-950/20 flex flex-col justify-center items-center">
                  <div className="absolute top-4 left-4 flex items-center space-x-2 bg-slate-950/80 border border-white/5 px-3 py-1.5 rounded text-[10px] font-bold text-white z-10">
                    <MapPin className="w-3.5 h-3.5 text-warning animate-bounce" />
                    <span>Last Scanned: Lokoja Checkpoint</span>
                  </div>

                  {/* Draw simulated path vector */}
                  <div className="w-48 h-24 border-b-2 border-r-2 border-white/10 rounded-br-[80px] border-dashed relative">
                    <MapPin className="w-5 h-5 text-text-muted absolute -top-2.5 -left-2.5" />
                    <MapPin className="w-5 h-5 text-warning absolute -bottom-2.5 -right-2.5" />
                    
                    {/* Active pulsing transit cursor */}
                    <div className="absolute bottom-6 right-12 w-3 h-3 rounded-full bg-primary flex items-center justify-center shadow-[0_0_10px_#00F5FF]">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom details split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column: Fulfillment Log Timeline */}
              <div className="lg:col-span-6 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 space-y-6 select-none">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">Fulfillment Log</h3>
                
                <div className="space-y-6 relative pl-6 border-l border-white/5 ml-3">
                  
                  {/* Step 1 */}
                  <div className="relative">
                    <div className="absolute -left-[33px] top-0 w-4.5 h-4.5 rounded-full bg-success border-4 border-[#070b15] flex items-center justify-center shadow-[0_0_8px_#10B981]">
                      <CheckCircle2 className="w-3 h-3 text-[#070b15]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Order Processed</p>
                      <p className="text-[10px] text-text-secondary mt-0.5">Verified and prepared at origin facility.</p>
                      <span className="text-[8px] font-bold font-mono text-text-muted uppercase mt-1.5 block">OCT 22, 08:15 WAT</span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div className="absolute -left-[33px] top-0 w-4.5 h-4.5 rounded-full bg-success border-4 border-[#070b15] flex items-center justify-center shadow-[0_0_8px_#10B981]">
                      <CheckCircle2 className="w-3 h-3 text-[#070b15]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Dispatched from Hub</p>
                      <p className="text-[10px] text-text-secondary mt-0.5">Consignment loaded onto transit vehicle.</p>
                      <span className="text-[8px] font-bold font-mono text-text-muted uppercase mt-1.5 block">OCT 22, 14:30 WAT</span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <div className="absolute -left-[33px] top-0 w-4.5 h-4.5 rounded-full bg-primary border-4 border-[#070b15] flex items-center justify-center shadow-[0_0_10px_#00F5FF]">
                      <Truck className="w-2.5 h-2.5 text-[#070b15]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">In Transit – Route Checkpoint</p>
                      <p className="text-[10px] text-text-secondary mt-0.5">Passed through Lokoja weigh station. Proceeding to destination DC.</p>
                      <span className="text-[8px] font-bold font-mono text-primary uppercase mt-1.5 block">OCT 23, 09:45 WAT</span>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-white/10 border-2 border-[#070b15]" />
                    <div className="opacity-50">
                      <p className="text-xs font-bold text-text-secondary">Out for Delivery</p>
                      <p className="text-[10px] text-text-muted mt-0.5">Handed over to final mile courier.</p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-white/10 border-2 border-[#070b15]" />
                    <div className="opacity-50">
                      <p className="text-xs font-bold text-text-secondary">Delivered</p>
                      <p className="text-[10px] text-text-muted mt-0.5">Package successfully received by consignee.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Column: Consignment Manifest List */}
              <div className="lg:col-span-6 glass-card bg-slate-900/10 border border-white/5 rounded-custom-lg p-6 flex flex-col justify-between select-none">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">Consignment Manifest</h3>
                  
                  {/* Items List */}
                  <div className="space-y-3">
                    {[
                      { name: 'Enterprise Edge Router - X9', sku: 'NET-X9-001', qty: 2, weight: '8.4 kg' },
                      { name: 'Rackmount Server Chassis 2U', sku: 'SRV-2U-B', qty: 1, weight: '12.1 kg' },
                      { name: 'Cat6a Shielded Patch Cables (10m)', sku: 'CBL-C6A-10', qty: 5, weight: '2.5 kg' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 rounded bg-slate-950/25 border border-white/5">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded bg-white/5 border border-white/10 text-text-secondary">
                            <Package className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white">{item.name}</span>
                            <span className="text-[9px] text-text-muted font-mono mt-0.5">SKU: {item.sku}</span>
                          </div>
                        </div>

                        <div className="text-right flex flex-col">
                          <span className="text-xs font-bold text-text-secondary">x{item.qty}</span>
                          <span className="text-[9px] text-text-muted mt-0.5 font-mono">{item.weight}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 mt-6 space-y-4">
                  <div className="flex justify-between text-xs font-semibold text-text-secondary uppercase">
                    <span>Total Weight / Volumetric</span>
                    <span className="text-white font-bold font-mono">23.0 kg / 0.15 CBM</span>
                  </div>

                  <button className="w-full flex items-center justify-center space-x-2 py-2 bg-slate-950/60 border border-white/5 hover:bg-white/5 text-[10px] font-bold text-white rounded cursor-pointer transition-colors">
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Manifest PDF</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

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
