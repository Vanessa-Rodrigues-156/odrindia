import { NextRequest, NextResponse } from 'next/server';

// Paths that require authentication
const protectedPaths = [
  '/discussion',
  '/admin',
  '/submit-idea',
  '/chatbot',
  '/odrlabs',
];

// Paths that specifically require admin role
const adminPaths = [
  '/admin',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if this is a path that requires protection
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));
  
  // If it's not a protected path, continue
  if (!isProtectedPath) {
    return NextResponse.next();
  }
  
  // Check for user data in cookies
  const sessionCookie = request.cookies.get('odrindia_session');
  if (!sessionCookie?.value) {
    // Redirect to login if no session cookie found
    const url = new URL('/signin', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // For admin paths, verify admin role
  if (isAdminPath) {
    try {
      const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString('utf-8'));
      if (sessionData.user.userRole !== 'ADMIN') {
        // Redirect non-admins attempting to access admin routes
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // If cookie parsing fails, clear it and redirect to login
      const response = NextResponse.redirect(new URL('/signin', request.url));
      response.cookies.delete('odrindia_session');
      return response;
    }
  }
  
  // Otherwise, continue with the request
  return NextResponse.next();
}

// Only run middleware on routes that need to be protected
export const config = {
  matcher: [
    // Match all request paths except for static files, api routes, and _next
    '/((?!_next/static|_next/image|favicon.ico|public/|api/).*)',
  ],
};
