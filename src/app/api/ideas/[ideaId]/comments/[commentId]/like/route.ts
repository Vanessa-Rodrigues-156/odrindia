import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string; commentId: string }> }
) {
  const { ideaId, commentId } = await params;

  try {
    const data = await request.json();
    const action = data.action; // 'like' or 'unlike'
    const userId = data.userId; // User who is liking/unliking

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Check if user has already liked this comment
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: userId,
        commentId: commentId
      }
    });

    if (action === "like" && !existingLike) {
      try {
        // Create a new like
        await prisma.like.create({
          data: {
            userId: userId,
            commentId: commentId
          }
        });
      } catch (e) {
        // Handle potential unique constraint violation due to race conditions
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
          // This is fine - the user already liked this comment (race condition)
          console.log("User already liked this comment (concurrent request)");
        } else {
          throw e; // Re-throw any other errors
        }
      }
    } else if (action === "unlike" && existingLike) {
      // Remove the like
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
    }

    // Get the updated like count
    const likeCount = await prisma.like.count({
      where: { commentId: commentId }
    });

    // Get user's current like status after operation
    const userLikeStatus = await prisma.like.findFirst({
      where: {
        userId: userId,
        commentId: commentId
      }
    });

    return NextResponse.json({
      success: true,
      likes: likeCount,
      hasLiked: !!userLikeStatus,
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
