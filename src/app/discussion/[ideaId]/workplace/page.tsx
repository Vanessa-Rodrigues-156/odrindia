"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Video, Calendar, CheckSquare, StickyNote, Maximize, Minimize, Settings, FileText, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useRouter, useParams } from "next/navigation"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { JitsiMeetContainer } from "@/components/workplace/JitsiMeetContainer"
import { MeetingLogs } from "@/components/workplace/MeetingLogs"
import { MeetingNotes } from "@/components/workplace/MeetingNotes"

import { NoteTaking } from "@/components/workplace/NoteTaking"

export default function WorkplacePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const ideaId = params.ideaId as string;
  const [fullscreenMode, setFullscreenMode] = useState("");
  const [ideaDetails, setIdeaDetails] = useState<{ name: string; description: string; ownerId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch idea details and check access permissions
  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      const currentPath = window.location.pathname;
      router.push(`/signin?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    
    // Fetch idea details from API
    setIsLoading(true);
    setError(null);
    
    fetch(`/api/ideas/${ideaId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 403) {
            throw new Error("You don't have permission to access this workspace");
          } else if (res.status === 404) {
            throw new Error("Idea not found");
          }
          throw new Error("Failed to fetch idea details");
        }
        return res.json();
      })
      .then(data => {
        setIdeaDetails(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch idea details:", error);
        setError(error.message || "Failed to load workspace");
        setIsLoading(false);
      });
  }, [user, loading, router, ideaId]);

  // Show loading state
  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa]">
        <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
          <div className="mb-4 flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
          <h2 className="mb-2 text-xl font-bold text-[#0a1e42]">Loading Workplace</h2>
          <p className="text-gray-600">Please wait while we prepare your workspace...</p>
        </div>
      </div>
    );
  }

  // Handle authentication redirect (middleware should handle this but adding as backup)
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa]">
        <div className="rounded-lg border p-8 text-center shadow-sm">
          <h2 className="mb-2 text-xl font-bold text-[#0a1e42]">Authentication Required</h2>
          <p className="mb-4 text-gray-600">Please sign in to access the workplace.</p>
          <Button onClick={() => router.push(`/signin?redirect=/discussion/${ideaId}/workplace`)}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Handle errors
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa]">
        <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <h2 className="mb-2 text-xl font-bold text-[#0a1e42]">Error</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => router.push(`/discussion/${ideaId}`)}>
              Back to Discussion
            </Button>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const toggleFullscreen = (section: string) => {
    setFullscreenMode(fullscreenMode === section ? "" : section);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa]">
      <header className="bg-[#0a1e42] py-4 text-white sticky top-0 z-10">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link href={`/discussion/${ideaId}`} className="mr-4 hover:text-gray-200 flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Discussion
            </Link>
            <h1 className="text-xl font-bold hidden md:block">
              {ideaDetails?.name || "Idea Workplace"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
              Welcome, {user.name}
            </span>
            <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/20 hover:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>
      
      {fullscreenMode ? (
        <div className="flex-1 p-4 flex flex-col">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toggleFullscreen("")}
            className="self-end mb-2"
          >
            <Minimize className="h-4 w-4 mr-2" /> Exit Fullscreen
          </Button>
          
          {fullscreenMode === "meeting" && (
            <div className="flex-1">
              <JitsiMeetContainer 
                roomName={`idea-${ideaId}`} 
                userName={user.name} 
                userEmail={user.email}
              />
            </div>
          )}
          
          {fullscreenMode === "notes" && (
            <div className="flex-1">
              <NoteTaking ideaId={ideaId} />
            </div>
          )}
          
          {fullscreenMode === "meetinglogs" && (
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow p-4 h-full">
                <h3 className="text-xl font-semibold text-[#0a1e42] mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Meeting Logs
                </h3>
                <MeetingLogs ideaId={ideaId} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#0a1e42] mb-2">{ideaDetails?.name || "Idea Workplace"}</h2>
            {ideaDetails?.description && (
              <p className="text-gray-600">{ideaDetails.description}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#0a1e42] flex items-center">
                    <Video className="h-5 w-5 mr-2" />
                    Video Meeting
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleFullscreen("meeting")}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
                <JitsiMeetContainer 
                  roomName={`idea-${ideaId}`} 
                  userName={user.name} 
                  userEmail={user.email}
                />
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 h-[500px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#0a1e42] flex items-center">
                    <StickyNote className="h-5 w-5 mr-2" />
                    Notes
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleFullscreen("notes")}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
                <div className="h-[calc(100%-40px)]">
                  <NoteTaking ideaId={ideaId} />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#0a1e42] flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Calendar
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleFullscreen("calendar")}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#0a1e42] flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Meeting Logs
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleFullscreen("meetinglogs")}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
                <MeetingLogs ideaId={ideaId} />
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4 h-[400px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#0a1e42] flex items-center">
                    <CheckSquare className="h-5 w-5 mr-2" />
                    Todo List
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleFullscreen("todo")}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
