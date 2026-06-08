'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket,
  Building2,
  Users,
  Globe,
  Check,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  CloudUpload,
  Store,
  Utensils,
  Truck,
  Headphones,
  Factory,
  ShieldAlert,
  Loader2,
  Mail,
  X
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import Button from '@/components/ui/Button';
import { z } from 'zod';

// Step definitions
type OnboardingStep = 1 | 2 | 3 | 4;

const ACCENT_COLORS = [
  { name: 'Cyan', hex: '#00F5FF', glow: 'rgba(0, 245, 255, 0.15)' },
  { name: 'Green', hex: '#10B981', glow: 'rgba(16, 185, 129, 0.15)' },
  { name: 'Gold', hex: '#F59E0B', glow: 'rgba(245, 158, 11, 0.15)' },
  { name: 'Blue', hex: '#3B82F6', glow: 'rgba(59, 130, 246, 0.15)' },
  { name: 'Pink', hex: '#EC4899', glow: 'rgba(236, 72, 153, 0.15)' },
];

const INDUSTRIES = [
  { id: 'Retail', name: 'Retail', icon: Store, description: 'E-commerce, shops & wholesale' },
  { id: 'Food & Bev', name: 'Food & Bev', icon: Utensils, description: 'Restaurants, bars & catering' },
  { id: 'Logistics', name: 'Logistics', icon: Truck, description: 'Delivery, freight & supply chain' },
  { id: 'Services', name: 'Services', icon: Headphones, description: 'Consulting, agencies & IT' },
  { id: 'Manufacturing', name: 'Manufacturing', icon: Factory, description: 'Production, factories & assembly' },
  { id: 'Healthcare', name: 'Healthcare', icon: ShieldAlert, description: 'Clinics, pharmacies & medical' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [loading, setLoading] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);

  const handleCancel = () => {
    logout();
    router.push('/login');
  };

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [orgSize, setOrgSize] = useState('11-50');
  const [operatingRegion, setOperatingRegion] = useState('Nigeria');
  const [selectedIndustry, setSelectedIndustry] = useState('Manufacturing');
  const [accentColor, setAccentColor] = useState('#00F5FF');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [teamEmails, setTeamEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);

  // Load current business to pre-populate name
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.BUSINESSES.CURRENT);
        if (response.data?.data) {
          const biz = response.data.data;
          setBusinessId(biz.id);
          setBusinessName(biz.name || '');
          if (biz.industry) {
            setSelectedIndustry(biz.industry);
          }
        }
      } catch (err) {
        console.error('Failed to fetch business', err);
      }
    };
    fetchBusiness();
  }, []);

  const handleNextStep = () => {
    if (currentStep === 1 && !businessName.trim()) {
      setApiError('Registered Business Name is required');
      return;
    }
    setApiError(null);
    setCurrentStep((prev) => (prev + 1) as OnboardingStep);
  };

  const handlePrevStep = () => {
    setApiError(null);
    setCurrentStep((prev) => (prev - 1) as OnboardingStep);
  };

  const handleAddEmail = () => {
    if (!currentEmail.trim()) return;
    if (!z.string().email().safeParse(currentEmail).success) {
      setApiError('Please enter a valid email address');
      return;
    }
    setApiError(null);
    if (!teamEmails.includes(currentEmail)) {
      setTeamEmails([...teamEmails, currentEmail]);
    }
    setCurrentEmail('');
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setTeamEmails(teamEmails.filter((email) => email !== emailToRemove));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setApiError('File size must be under 2MB');
        return;
      }
      setApiError(null);
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInitialize = async () => {
    if (!businessId) {
      setApiError('Workspace context missing. Please re-login.');
      return;
    }
    setLoading(true);
    setApiError(null);

    try {
      // 1. Save Workspace Config via PATCH
      await apiClient.patch(API_ENDPOINTS.BUSINESSES.BY_ID(businessId), {
        name: businessName,
        industry: selectedIndustry,
        description: `Operational model: ${selectedIndustry}. Size: ${orgSize} employees. Region: ${operatingRegion}. Accent color: ${accentColor}`,
        logo_url: logoPreview || undefined, // Send base64 logo mock url
      });

      // 2. Simulate sending team invites
      if (teamEmails.length > 0) {
        // Here we could call an invitation endpoint if it existed
        console.log('Inviting team members:', teamEmails);
      }

      // Complete onboarding and redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setApiError(err.response?.data?.message || err.response?.data?.detail || 'Failed to initialize workspace. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-background p-4 md:p-8 overflow-y-auto">
      {/* Background glow lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none" />
      
      {/* Top Header Logo */}
      <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto w-full border-b border-white/5 pb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-custom-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Rocket className="w-4 h-4 text-primary animate-pulse" />
          </div>
          <span className="text-md font-bold tracking-tight text-white uppercase">OpsPilot</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-xs text-text-muted">
            Logged in as: <span className="text-text-secondary">{user?.email}</span>
          </div>
          <button
            onClick={handleCancel}
            className="text-xs text-danger hover:underline font-semibold border border-danger/20 hover:border-danger/40 bg-danger/5 px-2.5 py-1 rounded transition-all cursor-pointer"
          >
            Cancel Setup
          </button>
        </div>
      </div>

      {/* Onboarding Box Wrapper */}
      <div className="flex-1 flex items-center justify-center max-w-6xl mx-auto w-full">
        {currentStep === 3 ? (
          // Step 3 layout (Landscape split screen with Live Preview)
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Control Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:col-span-5 glass-card rounded-custom-lg p-6 space-y-6"
            >
              {/* Step Header */}
              <div className="flex items-center justify-between text-xs border-b border-white/5 pb-4">
                <span className="text-primary font-semibold tracking-wider uppercase">Step 3 of 4: Branding</span>
                <span className="text-text-muted">Branding Customization</span>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Establish Your Identity.</h2>
                <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                  Customize the OpsPilot dashboard to align with your organization's brand. These settings will be applied globally for all team members.
                </p>
              </div>

              {/* Workspace Logo Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Workspace Logo
                </label>
                <p className="text-xs text-text-muted">Upload an SVG or high-res PNG. Transparent background recommended.</p>
                <div className="relative border-2 border-dashed border-white/10 hover:border-primary/50 transition-colors rounded-custom-md p-6 flex flex-col items-center justify-center group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {logoPreview ? (
                    <div className="flex flex-col items-center">
                      <img src={logoPreview} alt="Logo preview" className="h-12 w-auto object-contain mb-2 rounded" />
                      <span className="text-xs text-primary font-medium">Click to change file</span>
                    </div>
                  ) : (
                    <>
                      <CloudUpload className="w-8 h-8 text-text-muted group-hover:text-primary transition-colors mb-2" />
                      <span className="text-xs font-medium text-text-secondary group-hover:text-text-primary">
                        Drag & drop logo here
                      </span>
                      <span className="text-[10px] text-text-muted mt-1">or click to browse files (Max 2MB)</span>
                    </>
                  )}
                </div>
              </div>

              {/* Accent Color swatches */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Accent Color
                  </label>
                  <p className="text-xs text-text-muted">Defines active states and primary actions.</p>
                </div>

                <div className="flex items-center space-x-3">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setAccentColor(color.hex)}
                      className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center cursor-pointer transition-all duration-200"
                      style={{
                        backgroundColor: color.hex,
                        boxShadow: accentColor === color.hex ? `0 0 12px ${color.hex}` : 'none',
                        transform: accentColor === color.hex ? 'scale(1.15)' : 'scale(1)',
                      }}
                      title={color.name}
                    >
                      {accentColor === color.hex && (
                        <Check className="w-4 h-4 text-slate-900 stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Hex input */}
                <div className="flex items-center space-x-2">
                  <div
                    className="w-10 h-10 rounded-custom-sm border border-white/10"
                    style={{ backgroundColor: accentColor }}
                  />
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-text-muted font-mono">
                      HEX
                    </span>
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      placeholder="#00F5FF"
                      className="w-full glass-input pl-12 pr-3.5 py-2.5 text-sm font-mono rounded-custom-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3 Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <Button variant="ghost" onClick={handlePrevStep} className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
                <Button variant="primary" onClick={handleNextStep} className="flex items-center space-x-2">
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {/* Right Live Preview mockup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-7 space-y-2"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Live Preview</span>
              
              {/* Miniature Window Panel */}
              <div className="glass-card rounded-custom-md overflow-hidden shadow-2xl border border-white/10 h-[500px] flex flex-col">
                {/* Browser Title Bar */}
                <div className="bg-[#0b1120] px-4 py-3 flex items-center justify-between border-b border-white/5">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-danger/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
                  </div>
                  <div className="text-[10px] text-text-muted font-mono bg-slate-900/50 px-6 py-0.5 rounded border border-white/5">
                    opspilot.io/dashboard
                  </div>
                  <div className="w-12" />
                </div>

                {/* Mockup Body Layout */}
                <div className="flex-1 flex overflow-hidden bg-slate-950/40">
                  {/* Mock Sidebar */}
                  <div className="w-14 border-r border-white/5 bg-[#0b1120]/80 p-2 flex flex-col items-center space-y-6">
                    <div className="w-8 h-8 rounded-custom-sm bg-slate-900 border border-white/5 flex items-center justify-center text-[10px] font-bold text-white">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Preview logo" className="h-5 w-auto object-contain" />
                      ) : (
                        businessName ? businessName.slice(0, 2).toUpperCase() : 'OP'
                      )}
                    </div>

                    <div className="flex-1 flex flex-col space-y-4 pt-4">
                      <div className="w-7 h-7 rounded flex items-center justify-center bg-white/5 text-text-secondary">
                        <div className="w-3.5 h-3.5 rounded-sm border border-white/30" />
                      </div>
                      <div
                        className="w-7 h-7 rounded flex items-center justify-center transition-colors"
                        style={{
                          backgroundColor: `${accentColor}12`,
                          color: accentColor,
                          borderLeft: `2px solid ${accentColor}`,
                        }}
                      >
                        <div className="w-3.5 h-3.5 rounded-sm border" style={{ borderColor: accentColor }} />
                      </div>
                      <div className="w-7 h-7 rounded flex items-center justify-center bg-white/5 text-text-secondary">
                        <div className="w-3.5 h-3.5 rounded-sm border border-white/30" />
                      </div>
                      <div className="w-7 h-7 rounded flex items-center justify-center bg-white/5 text-text-secondary">
                        <div className="w-3.5 h-3.5 rounded-sm border border-white/30" />
                      </div>
                    </div>

                    <div className="w-7 h-7 rounded flex items-center justify-center bg-white/5 text-text-secondary">
                      <div className="w-3.5 h-3.5 rounded-full border border-white/30" />
                    </div>
                  </div>

                  {/* Mock Workspace Content */}
                  <div className="flex-1 flex flex-col">
                    {/* Mock Header */}
                    <div className="h-10 border-b border-white/5 px-4 flex items-center justify-between bg-[#0b1120]/20">
                      <div className="w-24 h-2 bg-white/10 rounded" />
                      <div className="flex space-x-2 items-center">
                        <div className="w-4 h-4 rounded-full bg-white/10" />
                        <div className="w-4 h-4 rounded-full bg-white/10" />
                      </div>
                    </div>

                    {/* Mock dashboard page */}
                    <div className="flex-1 p-4 space-y-4">
                      {/* Sub-header */}
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <div className="w-32 h-3 bg-white/20 rounded" />
                          <div className="w-20 h-1.5 bg-white/10 rounded" />
                        </div>
                        <div
                          className="px-2.5 py-1 text-[8px] font-bold rounded transition-colors text-slate-900 cursor-default"
                          style={{
                            backgroundColor: accentColor,
                            boxShadow: `0 0 10px ${accentColor}30`,
                          }}
                        >
                          Deploy Node
                        </div>
                      </div>

                      {/* Mock top metrics */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Metric Card 1 */}
                        <div className="glass-card p-3 rounded-custom-sm border border-white/5 bg-slate-900/30 flex flex-col space-y-2">
                          <div className="w-12 h-2.5 bg-white/10 rounded" />
                          <div className="flex items-baseline justify-between">
                            <span className="text-md font-bold text-white">99.9%</span>
                            <span className="text-[8px] font-bold" style={{ color: accentColor }}>
                              +0.1%
                            </span>
                          </div>
                        </div>

                        {/* Metric Card 2 */}
                        <div className="glass-card p-3 rounded-custom-sm border border-white/5 bg-slate-900/30 flex flex-col space-y-2">
                          <div className="w-12 h-2.5 bg-white/10 rounded" />
                          <div className="flex items-baseline justify-between">
                            <span className="text-md font-bold text-white">4,201</span>
                            <span className="text-[8px] font-bold" style={{ color: accentColor }}>
                              Active
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Mock Chart Area */}
                      <div className="glass-card flex-1 p-4 rounded-custom-sm border border-white/5 bg-slate-900/20 h-[210px] flex flex-col justify-end space-y-3">
                        <div className="flex justify-between items-center h-full">
                          <div className="h-full w-[2px] bg-white/5" />
                          <div className="w-full h-full flex items-end justify-around px-2 relative">
                            {/* Accent Glow backdrop */}
                            <div
                              className="absolute inset-x-0 bottom-0 h-10 opacity-10 blur-md transition-all duration-300"
                              style={{ backgroundColor: accentColor }}
                            />
                            
                            {/* Dummy bars */}
                            <div className="w-4 bg-white/10 rounded-t h-1/4" />
                            <div className="w-4 bg-white/10 rounded-t h-2/5" />
                            <div
                              className="w-4 rounded-t h-3/5 transition-all duration-300"
                              style={{ backgroundColor: accentColor }}
                            />
                            <div className="w-4 bg-white/10 rounded-t h-1/2" />
                            <div className="w-4 bg-white/10 rounded-t h-3/4" />
                            <div
                              className="w-4 rounded-t h-4/5 transition-all duration-300"
                              style={{ backgroundColor: accentColor }}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between px-2">
                          <div className="w-4 h-1.5 bg-white/10 rounded" />
                          <div className="w-4 h-1.5 bg-white/10 rounded" />
                          <div className="w-4 h-1.5 bg-white/10 rounded" />
                          <div className="w-4 h-1.5 bg-white/10 rounded" />
                          <div className="w-4 h-1.5 bg-white/10 rounded" />
                          <div className="w-4 h-1.5 bg-white/10 rounded" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          // Steps 1, 2, and 4 layouts (Portrait centralized forms)
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-[540px] glass-card rounded-custom-lg p-8 z-10 shadow-2xl relative"
          >
            {/* Step navigation / progress */}
            <div className="flex items-center justify-between text-xs border-b border-white/5 pb-4 mb-6">
              <span className="text-primary font-semibold tracking-wider uppercase">
                Step {currentStep} of 4:{' '}
                {currentStep === 1
                  ? 'Business Info'
                  : currentStep === 2
                  ? 'Industry'
                  : 'Invite Team'}
              </span>
              <span className="text-text-muted">
                {currentStep === 1
                  ? 'Workspace Config'
                  : currentStep === 2
                  ? 'Operational Domain'
                  : 'Workspace Launch'}
              </span>
            </div>

            {/* Stepper Circles Header */}
            <div className="flex items-center justify-center mb-8 relative">
              <div className="absolute left-[12%] right-[12%] top-1/2 h-[2px] bg-white/5 -translate-y-1/2 z-0" />
              <div
                className="absolute left-[12%] top-1/2 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-300"
                style={{
                  width:
                    currentStep === 1
                      ? '0%'
                      : currentStep === 2
                      ? '38%'
                      : currentStep === 4
                      ? '100%'
                      : '0%',
                }}
              />

              <div className="flex justify-between w-full z-10 px-4">
                {/* Step 1 Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-all duration-300 ${
                      currentStep > 1
                        ? 'bg-primary border-primary text-slate-900'
                        : currentStep === 1
                        ? 'bg-[#00F5FF]/10 border-primary text-primary shadow-[0_0_10px_rgba(0,245,255,0.2)]'
                        : 'bg-slate-900 border-white/10 text-text-muted'
                    }`}
                  >
                    {currentStep > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '1'}
                  </div>
                  <span className="text-[9px] font-bold text-text-secondary mt-1.5 uppercase tracking-wider">Info</span>
                </div>

                {/* Step 2 Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-all duration-300 ${
                      currentStep > 2
                        ? 'bg-primary border-primary text-slate-900'
                        : currentStep === 2
                        ? 'bg-[#00F5FF]/10 border-primary text-primary shadow-[0_0_10px_rgba(0,245,255,0.2)]'
                        : 'bg-slate-900 border-white/10 text-text-muted'
                    }`}
                  >
                    {currentStep > 2 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '2'}
                  </div>
                  <span className="text-[9px] font-bold text-text-secondary mt-1.5 uppercase tracking-wider">Domain</span>
                </div>

                {/* Step 3 Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-all duration-300 ${
                      currentStep > 3
                        ? 'bg-primary border-primary text-slate-900'
                        : (currentStep as number) === 3
                        ? 'bg-[#00F5FF]/10 border-primary text-primary shadow-[0_0_10px_rgba(0,245,255,0.2)]'
                        : 'bg-slate-900 border-white/10 text-text-muted'
                    }`}
                  >
                    {currentStep > 3 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '3'}
                  </div>
                  <span className="text-[9px] font-bold text-text-secondary mt-1.5 uppercase tracking-wider">Brand</span>
                </div>

                {/* Step 4 Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-all duration-300 ${
                      currentStep === 4
                        ? 'bg-[#00F5FF]/10 border-primary text-primary shadow-[0_0_10px_rgba(0,245,255,0.2)]'
                        : 'bg-slate-900 border-white/10 text-text-muted'
                    }`}
                  >
                    '4'
                  </div>
                  <span className="text-[9px] font-bold text-text-secondary mt-1.5 uppercase tracking-wider">Launch</span>
                </div>
              </div>
            </div>

            {/* Error Message banner */}
            <AnimatePresence mode="wait">
              {apiError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-danger/10 border border-danger/20 text-danger text-xs px-4 py-2.5 rounded-custom-sm mb-4 leading-relaxed overflow-hidden"
                >
                  {apiError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Content Switcher */}
            <div className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight uppercase">Business Identity</h2>
                    <p className="text-xs text-text-secondary mt-1">
                      Configure your organization's core details to tailor the platform's financial and operational models.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                        Registered Business Name
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g. Acme Logistics Ltd."
                          className="w-full glass-input pl-10 pr-3.5 py-2.5 text-sm rounded-custom-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                        Organization Size
                      </label>
                      <div className="relative">
                        <Users className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                        <select
                          value={orgSize}
                          onChange={(e) => setOrgSize(e.target.value)}
                          className="w-full glass-input pl-10 pr-10 py-2.5 text-sm rounded-custom-sm appearance-none cursor-pointer"
                        >
                          <option value="1-10">1 - 10 employees</option>
                          <option value="11-50">11 - 50 employees</option>
                          <option value="51-200">51 - 200 employees</option>
                          <option value="201+">201+ employees</option>
                        </select>
                        <ChevronRight className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                        Operating Region
                      </label>
                      <div className="flex items-center justify-between glass-input px-3.5 py-2.5 rounded-custom-sm border border-primary/20 bg-primary/5">
                        <div className="flex items-center space-x-2.5">
                          <span className="text-lg">🇳🇬</span>
                          <span className="text-sm text-text-primary font-medium">{operatingRegion}</span>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-primary stroke-[3]" />
                        </div>
                      </div>
                      <p className="text-[10px] text-text-muted mt-2 leading-relaxed">
                        ℹ OpsPilot currently operates exclusively for Nigerian domiciled entities.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight uppercase">Operational Domain</h2>
                    <p className="text-xs text-text-secondary mt-1">
                      Select the primary industry for this instance. This configures the initial dashboard widgets and AI telemetry models.
                    </p>
                  </div>

                  {/* Industry selection grid */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    {INDUSTRIES.map((ind) => {
                      const Icon = ind.icon;
                      const isSelected = selectedIndustry === ind.id;
                      return (
                        <button
                          key={ind.id}
                          onClick={() => setSelectedIndustry(ind.id)}
                          className={`p-4 rounded-custom-md border text-left cursor-pointer transition-all duration-200 flex flex-col space-y-2 group ${
                            isSelected
                              ? 'bg-primary/5 border-primary shadow-[0_0_15px_rgba(0,245,255,0.08)]'
                              : 'bg-slate-900/40 border-white/5 hover:border-white/10'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-custom-sm flex items-center justify-center transition-colors ${
                              isSelected ? 'bg-primary/10 text-primary' : 'bg-white/5 text-text-secondary group-hover:text-text-primary'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">{ind.name}</span>
                            <span className="text-[10px] text-text-muted leading-relaxed block mt-0.5">
                              {ind.description}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight uppercase">Invite Team</h2>
                    <p className="text-xs text-text-secondary mt-1">
                      Invite team members to collaborate on your OpsPilot operations center workspace.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Summary badge review */}
                    <div className="glass-card p-4 rounded-custom-md border border-white/5 space-y-2 text-xs">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Configuration Review</span>
                      <div className="grid grid-cols-2 gap-2 text-text-secondary pt-1">
                        <div>Business: <span className="text-white font-medium">{businessName}</span></div>
                        <div>Size: <span className="text-white font-medium">{orgSize}</span></div>
                        <div>Region: <span className="text-white font-medium">{operatingRegion}</span></div>
                        <div>Domain: <span className="text-white font-medium">{selectedIndustry}</span></div>
                      </div>
                      <div className="flex items-center space-x-1.5 text-text-secondary text-[11px] pt-1">
                        <span>Brand Theme:</span>
                        <div className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: accentColor }} />
                        <span className="font-mono text-white text-[10px]">{accentColor}</span>
                      </div>
                    </div>

                    {/* Email invite list */}
                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                        Add Collaborators
                      </label>
                      <div className="flex space-x-2">
                        <div className="relative flex-1">
                          <Mail className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            value={currentEmail}
                            onChange={(e) => {
                              setCurrentEmail(e.target.value);
                              setApiError(null);
                            }}
                            placeholder="teammate@company.com"
                            className="w-full glass-input pl-10 pr-3.5 py-2.5 text-sm rounded-custom-sm"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddEmail();
                              }
                            }}
                          />
                        </div>
                        <Button variant="outline" type="button" onClick={handleAddEmail}>
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Tags list */}
                    {teamEmails.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-2.5 rounded-custom-sm bg-slate-900/50 border border-white/5 max-h-[120px] overflow-y-auto">
                        {teamEmails.map((email) => (
                          <div
                            key={email}
                            className="flex items-center space-x-1.5 bg-white/5 border border-white/10 text-white text-xs px-2.5 py-1.5 rounded-full"
                          >
                            <span>{email}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveEmail(email)}
                              className="text-text-secondary hover:text-danger cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                {currentStep === 1 ? (
                  <Button variant="ghost" onClick={handleCancel} className="text-danger hover:text-danger hover:bg-danger/5 border border-danger/10">
                    Cancel Setup
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={handlePrevStep} className="flex items-center space-x-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </Button>
                )}

                {currentStep === 4 ? (
                  <Button
                    variant="primary"
                    onClick={handleInitialize}
                    className="flex items-center space-x-2 px-6"
                    isLoading={loading}
                  >
                    <span>Initialize Core</span>
                    <Rocket className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleNextStep} className="flex items-center space-x-2">
                    <span>Next Step</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
