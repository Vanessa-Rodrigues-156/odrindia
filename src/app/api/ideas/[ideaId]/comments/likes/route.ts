import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  const { ideaId } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Get all comments for this idea
    const comments = await prisma.comment.findMany({
      where: { ideaId },
      select: { id: true }
    });

    const commentIds = comments.map(comment => comment.id);

    // Find likes where userId matches and commentId is in the list of comments
    const likes = await prisma.like.findMany({
      where: {
        userId: userId,
        commentId: { in: commentIds }
      },
      select: {
        commentId: true
      }
    });

    // Extract the comment IDs that user has liked
    const likedComments = likes.map(like => like.commentId);

    return NextResponse.json({ likedComments });
  } catch (error) {
    console.error("Error checking comment like status:", error);
    return NextResponse.json(
      { error: "Failed to check comment like status" },
      { status: 500 }
    );
  }
}
