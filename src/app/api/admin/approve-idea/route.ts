import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all unapproved ideas
export async function GET() {
  const unapprovedIdeas = await prisma.idea.findMany({
    where: { approved: false },
    orderBy: { createdAt: "desc" },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          country: true,
          institution: true,
          userRole: true,
        }
      }
    }
  });
  
  return NextResponse.json(unapprovedIdeas);
}

// POST: Approve an idea
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Support both ideaId and submissionId parameters for backward compatibility
    const ideaId = body.ideaId || body.submissionId;
    const reviewerId = body.reviewerId;
    
    if (!ideaId) {
      return NextResponse.json({ error: "Idea ID is required" }, { status: 400 });
    }
    
    // Find the idea
    const idea = await prisma.idea.findUnique({ 
      where: { id: ideaId } 
    });
    
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }
    
    if (idea.approved) {
      return NextResponse.json({ error: "This idea has already been approved" }, { status: 400 });
    }
    
    // Approve the idea
    const updatedIdea = await prisma.idea.update({
      where: { id: ideaId },
      data: {
        approved: true,
        reviewedAt: new Date(),
        reviewedBy: reviewerId || null,
      }
    });

    return NextResponse.json({
      success: true,
      message: "Idea approved successfully",
      idea: updatedIdea
    });
    
  } catch (error) {
    console.error("Error approving idea:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to approve idea. Please try again later."
    }, { status: 500 });
  }
}
