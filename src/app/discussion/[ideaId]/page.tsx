import { Metadata } from "next";
import { notFound } from "next/navigation";
import DiscussionClient from "./DiscussionClient";
import { apiFetch } from "@/lib/api";
import type { Comment as CommentType, User } from "./components/types";

// Use proper typings for Next.js App Router
type PageProps = {
  params: { ideaId: string | string[] | undefined }; // Align ideaId type with SegmentParams
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Ensure ideaId is a string before using it, as it might be string[] or undefined
  const ideaId = Array.isArray(params.ideaId) ? params.ideaId[0] : params.ideaId;

  if (typeof ideaId !== 'string') {
    return {
      title: "Invalid Idea ID",
      description: "The idea ID is invalid.",
    };
  }
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
}

// Using the proper function signature for Next.js App Router pages
export default async function DiscussionPage(props: PageProps) {
  const { params } = props;
  // Ensure ideaId is a string before using it
  const ideaId = Array.isArray(params.ideaId) ? params.ideaId[0] : params.ideaId;

  if (typeof ideaId !== 'string') {
    notFound();
    return null; // Should be unreachable if notFound() works as expected
  }

  const res = await apiFetch(`/ideas/${ideaId}`, { method: "GET" });
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
  interface RawComment {
    id: string;
    content: string;
    createdAt: string;
    user: User;
    parentId?: string;
    likes?: Array<unknown>;
  }

  const commentMap = new Map<string, CommentType>();
  allComments.forEach((c: RawComment) => {
    commentMap.set(c.id, {
      id: c.id,
      content: c.content,
      createdAt: new Date(c.createdAt).toISOString(),
      user: c.user as User,
      parentId: c.parentId || null,
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
