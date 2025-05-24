import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const { ideaId } = await params;
    const { userId, action } = await request.json(); // action: 'like' or 'unlike'
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Fetch the idea
    const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    // Check if user has already liked this idea
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: userId,
        ideaId: ideaId
      }
    });

    if (action === "like" && !existingLike) {
      // Create a new like
      await prisma.like.create({
        data: {
          userId: userId,
          ideaId: ideaId
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
        ideaId: ideaId
      }
    });

    return NextResponse.json({ 
      success: true, 
      likes: likeCount,
      message: `Idea ${action === 'like' ? 'liked' : 'unliked'} successfully` 
    });
  } catch (error) {
    console.error("Error handling like:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to process like action. Please try again later."
    }, { status: 500 });
  }
}
