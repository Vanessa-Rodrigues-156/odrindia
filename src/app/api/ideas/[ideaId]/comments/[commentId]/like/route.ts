import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string; commentId: string }> }
) {
  // Now `ideaId` and `commentId` are directly available from the `params` object.
  const { ideaId, commentId } = await params;

  console.log(
    "Updating like status for ideaID:",
    ideaId,
    "and commentID:",
    commentId
  );

  try {
    const data = await request.json();
    const action = data.action; // 'like' or 'unlike'
    const userId = data.userId; // User who is liking/unliking
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Verify comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Check if user has already liked this comment
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: userId,
        commentId: commentId
      }
    });

    if (action === "like" && !existingLike) {
      // Create a new like
      await prisma.like.create({
        data: {
          userId: userId,
          commentId: commentId
        }
      });
    } else if (action === "unlike" && existingLike) {
      // Remove the like
      await prisma.like.delete({
        where: {
          id: existingLike.id
        }
      });
    }

    // Get the updated like count
    const likeCount = await prisma.like.count({
      where: {
        commentId: commentId
      }
    });

    return NextResponse.json({
      success: true,
      likes: likeCount,
      message: `Comment ${action === "like" ? "liked" : "unliked"} successfully`,
    });
  } catch (error) {
    console.error("Error liking/unliking comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
