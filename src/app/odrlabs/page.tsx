'use client';

import { Suspense, useEffect, useState } from "react";
import OdrLabsClient from "./OdrLabsClient";
import PageGuard from "@/components/guards/PageGuard";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function OdrLabsPage() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch("/api/odrlabs/ideas", {
          credentials: "include", // Important for including auth cookies
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Authentication issue - will be handled by PageGuard
            return;
          }
          throw new Error("Failed to fetch ideas");
        }

        const data = await response.json();
        setIdeas(data.ideas || []);
      } catch (err) {
        console.error("Error fetching ideas:", err);
        setError("Failed to load ideas. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  return (
    <PageGuard requireAuth={true}>
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
        </div>
      ) : error ? (
        <Alert variant="destructive" className="max-w-3xl mx-auto my-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <OdrLabsClient initialIdeas={ideas} />
      )}
    </PageGuard>
  );
}
