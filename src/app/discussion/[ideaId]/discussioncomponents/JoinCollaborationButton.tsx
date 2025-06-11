"use client";

import { useState } from "react";
import { Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinCollaboration = async () => {
    if (!user) {
      toast.error("Please sign in to join as a collaborator.");
      return;
    }

    if (isOwner) {
      toast.error("You are already the owner of this idea.");
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

      toast.success("You have joined as a collaborator.");
      
      onJoined();
    } catch (error) {
      console.error("Error joining collaboration:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
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

      toast.success("You have left the collaboration.");
      
      onJoined();
    } catch (error) {
      console.error("Error leaving collaboration:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
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
