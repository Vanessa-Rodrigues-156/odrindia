import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> } // Adjusted to handle Promise
) {
  const { ideaId } = await params; // Await the params to extract ideaId
  const data: { action: string } = await request.json();
  const action = data.action; // 'like' or 'unlike'
  console.log("Updating like status for idea ID:", ideaId, "Action:", action);

  // Log unused variable
  console.log("Unused variable:", request);

  return NextResponse.json({ 
    success: true, 
    message: `Idea ${action === 'like' ? 'liked' : 'unliked'} successfully` 
  });
}
