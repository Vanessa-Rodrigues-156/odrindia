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
import { apiFetch } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  userRole: "INNOVATOR" | "MENTOR" | "ADMIN" | "OTHER";
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
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const refreshPromiseRef = useRef<Promise<any> | null>(null);
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
        const response = await apiFetch("/auth/session", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          // Don't set error on 401, just clear the user
          if (response.status === 401) {
            setUser(null);
            return null;
          }
          throw new Error("Failed to refresh session");
        }

        const data = await response.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          return data.user;
        } else {
          setUser(null);
          return null;
        }
      } catch (err) {
        console.error("Session refresh error:", err);
        setUser(null);
        return null;
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

  // Only run on mount
  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Add request timeout to avoid hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        // Log more detailed error information for debugging
        console.error("Login error response:", response.status, data);
        throw new Error(data.error || "Authentication failed");
      }

      setUser(data.user);
      return data;
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.name === "AbortError") {
        setError("Login request timed out. Please try again.");
      } else {
        setError(err.message || "Failed to login. Please check your credentials.");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/signin");
  };

  const contextValue = {
    user,
    loading,
    error,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Route protection HOC
export const withAuth = (Component: React.ComponentType<unknown>) => {
  return function AuthenticatedComponent(props: Record<string, unknown>) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        const currentPath = window.location.pathname;
        // Prevent infinite loops - don't redirect if we're already at /signin
        if (currentPath !== '/signin') {
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
