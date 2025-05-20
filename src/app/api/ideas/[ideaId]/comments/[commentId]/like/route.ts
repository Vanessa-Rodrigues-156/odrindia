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
    const data: { action: string } = await request.json();
    const action = data.action; // 'like' or 'unlike'

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    let newLikes = comment.likes;
    if (action === "like") {
      newLikes = comment.likes + 1;
    } else if (action === "unlike" && comment.likes > 0) {
      newLikes = comment.likes - 1;
    } else if (action === "unlike" && comment.likes <= 0) {
      newLikes = 0; // Prevent likes from going below 0
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { likes: newLikes },
    });

    return NextResponse.json({
      success: true,
      likes: updatedComment.likes,
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
