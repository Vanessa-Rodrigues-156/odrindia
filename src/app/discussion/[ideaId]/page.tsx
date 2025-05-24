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
  
  // Separate top-level comments and build a replies map
  const topLevelComments = allComments.filter(c => !c.parentId);
  const repliesMap = new Map();
  
  allComments.filter(c => c.parentId).forEach(reply => {
    if (!repliesMap.has(reply.parentId)) {
      repliesMap.set(reply.parentId, []);
    }
    repliesMap.get(reply.parentId).push({
      id: reply.id,
      author: reply.user?.name || "Anonymous",
      authorEmail: reply.user?.email || "anonymous@example.com",
      authorCountry: reply.user?.country || "",
      authorRole: reply.user?.userRole || "INNOVATOR",
      content: reply.content,
      createdAt: reply.createdAt.toISOString(),
      likes: reply.likes?.length || 0,
      parentId: reply.parentId,
    });
  });
  
  // Map top-level comments to expected structure with their replies
  const comments = topLevelComments.map((c) => ({
    id: c.id,
    author: c.user?.name || "Anonymous",
    authorEmail: c.user?.email || "anonymous@example.com",
    authorCountry: c.user?.country || "",
    authorRole: c.user?.userRole || "INNOVATOR", // Default to INNOVATOR role
    content: c.content,
    createdAt: c.createdAt.toISOString(),
    likes: c.likes?.length || 0,
    parentId: c.parentId,
    replies: repliesMap.get(c.id) || [],
  }));
  return <DiscussionClient idea={mappedIdea} initialComments={comments} />;
}
