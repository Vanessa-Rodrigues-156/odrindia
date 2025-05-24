import { Metadata } from "next";
import { notFound } from "next/navigation";
import DiscussionClient from "./DiscussionClient";
import { prisma } from "@/lib/prisma";

// Update the prop type to match the Promise pattern
interface DiscussionPageProps {
  params: Promise<{ ideaId: string }>;
}

// Update generateMetadata to use await params
export async function generateMetadata({ params }: DiscussionPageProps): Promise<Metadata> {
  const { ideaId } = await params;
  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) {
    return {
      title: "Idea Not Found",
      description: "The requested idea could not be found.",
    };
  }
  return {
    title: `Discussion: ${idea.description.split(".")[0]}`,
    description: idea.description.substring(0, 160),
  };
}

// Update the page component to use await params
export default async function DiscussionPage({ params }: DiscussionPageProps) {
  const { ideaId } = await params;
  const idea = await prisma.idea.findUnique({
    where: { id: ideaId },
    include: {
      owner: true,
      likes: true,
    },
  });
  if (!idea) {
    notFound();
  }
  // Map DB idea to expected props for DiscussionClient
  const mappedIdea = {
    id: idea.id,
    name: idea.owner?.name || "Anonymous",
    email: idea.owner?.email || "anonymous@example.com",
    country: idea.owner?.country || "",
    description: idea.description,
    submittedAt: idea.createdAt.toISOString(),
    likes: idea.likes?.length || 0,
  };
  // Get all comments for this idea
  const allComments = await prisma.comment.findMany({
    where: { ideaId: idea.id },
    include: {
      user: true,
      likes: true,
    },
    orderBy: { createdAt: 'asc' }
  });

  // Build a map of comments by id
  type Comment = {
    id: string;
    author: string;
    authorEmail: string;
    authorCountry: string;
    authorRole: string;
    content: string;
    createdAt: string;
    likes: number;
    parentId: string | null;
    avatar: string;
    replies: Comment[];
  };
  function getInitials(name?: string | null) {
    if (!name) return "??";
    return name.split(' ').map(p => p[0]).join('').toUpperCase().substring(0, 2);
  }
  const commentMap = new Map<string, Comment>();
  allComments.forEach(c => {
    commentMap.set(c.id, {
      id: c.id,
      author: c.user?.name || "Anonymous",
      authorEmail: c.user?.email || "anonymous@example.com",
      authorCountry: c.user?.country || "",
      authorRole: c.user?.userRole || "INNOVATOR",
      content: c.content,
      createdAt: c.createdAt.toISOString(),
      likes: c.likes?.length || 0,
      parentId: c.parentId,
      avatar: getInitials(c.user?.name),
      replies: [],
    });
  });

  // Attach replies to their parent
  const topLevelComments: Comment[] = [];
  commentMap.forEach(comment => {
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies.push(comment);
      }
    } else {
      topLevelComments.push(comment);
    }
  });

  return <DiscussionClient idea={mappedIdea} initialComments={topLevelComments} />;
}
