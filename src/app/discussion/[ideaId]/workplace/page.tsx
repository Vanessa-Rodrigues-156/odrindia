"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, Video, Calendar, CheckSquare, StickyNote, Maximize, Minimize, Settings } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useRouter, useParams } from "next/navigation"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { JitsiMeetContainer } from "@/components/workplace/JitsiMeetContainer"

import { NoteTaking } from "@/components/workplace/NoteTaking"

export default function WorkplacePage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const ideaId = params.ideaId as string;
  const [fullscreenMode, setFullscreenMode] = useState("");
  const [ideaDetails, setIdeaDetails] = useState<{ name: string; description: string } | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/signin");
    } else {
      // Fetch idea details from API
      fetch(`/api/ideas/${ideaId}`)
        .then(res => res.json())
        .then(data => setIdeaDetails(data))
        .catch(error => console.error("Failed to fetch idea details:", error));
    }
  }, [user, router, ideaId]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border p-8 text-center">
          <h2 className="mb-2 text-xl font-bold text-[#0a1e42]">Authentication Required</h2>
          <p className="mb-4 text-gray-600">Please sign in to access the workplace.</p>
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
