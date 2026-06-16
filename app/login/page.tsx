'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import Button from '@/components/ui/Button';

// Validation Schemas
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .refine((val) => /[A-Z]/.test(val), { message: 'Password must contain at least one uppercase letter' })
    .refine((val) => /[0-9]/.test(val), { message: 'Password must contain at least one digit' }),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Form hooks
  const {
    register: registerLoginField,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerSignupField,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: data.email,
        password: data.password,
      });

      const { user, tokens } = response.data.data;
      setAuth(user, tokens.access_token, tokens.refresh_token);

      // If user doesn't have business_id set or operational domain initialized, route to onboarding
      if (user.role === 'super_admin') {
        router.push('/admin/overview');
      } else if (!user.business_id) {
        router.push('/onboarding');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        business_name: data.businessName,
      });

      const { user, tokens } = response.data.data;
      setAuth(user, tokens.access_token, tokens.refresh_token);

      // New registrations are routed to onboarding to configure workspace details
      router.push('/onboarding');
    } catch (err: any) {
      setApiError(err.response?.data?.message || err.response?.data?.detail || 'Registration failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background p-4 overflow-hidden">
      {/* Premium Cyber/Futuristic Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glassmorphic Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[460px] glass-card rounded-custom-lg p-8 z-10 shadow-2xl relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-custom-sm bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(0,245,255,0.05)]">
            <Rocket className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">OpsPilot</h1>
          <span className="text-[10px] tracking-[0.25em] text-primary font-semibold uppercase mt-1">
            Mission Control
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="relative flex border-b border-white/5 mb-6">
          <button
            onClick={() => {
              setActiveTab('login');
              setApiError(null);
            }}
            className={`flex-1 pb-3 text-sm font-medium transition-colors relative cursor-pointer ${
              activeTab === 'login' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Login
            {activeTab === 'login' && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
              />
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setApiError(null);
            }}
            className={`flex-1 pb-3 text-sm font-medium transition-colors relative cursor-pointer ${
              activeTab === 'register' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Register
            {activeTab === 'register' && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
              />
            )}
          </button>
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

        {/* Active Tab Forms */}
        <div className="space-y-4">
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full glass-input px-3.5 py-2.5 text-sm rounded-custom-sm focus:ring-1 focus:ring-primary"
                  {...registerLoginField('email')}
                />
                {loginErrors.email && (
                  <p className="text-danger text-xs mt-1">{loginErrors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full glass-input px-3.5 py-2.5 text-sm rounded-custom-sm focus:ring-1 focus:ring-primary"
                  {...registerLoginField('password')}
                />
                {loginErrors.password && (
                  <p className="text-danger text-xs mt-1">{loginErrors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center space-x-2 text-text-secondary cursor-pointer hover:text-text-primary">
                  <input
                    type="checkbox"
                    className="rounded border-white/10 bg-slate-900 text-primary focus:ring-0 cursor-pointer"
                  />
                  <span>Remember device</span>
                </label>
                <a href="#" className="text-primary hover:underline font-medium">
                  Recover Access
                </a>
              </div>

              <Button type="submit" variant="primary" className="w-full py-3 mt-2" isLoading={isLoading}>
                Authenticate
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit(onRegister)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane"
                    className="w-full glass-input px-3.5 py-2.5 text-sm rounded-custom-sm focus:ring-1 focus:ring-primary"
                    {...registerSignupField('firstName')}
                  />
                  {signupErrors.firstName && (
                    <p className="text-danger text-xs mt-1">{signupErrors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full glass-input px-3.5 py-2.5 text-sm rounded-custom-sm focus:ring-1 focus:ring-primary"
                    {...registerSignupField('lastName')}
                  />
                  {signupErrors.lastName && (
                    <p className="text-danger text-xs mt-1">{signupErrors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="jane.doe@company.com"
                  className="w-full glass-input px-3.5 py-2.5 text-sm rounded-custom-sm focus:ring-1 focus:ring-primary"
                  {...registerSignupField('email')}
                />
                {signupErrors.email && (
                  <p className="text-danger text-xs mt-1">{signupErrors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                  Business Name
                </label>
                <input
                  type="text"
                  placeholder="Acme Corporation"
                  className="w-full glass-input px-3.5 py-2.5 text-sm rounded-custom-sm focus:ring-1 focus:ring-primary"
                  {...registerSignupField('businessName')}
                />
                {signupErrors.businessName && (
                  <p className="text-danger text-xs mt-1">{signupErrors.businessName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full glass-input px-3.5 py-2.5 text-sm rounded-custom-sm focus:ring-1 focus:ring-primary"
                  {...registerSignupField('password')}
                />
                {signupErrors.password && (
                  <p className="text-danger text-xs mt-1">{signupErrors.password.message}</p>
                )}
              </div>

              <Button type="submit" variant="primary" className="w-full py-3 mt-2" isLoading={isLoading}>
                Register Workspace
              </Button>
            </form>
          )}

          {/* Social Divider */}
          <div className="relative flex items-center justify-center my-6 py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <span className="relative px-3 text-[10px] uppercase font-semibold tracking-wider text-text-muted bg-[#0e1627] z-10">
              Or Provider
            </span>
          </div>

          {/* Google SSO */}
          <button
            type="button"
            className="w-full flex items-center justify-center glass-card hover:bg-white/5 py-3 rounded-custom-sm text-sm font-semibold transition-all border border-white/10 text-white cursor-pointer"
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </div>
      </motion.div>
    </div>
  );
}
