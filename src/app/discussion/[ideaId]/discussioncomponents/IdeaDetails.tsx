"use client";
import { ThumbsUp, User as UserIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Idea, User } from "./types";
import JoinCollaborationButton from "./JoinCollaborationButton";
import RequestMentorButton from "./RequestMentorButton";

interface IdeaDetailsProps {
  idea: Idea;
  user: User | null;
  hasLiked: boolean;
  ideaLikes: number;
  onLikeIdea: () => Promise<void>;
  onCollaborationUpdated: () => void;
}

export default function IdeaDetails({
  idea,
  user,
  hasLiked,
  ideaLikes,
  onLikeIdea,
  onCollaborationUpdated,
}: IdeaDetailsProps) {
  // Check if current user is owner, collaborator or mentor
  const isOwner = user ? user.id === idea.owner.id : false;
  const isCollaborator = user ? idea.collaborators.some((c) => c.userId === user.id) : false;
  const isMentor = user ? idea.mentors.some((m) => m.userId === user.id) : false;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-[#0a1e42]">Idea Details</CardTitle>
            {user ? (
              <Button
                variant={hasLiked ? "default" : "outline"}
                size="sm"
                onClick={onLikeIdea}
                className={hasLiked ? "bg-[#0a1e42] hover:bg-[#263e69]" : ""}>
                <ThumbsUp className="mr-2 h-4 w-4" />
                {ideaLikes}
              </Button>
            ) : (
              <div className="flex items-center text-sm text-gray-500">
                <ThumbsUp className="mr-2 h-4 w-4" />
                <span>{ideaLikes}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p>{idea.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/discussion/${idea.id}/workplace`}>
                <Button className="bg-[#0a1e42] hover:bg-[#263e69]">
                  Join Idea Workplace Meeting
                </Button>
              </Link>

              <div className="flex items-center gap-2">
                <JoinCollaborationButton
                  ideaId={idea.id}
                  user={user}
                  isOwner={isOwner}
                  isCollaborator={isCollaborator}
                  onJoined={onCollaborationUpdated}
                />

                <RequestMentorButton
                  ideaId={idea.id}
                  user={user}
                  isOwner={isOwner}
                  isMentor={isMentor}
                  onRequested={onCollaborationUpdated}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ...existing team card and tabs... */}
    </div>
  );
}
