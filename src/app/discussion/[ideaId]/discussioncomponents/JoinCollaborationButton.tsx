"use client";

import { useState } from "react";
import { Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { apiFetch } from "@/lib/api";
import { User } from "./types";

interface JoinCollaborationButtonProps {
  ideaId: string;
  user: User | null;
  isOwner: boolean;
  isCollaborator: boolean;
  onJoined: () => void;
}

export default function JoinCollaborationButton({
  ideaId,
  user,
  isOwner,
  isCollaborator,
  onJoined,
}: JoinCollaborationButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinCollaboration = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join as a collaborator.",
        variant: "destructive",
      });
      return;
    }

    if (isOwner) {
      toast({
        title: "Cannot Join",
        description: "You are already the owner of this idea.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiFetch(`/collaboration/${ideaId}/join-collaborator`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to join as collaborator");
      }

      toast({
        title: "Success!",
        description: "You have joined as a collaborator.",
        variant: "default",
      });
      
      onJoined();
    } catch (error) {
      console.error("Error joining collaboration:", error);
      toast({
        title: "Failed to Join",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeaveCollaboration = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await apiFetch(`/collaboration/${ideaId}/leave-collaborator`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to leave collaboration");
      }

      toast({
        title: "Left Collaboration",
        description: "You have left the collaboration.",
        variant: "default",
      });
      
      onJoined();
    } catch (error) {
      console.error("Error leaving collaboration:", error);
      toast({
        title: "Failed to Leave",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Button 
        variant="secondary"
        size="sm"
        disabled
        className="text-sm">
        <Users className="h-4 w-4 mr-1" />
        Sign in to Join
      </Button>
    );
  }

  if (isOwner) {
    return (
      <Button 
        variant="outline"
        size="sm" 
        disabled
        className="text-sm bg-gray-50 cursor-default">
        <Users className="h-4 w-4 mr-1" />
        You&apos;re the Owner
      </Button>
    );
  }

  if (isCollaborator) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={handleLeaveCollaboration}
        disabled={isLoading}
        className="text-sm">
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
        ) : (
          <Users className="h-4 w-4 mr-1" />
        )}
        Leave Collaboration
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleJoinCollaboration}
      disabled={isLoading}
      className="text-sm">
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
      ) : (
        <Users className="h-4 w-4 mr-1" />
      )}
      Join as Collaborator
    </Button>
  );
}
