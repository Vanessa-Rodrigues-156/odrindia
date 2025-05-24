import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all unapproved idea submissions
export async function GET() {
  const submissions = await prisma.ideaSubmission.findMany({
    where: { approved: false },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    }
  });
  return NextResponse.json(submissions);
}

// POST: Approve an idea submission and create an Idea
export async function POST(req: NextRequest) {
  try {
    const { submissionId } = await req.json();
    
    // Find the submission with a transaction to ensure data integrity
    const submission = await prisma.ideaSubmission.findUnique({ 
      where: { id: submissionId } 
    });
    
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }
    
    if (submission.approved) {
      return NextResponse.json({ error: "This idea has already been approved" }, { status: 400 });
    }
    
    // Use a transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Create Idea with proper data mapping from the submission
      const idea = await tx.idea.create({
        data: {
          title: submission.title,
          caption: submission.ideaCaption,
          description: submission.description,
          // Create the relationship to the user who submitted the idea
          userId: submission.userId,
          // Set approved status to true
          approved: true,
          // Create the relationship back to the submission
          submission: {
            connect: { id: submissionId }
          }
        },
      });
      
      // Update submission to mark as approved and link to the created Idea
      const updatedSubmission = await tx.ideaSubmission.update({
        where: { id: submissionId },
        data: { 
          approved: true,
          reviewedAt: new Date(),
          // Ideally would set reviewedBy to the current admin user ID
        },
      });
      
      return { idea, updatedSubmission };
    });
    
    return NextResponse.json({ 
      success: true,
      message: "Idea approved successfully and is now available on the ODR Labs page",
      idea: result.idea,
      submission: result.updatedSubmission
    });
  } catch (error) {
    console.error("Error approving idea:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to approve idea" 
      }, 
      { status: 500 }
    );
  }
}
