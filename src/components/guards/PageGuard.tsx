'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageGuardProps {
  children: ReactNode;
  requiredRole?: 'ADMIN' | 'MENTOR' | 'INNOVATOR' | 'OTHER';
  requireAuth?: boolean;
  redirectTo?: string;
  allowedRoles?: ('ADMIN' | 'MENTOR' | 'INNOVATOR' | 'OTHER')[];
  checkPermission?: (user: any) => boolean | Promise<boolean>;
}

export default function PageGuard({ 
  children, 
  requiredRole, 
  requireAuth = true,
  redirectTo,
  allowedRoles,
  checkPermission
}: PageGuardProps) {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Wait for auth to load
        if (loading) return;
        
        setIsCheckingPermission(true);

        // Check if authentication is required
        if (requireAuth && !user) {
          // Capture current path for redirect after login
          const currentPath = window.location.pathname;
          const loginRedirect = redirectTo || `/signin?redirect=${encodeURIComponent(currentPath)}`;
          
          toast({
            title: 'Authentication Required',
            description: 'Please sign in to continue',
            variant: 'destructive',
          });
          
          router.push(loginRedirect);
          setPermissionChecked(true);
          setHasPermission(false);
          return;
        }

        // Check for specific role requirement
        if (user && requiredRole && user.userRole !== requiredRole) {
          toast({
            title: 'Access Denied',
            description: "You don't have permission to access this page",
            variant: 'destructive',
          });
          
          router.push('/');
          setPermissionChecked(true);
          setHasPermission(false);
          return;
        }

        // Check for allowed roles (multiple roles)
        if (user && allowedRoles && allowedRoles.length > 0) {
          if (!allowedRoles.includes(user.userRole)) {
            toast({
              title: 'Access Denied',
              description: "You don't have permission to access this page",
              variant: 'destructive',
            });
            
            router.push('/');
            setPermissionChecked(true);
            setHasPermission(false);
            return;
          }
        }

        // Custom permission check if provided
        if (user && checkPermission) {
          const result = await Promise.resolve(checkPermission(user));
          if (!result) {
            toast({
              title: 'Access Denied',
              description: "You don't have permission to access this resource",
              variant: 'destructive',
            });
            
            router.push('/');
            setPermissionChecked(true);
            setHasPermission(false);
            return;
          }
        }

        // All permission checks passed
        setPermissionChecked(true);
        setHasPermission(true);
      } catch (error) {
        console.error("Permission check error:", error);
        setPermissionChecked(true);
        setHasPermission(false);
        toast({
          title: 'Error',
          description: "Failed to verify permissions",
          variant: 'destructive',
        });
      } finally {
        setIsCheckingPermission(false);
      }
    };

    checkAuth();
  }, [user, loading, router, requireAuth, requiredRole, redirectTo, toast, allowedRoles, checkPermission]);

  // Loading state
  if (loading || isCheckingPermission) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#0a1e42]"></div>
          <p className="text-lg text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Permission denied
  if (permissionChecked && !hasPermission) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center">
        <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <h2 className="mb-2 text-xl font-bold text-[#0a1e42]">Access Denied</h2>
          <p className="mb-4 text-gray-600">You don't have permission to access this page.</p>
          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={() => router.push('/')}>
              Go to Homepage
            </Button>
            <Button onClick={() => {
              refreshUser().then(() => setPermissionChecked(false));
            }}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  if (permissionChecked && hasPermission) {
    return <>{children}</>;
  }

  // Don't render anything while checks are still in progress
  return null;
}
