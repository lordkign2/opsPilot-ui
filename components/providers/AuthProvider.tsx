'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Set mounted flag to avoid hydration differences
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const token = localStorage.getItem('access_token');
    const hasAuth = !!token;

    // Define public routes
    const isPublicRoute = pathname === '/login';

    if (!hasAuth && !isPublicRoute) {
      router.replace('/login');
    } else if (hasAuth && isPublicRoute) {
      // If already logged in, redirect away from login screen
      if (user && !user.business_id) {
        router.replace('/onboarding');
      } else {
        router.replace('/');
      }
    } else if (hasAuth && !isPublicRoute && pathname !== '/onboarding') {
      // If logged in but business is not set up
      if (user && !user.business_id) {
        router.replace('/onboarding');
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user, pathname, router, mounted]);

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
