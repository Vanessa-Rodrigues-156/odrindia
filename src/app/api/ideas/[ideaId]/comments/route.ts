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
      user: {
        select: {
          id: true,
          name: true,
          userRole: true,
        }
      },
      replies: {
        orderBy: { createdAt: "asc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              userRole: true,
            }
          },
          likes: true, // Include likes for replies
        }
      },
      likes: true, // Include likes for main comments
    },
  });
  
  // Map comments to include like counts
  const commentsWithLikeCounts = comments.map(comment => ({
    ...comment,
    likeCount: comment.likes.length,
    replies: comment.replies.map(reply => ({
      ...reply,
      likeCount: reply.likes.length,
    }))
  }));
  
  return NextResponse.json(commentsWithLikeCounts);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  const { ideaId } = await params;
  const data: { content: string; userId: string; parentId?: string } = await request.json();

  if (!data.content || !data.userId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Create the comment or reply
  const comment = await prisma.comment.create({
    data: {
      content: data.content,
      userId: data.userId,
      ideaId,
      parentId: data.parentId || null,
    },
    include: {
      user: {
        select: {
          id: true, 
          name: true,
          userRole: true,
        }
      },
      likes: true,
    },
  });

  // Format response with like count
  const formattedComment = {
    ...comment,
    likeCount: 0, // New comment has 0 likes
  };

  return NextResponse.json(formattedComment, { status: 201 });
}
