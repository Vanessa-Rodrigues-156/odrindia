import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string; commentId: string }> }
) {
  const { commentId } = await params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Check if user has liked this comment
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: userId,
        commentId: commentId
      }
    });

    // Get the total likes for this comment
    const likeCount = await prisma.like.count({
      where: { commentId: commentId }
    });

    return NextResponse.json({
      hasLiked: !!existingLike,
      likes: likeCount
    });
  } catch (error) {
    console.error("Error checking like status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
