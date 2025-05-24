'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth';

interface PageGuardProps {
  children: ReactNode;
  requiredRole?: 'ADMIN' | 'MENTOR' | 'INNOVATOR' | 'OTHER';
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function PageGuard({ 
  children, 
  requiredRole, 
  requireAuth = true,
  redirectTo = '/signin'
}: PageGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Only redirect after auth state has loaded
    if (!loading) {
      // Check if user authentication is required
      if (requireAuth && !user) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to continue',
          variant: 'destructive',
        });
        router.push(redirectTo);
        return;
      }

      // If specific role is required, check user role
      if (user && requiredRole && user.userRole !== requiredRole) {
        toast({
          title: 'Access Denied',
          description: "You don't have permission to access this page",
          variant: 'destructive',
        });
        router.push('/');
        return;
      }
    }
  }, [user, loading, router, requireAuth, requiredRole, redirectTo, toast]);

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#0a1e42]"></div>
          <p className="text-lg text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Don't render children until permissions are verified
  if ((requireAuth && !user) || (requiredRole && user?.userRole !== requiredRole)) {
    return null;
  }

  // Render children if all checks pass
  return <>{children}</>;
}
