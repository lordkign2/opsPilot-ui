'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import apiClient from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBizChecked, setIsBizChecked] = useState(false);
  const [isBizInitialized, setIsBizInitialized] = useState(false);

  // Set mounted flag to avoid hydration differences
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch business initialization state
  useEffect(() => {
    if (!mounted) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const hasAuth = !!token;

    if (!hasAuth) {
      setIsBizChecked(true);
      setIsBizInitialized(false);
      setLoading(false);
      return;
    }

    if (user?.role === 'super_admin') {
      setIsBizChecked(true);
      setIsBizInitialized(true);
      setLoading(false);
      return;
    }

    const checkBusiness = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.BUSINESSES.CURRENT);
        if (response.data?.data) {
          const biz = response.data.data;
          // If the business has an industry selected, it is initialized!
          if (biz.industry) {
            setIsBizInitialized(true);
          } else {
            setIsBizInitialized(false);
          }
        } else {
          setIsBizInitialized(false);
        }
      } catch (err) {
        console.error('Failed to verify business state', err);
        setIsBizInitialized(false);
      } finally {
        setIsBizChecked(true);
      }
    };

    checkBusiness();
  }, [isAuthenticated, user, pathname, mounted]);

  // Handle routing redirects based on auth and initialization states
  useEffect(() => {
    if (!mounted || !isBizChecked) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const hasAuth = !!token;
    const isPublicRoute = pathname === '/login';

    if (!hasAuth && !isPublicRoute) {
      router.replace('/login');
    } else if (hasAuth && isPublicRoute) {
      if (user?.role === 'super_admin') {
        router.replace('/admin/overview');
      } else if (isBizInitialized) {
        router.replace('/');
      } else {
        router.replace('/onboarding');
      }
    } else if (hasAuth && !isPublicRoute && pathname !== '/onboarding') {
      if (user?.role === 'super_admin') {
        // Redirection block protecting standard workspace routes from admin access
        const isStandardRoute = pathname === '/' || 
                                pathname.startsWith('/pos') || 
                                pathname.startsWith('/orders') || 
                                pathname.startsWith('/customers') || 
                                pathname.startsWith('/workflows') || 
                                pathname.startsWith('/ai') ||
                                pathname.startsWith('/inventory') ||
                                pathname.startsWith('/analytics');
        if (isStandardRoute) {
          router.replace('/admin/overview');
        } else {
          setLoading(false);
        }
      } else if (!isBizInitialized) {
        router.replace('/onboarding');
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [mounted, isBizChecked, isBizInitialized, pathname, router, user]);

  if (!mounted) {
    return null;
  }

  // Show a premium cyberpunk loader when checking auth status on non-public routes
  if (loading && pathname !== '/login') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0b1120] text-primary">
        <div className="flex flex-col items-center space-y-4">
          <svg
            className="animate-spin h-8 w-8 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary animate-pulse">
            Establishing Link...
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

