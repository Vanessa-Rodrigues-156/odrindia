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
    include: { comments: true },
  });
  if (!idea) {
    notFound();
  }
  // Map DB idea to expected props for DiscussionClient
  const mappedIdea = {
    id: idea.id,
    name: idea.name,
    email: idea.email,
    country: idea.country,
    description: idea.description,
    submittedAt: idea.createdAt.toISOString(),
    likes: idea.likes,
  };
  // Map comments to expected structure (flat for now)
  const comments = idea.comments.map((c) => ({
    id: c.id,
    author: c.author,
    authorRole: c.authorRole,
    content: c.content,
    createdAt: c.createdAt.toISOString(),
    likes: c.likes,
    parentId: c.parentId,
    replies: [],
  }));
  return <DiscussionClient idea={mappedIdea} initialComments={comments} />;
}
