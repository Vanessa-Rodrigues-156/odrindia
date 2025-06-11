"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

// Remove trailing slash to prevent double slashes in URLs
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001").replace(/\/$/, "");

interface User {
  id: string;
  name: string;
  email: string;
  userRole: "INNOVATOR" | "MENTOR" | "ADMIN" | "OTHER"; // <-- Restrict to allowed values
  contactNumber?: string;
  city?: string;
  country?: string;
  institution?: string;
  highestEducation?: string;
  odrLabUsage?: string;
  imageAvatar?: string;
  createdAt: string;
}

// This interface represents the API response structure
interface GoogleSignInResponse {
  user: User;
  needsProfileCompletion: boolean; // This is calculated by the backend, not stored
  token?: string; 
  message: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null; // 
  login: (userData: User, token: string) => void;
  logout: () => void;
  signup: (userData: any) => Promise<any>;
  signInWithGoogle: (googleUser: any) => Promise<GoogleSignInResponse>;
  refreshUser: () => Promise<void>;
  completeProfile: (profileData: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  const refreshPromiseRef = useRef<Promise<void> | null>(null);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced refreshUser function to prevent race conditions
  const refreshUser = useCallback(async () => {
    // If a refresh is already in progress, return that promise
    if (refreshPromiseRef.current) {
      return refreshPromiseRef.current;
    }

    // Clear any pending timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Create and store the refresh promise
    refreshPromiseRef.current = (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setAccessToken(token);
        } else {
          localStorage.removeItem("token");
          setUser(null);
          setAccessToken(null);
        }
      } catch (error) {
        console.error("Session refresh failed:", error);
        localStorage.removeItem("token");
        setUser(null);
        setAccessToken(null);
      } finally {
        // Reset the promise reference after a short delay to prevent immediate subsequent calls
        refreshTimeoutRef.current = setTimeout(() => {
          refreshPromiseRef.current = null;
        }, 2000);
        setLoading(false);
      }
    })();

    return refreshPromiseRef.current;
  }, []);

  // Initialize auth state
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback((userData: User, token: string) => {
    localStorage.setItem("token", token);
    setUser(userData);
    setAccessToken(token);
    setLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    setAccessToken(null);

    // Clear any pending refresh
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }

    router.push("/signin");
  }, [router]);

  const signup = useCallback(
    async (userData: any) => {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      return data;
    },
    []
  );

  const signInWithGoogle = useCallback(
    async (googleUser: any): Promise<GoogleSignInResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/google-signin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: googleUser.email,
            name: googleUser.name,
            image: googleUser.picture,
          }),
        });

        if (!response.ok) {
          throw new Error("Google sign-in failed");
        }

        const data: GoogleSignInResponse = await response.json();

        // Always set user in context
        setUser(data.user);

        // If user doesn't need profile completion and we have a token, log them in
        if (!data.needsProfileCompletion && data.token) {
          localStorage.setItem("token", data.token);
          setAccessToken(data.token);
        }

        return data;
      } catch (error) {
        console.error("Google sign-in error:", error);
        throw error;
      }
    },
    []
  );

  // Add a profile completion function
  const completeProfile = useCallback(
    async (profileData: any) => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/complete-profile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(profileData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Profile completion failed" }));
          throw new Error(errorData.error || "Profile completion failed");
        }

        const data = await response.json();

        // Update user data and set token
        if (data.user && data.token) {
          localStorage.setItem("token", data.token);
          setUser(data.user);
          setAccessToken(data.token);
        }

        return data;
      } catch (error) {
        console.error("Profile completion error:", error);
        throw error;
      }
    },
    []
  );

  const value = {
    user,
    loading,
    accessToken, // <-- Add this line
    login,
    logout,
    signup,
    signInWithGoogle,
    refreshUser,
    completeProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Route protection HOC
export const withAuth = (Component: React.ComponentType<unknown>) => {
  return function AuthenticatedComponent(props: Record<string, unknown>) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        const currentPath = window.location.pathname;
        // Prevent infinite loops - don't redirect if we're already at /signin
        if (currentPath !== "/signin") {
          router.push(`/signin?redirect=${encodeURIComponent(currentPath)}`);
        }
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
export const withAdminAuth = (Component: React.ComponentType<unknown>) => {
  return function AdminAuthenticatedComponent(props: Record<string, unknown>) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          const currentPath = window.location.pathname;
          router.push(`/signin?redirect=${encodeURIComponent(currentPath)}`);
        } else if (user.userRole !== "ADMIN") {
          router.push("/"); // Redirect non-admins to home page
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

    if (!user || user.userRole !== "ADMIN") {
      return null; // Will redirect in useEffect
    }

    return <Component {...props} />;
  };
};
