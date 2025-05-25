import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all comments (with user info, like count, and parentId)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  const { ideaId } = await params;
  // Fetch all comments for the idea (including replies)
  const comments = await prisma.comment.findMany({
    where: { ideaId },
    orderBy: { createdAt: "asc" },
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

  // Map comments to include like counts and user info
  const mapped = comments.map(comment => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    parentId: comment.parentId, // replies will have non-null parentId
    likes: comment.likes.length,
    userId: comment.userId,
    author: comment.user?.name || "Anonymous",
    authorRole: comment.user?.userRole || "INNOVATOR",
    avatar: comment.user?.name ? comment.user.name.split(' ').map(p=>p[0]).join('').toUpperCase().substring(0,2) : "??",
    replies: [], // Initialize empty replies array for all comments
  }));

  // Build a map of comments by id for quicker lookup
  const commentMap = new Map<string, any>();
  mapped.forEach(comment => {
    commentMap.set(comment.id, comment);
  });

  // Create the tree structure by attaching replies to their parents
  const topLevelComments: any[] = [];
  
  // First pass: identify all top-level comments
  mapped.forEach(comment => {
    if (!comment.parentId) {
      // This is a top-level comment
      topLevelComments.push(comment);
    }
  });
  
  // Second pass: attach replies to their parent comments
  mapped.forEach(comment => {
    if (comment.parentId) {
      // This is a reply, add it to its parent's replies
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.replies.push(comment);
      } else {
        // If parent not found (which shouldn't happen with proper data),
        // treat as top-level comment
        console.warn(`Parent comment ${comment.parentId} not found for reply ${comment.id}`);
        topLevelComments.push(comment);
      }
    }
  });

  return NextResponse.json(topLevelComments);
}

// POST: Add a comment or reply
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  const { ideaId } = await params;
  const data: { content: string; userId: string; parentId?: string } = await request.json();

  if (!data.content || !data.userId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // If parentId is provided, ensure it's not null for replies
  const parentId = data.parentId ? data.parentId : null;

  // Create the comment or reply
  const comment = await prisma.comment.create({
    data: {
      content: data.content,
      userId: data.userId,
      ideaId,
      parentId: parentId,
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

  // Format response with like count and user info
  const formattedComment = {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    parentId: comment.parentId,
    likes: comment.likes.length,
    userId: comment.userId,
    author: comment.user?.name || "Anonymous",
    authorRole: comment.user?.userRole || "INNOVATOR",
    avatar: comment.user?.name ? comment.user.name.split(' ').map(p=>p[0]).join('').toUpperCase().substring(0,2) : "??",
    replies: [], // Include empty replies array for consistency with GET endpoint
  };

  return NextResponse.json(formattedComment, { status: 201 });
}
