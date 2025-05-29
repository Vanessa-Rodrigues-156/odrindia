"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Only run on mount
  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log("Attempting login with email:", email);
      const res = await apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      // Parse response data regardless of success/failure for better error messages
      let data;
      try {
        data = await res.json();
      } catch (parseErr) {
        console.error("Failed to parse login response:", parseErr);
        return false;
      }
      
      if (!res.ok) {
        const errorMsg = `Login failed: ${res.status} - ${data?.error || "Unknown error"}`;
        console.error(errorMsg);
        return false;
      }
      
      if (data.token) {
        // Store the token in localStorage
        localStorage.setItem("token", data.token);
        
        // Update the user state with the returned user data
        setUser(data.user);
        
        console.log("Login successful for:", data.user.email, "with role:", data.user.userRole);
        
        // Immediately refresh user info to ensure everything is up-to-date
        await refreshUser();
        return true;
      } else {
        console.error("Login returned success but no token was provided");
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/signin");
  };

  const refreshUser = async () => {
    setLoading(true);
    try {
      // Check if we have a token to even attempt a session refresh
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, skipping session refresh");
        setUser(null);
        return;
      }
      
      console.log("Refreshing user session");
      const res = await apiFetch("/auth/session", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      if (res.ok) {
        try {
          const data = await res.json();
          if (data.user) {
            console.log("Session refresh successful for:", data.user.email);
            setUser(data.user);
          } else {
            console.warn("Session endpoint returned OK but no user data");
            setUser(null);
          }
        } catch (parseErr) {
          console.error("Failed to parse session response:", parseErr);
          setUser(null);
        }
      } else {
        console.warn(`Session refresh failed: ${res.status}`);
        // Clear invalid token
        if (res.status === 401) {
          localStorage.removeItem("token");
        }
        setUser(null);
      }
    } catch (err) {
      console.error("Session refresh error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
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
