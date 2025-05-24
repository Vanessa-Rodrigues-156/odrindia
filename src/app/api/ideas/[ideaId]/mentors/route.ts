import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all mentors for an idea
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const { ideaId } = await params;
    
    // Verify idea exists
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId }
    });
    
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }
    
    // Get all mentors with their details
    const mentors = await prisma.ideaMentor.findMany({
      where: { ideaId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            userRole: true,
            institution: true,
            country: true,
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      mentors: mentors.map(m => ({
        userId: m.userId,
        assignedAt: m.assignedAt,
        ...m.user
      }))
    });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch mentors." 
    }, { status: 500 });
  }
}

// POST: Add a mentor to an idea
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const { ideaId } = await params;
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    // Verify idea exists
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId }
    });
    
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }
    
    // Check if user exists and is a MENTOR
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    if (user.userRole !== 'MENTOR' && user.userRole !== 'ADMIN') {
      return NextResponse.json({ 
        error: "User must have MENTOR role to be assigned as a mentor" 
      }, { status: 400 });
    }
    
    // Check if user is already a mentor
    const existingMentor = await prisma.ideaMentor.findUnique({
      where: {
        userId_ideaId: {
          userId,
          ideaId
        }
      }
    });
    
    if (existingMentor) {
      return NextResponse.json({ 
        error: "User is already a mentor for this idea" 
      }, { status: 409 });
    }
    
    // Add the mentor
    const mentor = await prisma.ideaMentor.create({
      data: {
        userId,
        ideaId
      }
    });
    
    return NextResponse.json({
      success: true,
      message: "Mentor assigned successfully",
      mentor
    });
  } catch (error) {
    console.error("Error assigning mentor:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to assign mentor." 
    }, { status: 500 });
  }
}

// DELETE: Remove a mentor from an idea
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const { ideaId } = await params;
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    // Delete the mentor association
    await prisma.ideaMentor.delete({
      where: {
        userId_ideaId: {
          userId,
          ideaId
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      message: "Mentor removed successfully"
    });
  } catch (error) {
    console.error("Error removing mentor:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to remove mentor. They may not be a mentor on this idea." 
    }, { status: 500 });
  }
}
