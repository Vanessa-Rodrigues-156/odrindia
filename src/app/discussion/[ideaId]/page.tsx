import { Metadata } from "next";
import { Suspense } from "react";
import { apiFetch } from "@/lib/api";
import ClientDiscussionWrapper from "./ClientDiscussionWrapper";

// Full Next.js PageProps type with our specific params
type PageProps = {
 params: Promise<{ ideaId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Ensure ideaId is a string (it should already be based on our type)
  const { ideaId } = await params;  
  try {
    const res = await apiFetch(`/ideas/${ideaId}`, { method: "GET" });
    if (!res.ok) {
      return {
        title: "Idea Not Found",
        description: "The requested idea could not be found.",
      };
    }
    
    const idea = await res.json();
    return {
      title: `Discussion: ${idea.description.split(".")[0]}`,
      description: idea.description.substring(0, 160),
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Discussion",
      description: "View and discuss ideas",
    };
  }
}

// Server component - the main page
export default async function DiscussionPage({ params }: PageProps) {
  // Extract ideaId from params - we need to await it since it could be a Promise
  const { ideaId } = await params;
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading discussion...</p>
      </div>
    }>
      <ClientDiscussionWrapper ideaId={ideaId} />
    </Suspense>
  );
}
