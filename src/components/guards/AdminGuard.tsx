"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

export default function AdminGuard({
  children,
  redirectTo = "/signin",
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(redirectTo);
      } else if (user.userRole !== "ADMIN") {
        router.push("/");
      }
    }
  }, [user, loading, router, redirectTo]);

  if (loading || !user || user.userRole !== "ADMIN") {
    return null;
  }
  return <>{children}</>;
}
