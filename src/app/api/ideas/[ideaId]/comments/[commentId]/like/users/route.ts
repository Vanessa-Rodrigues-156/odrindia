import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string; commentId: string }> }
) {
  const { commentId } = await params;

  try {
    // Get all likes for this comment with user information
    const likes = await prisma.like.findMany({
      where: { commentId: commentId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      likeCount: likes.length,
      likes: likes.map(like => ({
        id: like.id,
        userId: like.userId,
        userName: like.user.name,
        likedAt: like.createdAt
      }))
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
