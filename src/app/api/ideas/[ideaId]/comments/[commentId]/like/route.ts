import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { ideaId: string; commentId: string } }
) {
  const { ideaId, commentId } = params;
  const data: { action: string } = await request.json();
  const action = data.action; // 'like' or 'unlike'

  // Fetch the comment
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  // Update likes
  let newLikes = comment.likes;
  if (action === "like") {
    newLikes = comment.likes + 1;
  } else if (action === "unlike" && comment.likes > 0) {
    newLikes = comment.likes - 1;
  }
  await prisma.comment.update({ where: { id: commentId }, data: { likes: newLikes } });

  return NextResponse.json({ 
    success: true, 
    likes: newLikes,
    message: `Comment ${action === 'like' ? 'liked' : 'unliked'} successfully` 
  });
}
