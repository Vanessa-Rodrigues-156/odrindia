import { NextRequest } from 'next/server';

// Define our User type based on the database schema
export interface User {
  id: string;
  name: string;
  email: string;
  userRole: 'INNOVATOR' | 'MENTOR' | 'ADMIN' | 'OTHER';
  contactNumber?: string;
  city?: string;
  country?: string;
  institution?: string;
  highestEducation?: string;
  odrLabUsage?: string;
  createdAt: string;
}

// Function to get the user from session cookie or JWT in API routes
export async function getJwtUser(request: NextRequest): Promise<User | null> {
  try {
    // First check for auth cookie
    const sessionCookie = request.cookies.get('odrindia_session');
    
    if (sessionCookie?.value) {
      try {
        // The cookie should contain encoded session data
        // In production, this would be a JWT that should be verified with a secret
        const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString('utf-8'));
        
        // Verify session expiration
        if (sessionData.exp && new Date(sessionData.exp) > new Date()) {
          console.log('Valid session found:', sessionData.user.email);
          return sessionData.user as User;
        } else {
          console.log('Session expired');
        }
      } catch (error) {
        console.error('Error parsing session cookie:', error);
      }
    } else {
      console.log('No session cookie found');
    }
    
    // Fallback: check for x-auth-user header (backward compatibility)
    const authHeader = request.headers.get('x-auth-user');
    if (authHeader) {
      const userData = JSON.parse(decodeURIComponent(authHeader));
      return userData as User;
    }
    
    // No valid authentication found
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_DEV_AUTH === 'true') {
      console.warn('Using mock user for development. This is not secure for production.');
      return {
        id: 'dev-user-id',
        name: 'Development User',
        email: 'dev@example.com',
        userRole: 'ADMIN',
        createdAt: new Date().toISOString()
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error in authentication:', error);
    return null;
  }
}
