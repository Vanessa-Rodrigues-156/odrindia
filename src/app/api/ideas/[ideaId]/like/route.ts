import { NextResponse } from "next/server";

// In a real application, you would update a database
export async function POST(
  request: Request,
  { params }: { params: { ideaId: string } }
) {
  const ideaId = params.ideaId;
  const data = await request.json();
  const action = data.action; // 'like' or 'unlike'
  
  // Here you would update the like count in your database
  // For this mock, we just return a success message
  
  return NextResponse.json({ 
    success: true, 
    message: `Idea ${action === 'like' ? 'liked' : 'unliked'} successfully` 
  });
}
