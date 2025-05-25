"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from './auth-server';

// We import User type from auth-server.ts

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user data on initial render and set up refresh interval
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        // Get user data from the server to ensure we have the latest version
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important for cookies
        });

        if (response.ok) {
          const userData = await response.json();
          if (userData?.user) {
            setUser(userData.user);
          } else {
            setUser(null);
          }
        } else {
          // Handle error or expired session
          setUser(null);
          
          // Clear any client-side stored user data for backward compatibility
          if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('currentUser');
          }
        }
      } catch (error) {
        console.error('Error loading user session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
    
    // Set up a refresh interval (every 10 minutes)
    const refreshInterval = setInterval(loadUser, 10 * 60 * 1000);
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  // Login user (create session)
  const login = async (userData: User) => {
    try {
      // We receive the user data after successful server-side authentication
      // No need to send it back to the server here
      
      // Update local state with user data
      setUser(userData);
      
      // For backward compatibility - also store in localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(userData));
      }
      
      // Verify session is active by making a session check
      const sessionResponse = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
      });
      
      if (!sessionResponse.ok) {
        throw new Error('Session validation failed');
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Logout user (destroy session)
  const logout = async () => {
    try {
      // Call the logout endpoint to clear server-side session
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of server response
      setUser(null);
      
      // For backward compatibility
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('currentUser');
      }
      
      // Redirect to signin page
      router.push('/signin');
    }
  };

  // Update user data
  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...userData };
      
      // Call API to update user data
      const response = await fetch(`/api/auth/update-user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userData: updatedUser }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user data');
      }
      
      // Update local state
      setUser(updatedUser);
      
      // For backward compatibility
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };
  
  // Force refresh user data from server
  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (response.ok) {
        const userData = await response.json();
        if (userData?.user) {
          setUser(userData.user);
          
          // For backward compatibility
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('currentUser', JSON.stringify(userData.user));
          }
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      updateUser,
      refreshUser
    }}>
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
        const currentPath = window.location.pathname;
        router.push(`/signin?redirect=${encodeURIComponent(currentPath)}`);
      }
    }, [loading, user, router]);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
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
          const currentPath = window.location.pathname;
          router.push(`/signin?redirect=${encodeURIComponent(currentPath)}`);
        } else if (user.userRole !== 'ADMIN') {
          router.push('/'); // Redirect non-admins to home page
        }
      }
    }, [loading, user, router]);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
            <p className="text-gray-600">Loading admin panel...</p>
          </div>
        </div>
      );
    }

    if (!user || user.userRole !== 'ADMIN') {
      return null; // Will redirect in useEffect
    }

    return <Component {...props} />;
  };
};

// Server-side authentication functionality moved to auth-server.ts
