'use client';

import PageGuard from './PageGuard';
import { ReactNode } from 'react';

interface AdminGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function AdminGuard({ children, redirectTo = '/signin' }: AdminGuardProps) {
  return (
    <PageGuard requiredRole="ADMIN" redirectTo={redirectTo}>
      {children}
    </PageGuard>
  );
}
