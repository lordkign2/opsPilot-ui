'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/overview');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[300px] text-xs text-text-muted">
      Redirecting to overview...
    </div>
  );
}
