import { NextResponse } from "next/server";

// Mock database for comments
// In production, you'd use a real database
const mockComments = {
  "idea-001": [
    {
      id: "comment-001",
      author: "Lisa Johnson",
      authorRole: "Legal Expert",
      content: "This is a fascinating idea! I think AI could really help with the initial assessment phase of disputes.",
      createdAt: "2023-11-16T10:40:00Z",
      likes: 15,
      parentId: null,
      replies: [
        {
          id: "comment-002",
          author: "David Chen",
          authorRole: "Tech Specialist",
          content: "I agree, but we need to ensure the AI recommendations are transparent and explainable.",
          createdAt: "2023-11-16T11:05:00Z",
          likes: 8,
          parentId: "comment-001"
        }
      ]
    },
    {
      id: "comment-004",
      author: "Maria Garcia",
      authorRole: "Judge",
      content: "I have concerns about how this would integrate with existing court systems. Would this be a complementary tool or replace certain functions?",
      createdAt: "2023-11-17T09:15:00Z",
      likes: 12,
      parentId: null,
      replies: []
    }
  ],
  "idea-002": []
};

export async function GET(
  request: Request,
  { params }: { params: { ideaId: string } }
) {
  const comments = mockComments[params.ideaId] || [];
  return NextResponse.json(comments);
}

export async function POST(
  request: Request,
  { params }: { params: { ideaId: string } }
) {
  const ideaId = params.ideaId;
  const data = await request.json();
  
  // Validate required fields
  if (!data.content || !data.author) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Create a new comment
  const newComment = {
    id: `comment-${Date.now()}`,
    author: data.author,
    authorRole: data.authorRole || "Community Member",
    content: data.content,
    createdAt: new Date().toISOString(),
    likes: 0,
    parentId: data.parentId || null,
    replies: []
  };
  
  // In a real application, you would save this to your database
  // For this mock example, we're just returning the comment
  
  return NextResponse.json(newComment, { status: 201 });
}
