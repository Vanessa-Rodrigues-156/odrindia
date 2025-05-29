"use client";

import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import PageGuard from "@/components/guards/PageGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * This page is for debugging authentication issues
 * It should be removed or disabled in production
 */
export default function AuthTestPage() {
  const { user, loading, logout, refreshUser } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [loadingInfo, setLoadingInfo] = useState(false);

  // Run auth debug check
  const checkAuthDebugInfo = async () => {
    setLoadingInfo(true);
    try {
      const response = await apiFetch("/auth/debug");
      if (response.ok) {
        const data = await response.json();
        setDebugInfo(data);
        setTestStatus("success");
      } else {
        setTestStatus("error");
        setDebugInfo({ error: `Status: ${response.status}` });
      }
    } catch (err: unknown) {
      setTestStatus("error");
      setDebugInfo({ error: err instanceof Error ? err.message : 'An unknown error occurred' });
    } finally {
      setLoadingInfo(false);
    }
  };

  useEffect(() => {
    // Auto-check when user changes
    if (user && !debugInfo) {
      checkAuthDebugInfo();
    }
  }, [user, debugInfo]);

  return (
    <PageGuard>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>
        
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Auth Context Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">Loading: {loading ? "Yes" : "No"}</p>
                  <p className="font-semibold">Authenticated: {user ? "Yes" : "No"}</p>
                </div>
                
                {user && (
                  <div className="rounded-lg bg-slate-50 p-4">
                    <h3 className="font-semibold mb-2">User Information:</h3>
                    <ul className="space-y-1">
                      <li><strong>ID:</strong> {user.id}</li>
                      <li><strong>Name:</strong> {user.name}</li>
                      <li><strong>Email:</strong> {user.email}</li>
                      <li><strong>Role:</strong> {user.userRole}</li>
                    </ul>
                  </div>
                )}
                
                <div className="flex gap-4">
                  <Button onClick={refreshUser} disabled={loading}>
                    Refresh User
                  </Button>
                  
                  {user && (
                    <Button variant="destructive" onClick={logout}>
                      Logout
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={checkAuthDebugInfo} 
                disabled={loadingInfo}
                className="mb-4"
              >
                {loadingInfo ? "Loading..." : "Check Auth Status"}
              </Button>
              
              {debugInfo && (
                <div className="rounded-lg bg-slate-50 p-4 mt-4 overflow-auto max-h-[500px]">
                  <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              )}
              
              {testStatus === "error" && (
                <p className="text-red-500 mt-4">
                  Error checking auth status. 
                  Make sure the debug endpoint is enabled in the backend.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageGuard>
  );
}
