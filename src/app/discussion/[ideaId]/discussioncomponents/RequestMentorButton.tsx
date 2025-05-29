"use client";

import { useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { apiFetch } from "@/lib/api";
import { User } from "./types";

interface RequestMentorButtonProps {
  ideaId: string;
  user: User | null;
  isOwner: boolean;
  isMentor: boolean;
  onRequested: () => void;
}

export default function RequestMentorButton({
  ideaId,
  user,
  isOwner,
  isMentor,
  onRequested,
}: RequestMentorButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestMentor = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to request to be a mentor.",
        variant: "destructive",
      });
      return;
    }

    if (user.userRole !== "MENTOR") {
      toast({
        title: "Permission Denied",
        description: "Only users with MENTOR role can become mentors.",
        variant: "destructive",
      });
      return;
    }

    if (isOwner) {
      toast({
        title: "Cannot Mentor",
        description: "You are already the owner of this idea.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiFetch(`/collaboration/${ideaId}/request-mentor`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to request mentor role");
      }

      toast({
        title: "Success!",
        description: "You are now a mentor for this idea.",
        variant: "default",
      });
      
      onRequested();
    } catch (error) {
      console.error("Error requesting mentor role:", error);
      toast({
        title: "Request Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveMentorship = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await apiFetch(`/collaboration/${ideaId}/leave-mentor`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to leave mentorship");
      }

      toast({
        title: "Left Mentorship",
        description: "You have left the mentorship role.",
        variant: "default",
      });
      
      onRequested();
    } catch (error) {
      console.error("Error leaving mentorship:", error);
      toast({
        title: "Failed to Leave",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If not signed in
  if (!user) {
    return (
      <Button 
        variant="outline"
        size="sm"
        disabled
        className="text-sm">
        <BookOpen className="h-4 w-4 mr-1" />
        Sign in to Mentor
      </Button>
    );
  }

  // If user is owner
  if (isOwner) {
    return (
      <Button 
        variant="outline"
        size="sm" 
        disabled
        className="text-sm bg-gray-50 cursor-default">
        <BookOpen className="h-4 w-4 mr-1" />
        You&apos;re the Owner
      </Button>
    );
  }

  // If not a mentor role
  if (user.userRole !== "MENTOR") {
    return (
      <Button 
        variant="outline"
        size="sm" 
        disabled
        className="text-sm bg-gray-50 cursor-default">
        <BookOpen className="h-4 w-4 mr-1" />
        Mentor Role Required
      </Button>
    );
  }

  // If already a mentor
  if (isMentor) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleLeaveMentorship}
        disabled={isLoading}
        className="text-sm border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800">
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
        ) : (
          <BookOpen className="h-4 w-4 mr-1" />
        )}
        Leave Mentorship
      </Button>
    );
  }

  // Default: Can request to be a mentor
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRequestMentor}
      disabled={isLoading}
      className="text-sm">
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
      ) : (
        <BookOpen className="h-4 w-4 mr-1" />
      )}
      Become a Mentor
    </Button>
  );
}
