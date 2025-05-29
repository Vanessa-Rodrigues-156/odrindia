import { Metadata } from "next";
import { notFound } from "next/navigation";
import DiscussionClient from "./DiscussionClient";
import { apiFetch } from "@/lib/api";
import type { Comment as CommentType, User } from "./components/types";
// Update the prop type to match the Promise pattern
interface DiscussionPageProps {
  params: { ideaId: string };
}

// Update generateMetadata to use await params
export async function generateMetadata({ params }: DiscussionPageProps): Promise<Metadata> {
  const res = await apiFetch(`/ideas/${params.ideaId}`, { method: "GET" });
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
}

export default async function DiscussionPage({ params }: DiscussionPageProps) {
  const res = await apiFetch(`/ideas/${params.ideaId}`, { method: "GET" });
  if (!res.ok) {
    notFound();
  }
  const idea = await res.json();
  // Map DB idea to expected props for DiscussionClient
  const mappedIdea = {
    id: idea.id,
    title: idea.title,
    caption: idea.caption,
    description: idea.description,
    country: idea.owner?.country || "",
    owner: idea.owner,
    createdAt: new Date(idea.createdAt).toISOString(),
    likes: idea.likes?.length || 0,
    comments: [] as CommentType[], // will fill below
  };
  // Map comments to tree structure
  const allComments = idea.comments || [];
  // Build a map of comments by id

  const commentMap = new Map<string, CommentType>();
  allComments.forEach((c: any) => {
    commentMap.set(c.id, {
      id: c.id,
      content: c.content,
      createdAt: new Date(c.createdAt).toISOString(),
      user: c.user as User,
      parentId: c.parentId,
      replies: [] as CommentType[], // will be filled later
      likes: c.likes?.length || 0,
    });
  });
  // Attach replies to their parent
  const topLevelComments: CommentType[] = [];
  commentMap.forEach(comment => {
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        (parent.replies = parent.replies || []).push(comment);
      }
    } else {
      topLevelComments.push(comment);
    }
  });
  mappedIdea.comments = topLevelComments;
  return <DiscussionClient idea={mappedIdea} initialComments={topLevelComments} />;
}
