import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  const { ideaId } = await params;
  // Fetch all top-level comments for the idea
  const comments = await prisma.comment.findMany({
    where: { ideaId, parentId: null },
    orderBy: { createdAt: "asc" },
    include: {
      replies: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
  return NextResponse.json(comments);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  const { ideaId } = await params;
  const data: { content: string; author: string; authorRole?: string; parentId?: string } = await request.json();

  if (!data.content || !data.author) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Create the comment or reply
  const comment = await prisma.comment.create({
    data: {
      content: data.content,
      author: data.author,
      authorRole: data.authorRole || "Community Member",
      ideaId,
      parentId: data.parentId || null,
    },
    include: {
      replies: true,
    },
  });

  return NextResponse.json(comment, { status: 201 });
}
