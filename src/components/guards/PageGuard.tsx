"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageGuardProps {
  children: ReactNode;
  requiredRole?: "ADMIN" | "MENTOR" | "INNOVATOR" | "OTHER";
  requireAuth?: boolean;
  redirectTo?: string;
  allowedRoles?: ("ADMIN" | "MENTOR" | "INNOVATOR" | "OTHER")[];
  checkPermission?: (user: unknown) => boolean | Promise<boolean>;
}

export default function PageGuard({
  children,
  requiredRole,
  requireAuth = true,
  redirectTo = "/signin",
  allowedRoles,
  checkPermission,
}: PageGuardProps) {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push(redirectTo);
      } else if (requiredRole && user && user.userRole !== requiredRole) {
        router.push("/");
      }
    }
  }, [user, loading, router, requireAuth, requiredRole, redirectTo]);

  if (
    loading ||
    (requireAuth && !user) ||
    (requiredRole && user && user.userRole !== requiredRole)
  ) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#0a1e42]"></div>
          <p className="text-lg text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
