import { NextRequest, NextResponse } from 'next/server';
import { getJwtUser } from '@/lib/auth-server';

// API routes that require authentication
const protectedApiRoutes = [
  '/api/ideas',
  '/api/meetings',
  '/api/submit-idea',
  '/api/chatbot',
  '/api/odrlabs',
];

// API routes that require admin role
const adminApiRoutes = [
  '/api/admin',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if this API route requires protection
  const requiresAuth = protectedApiRoutes.some(route => pathname.startsWith(route));
  const requiresAdmin = adminApiRoutes.some(route => pathname.startsWith(route));
  
  // Skip if not a protected route
  if (!requiresAuth && !requiresAdmin) {
    return NextResponse.next();
  }
  
  // Get user from request
  const user = await getJwtUser(request);
  
  // Return 401 if no authenticated user
  if (!user) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  // Check admin access for admin routes
  if (requiresAdmin && user.userRole !== 'ADMIN') {
    return new NextResponse(
      JSON.stringify({ error: 'Insufficient permissions' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  // User is authenticated and authorized, proceed
  return NextResponse.next();
}

// Apply this middleware only to API routes
export const config = {
  matcher: ['/api/:path*'],
};
