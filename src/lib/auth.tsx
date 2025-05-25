'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { NextRequest } from 'next/server';

// Define our User type based on the database schema
interface User {
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

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        // Clear invalid data
        localStorage.removeItem('currentUser');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    router.push('/signin');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Route protection HOC
export const withAuth = (Component: React.ComponentType<any>) => {
  return function AuthenticatedComponent(props: any) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/signin');
      }
    }, [loading, user, router]);

    if (loading) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user) {
      return null; // Will redirect in useEffect
    }

    return <Component {...props} />;
  };
};

// Admin route protection HOC
export const withAdminAuth = (Component: React.ComponentType<any>) => {
  return function AdminAuthenticatedComponent(props: any) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/signin');
        } else if (user.userRole !== 'ADMIN') {
          router.push('/'); // Redirect non-admins to home page
        }
      }
    }, [loading, user, router]);

    if (loading) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user || user.userRole !== 'ADMIN') {
      return null; // Will redirect in useEffect
    }

    return <Component {...props} />;
  };
};

// Function to get the user from JWT in API routes
export async function getJwtUser(request: NextRequest): Promise<User | null> {
  try {
    // In a real JWT system, you would verify the JWT token from cookies/headers
    // For now, we'll extract the user data from a custom header for API routes
    const authHeader = request.headers.get('x-auth-user');
    
    if (!authHeader) {
      // No authentication header found
      // For development purposes, if we're in development mode, return a mock admin user
      if (process.env.NODE_ENV === 'development') {
        // This is only for development! Remove in production
        console.warn('Using mock user for development. Remove in production.');
        return {
          id: 'dev-user-id',
          name: 'Development User',
          email: 'dev@example.com',
          userRole: 'ADMIN',
          createdAt: new Date().toISOString()
        };
      }
      return null;
    }
    
    // Parse the user data
    const userData = JSON.parse(decodeURIComponent(authHeader));
    return userData as User;
  } catch (error) {
    console.error('Error parsing JWT user:', error);
    return null;
  }
}
