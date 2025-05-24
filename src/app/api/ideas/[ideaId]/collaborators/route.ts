import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all collaborators for an idea
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
    
    // Get all collaborators with their details
    const collaborators = await prisma.ideaCollaborator.findMany({
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
      collaborators: collaborators.map(c => ({
        userId: c.userId,
        joinedAt: c.joinedAt,
        ...c.user
      }))
    });
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch collaborators." 
    }, { status: 500 });
  }
}

// POST: Add a collaborator to an idea
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
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Check if user is already a collaborator
    const existingCollaborator = await prisma.ideaCollaborator.findUnique({
      where: {
        userId_ideaId: {
          userId,
          ideaId
        }
      }
    });
    
    if (existingCollaborator) {
      return NextResponse.json({ 
        error: "User is already a collaborator for this idea" 
      }, { status: 409 });
    }
    
    // Add the collaborator
    const collaborator = await prisma.ideaCollaborator.create({
      data: {
        userId,
        ideaId
      }
    });
    
    return NextResponse.json({
      success: true,
      message: "Collaborator added successfully",
      collaborator
    });
  } catch (error) {
    console.error("Error adding collaborator:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to add collaborator." 
    }, { status: 500 });
  }
}

// DELETE: Remove a collaborator from an idea
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
    
    // Delete the collaborator
    await prisma.ideaCollaborator.delete({
      where: {
        userId_ideaId: {
          userId,
          ideaId
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      message: "Collaborator removed successfully"
    });
  } catch (error) {
    console.error("Error removing collaborator:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to remove collaborator. They may not be a collaborator on this idea." 
    }, { status: 500 });
  }
}
