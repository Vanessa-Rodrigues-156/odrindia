import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> } // Adjusted to handle Promise
) {
  const { ideaId } = await params; // Await the params to extract ideaId
  const data: { action: string } = await request.json();
  const action = data.action; // 'like' or 'unlike'
  console.log("Updating like status for idea ID:", ideaId, "Action:", action);

  // Fetch the idea
  const idea = await prisma.idea.findUnique({ where: { id: ideaId } });
  if (!idea) {
    return NextResponse.json({ error: "Idea not found" }, { status: 404 });
  }

  // Update likes
  let newLikes = idea.likes;
  if (action === "like") {
    newLikes = idea.likes + 1;
  } else if (action === "unlike" && idea.likes > 0) {
    newLikes = idea.likes - 1;
  }
  await prisma.idea.update({ where: { id: ideaId }, data: { likes: newLikes } });

  return NextResponse.json({ 
    success: true, 
    likes: newLikes,
    message: `Idea ${action === 'like' ? 'liked' : 'unliked'} successfully` 
  });
}
