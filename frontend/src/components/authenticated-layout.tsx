'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AppLayout } from '@/components/app-layout';
import { LoadingSpinner } from '@/components/states';

export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.push('/login');
    }
  }, [loading, token, router]);

  if (loading) return <LoadingSpinner className="h-screen" />;
  if (!token) return null;

  return <AppLayout>{children}</AppLayout>;
}
