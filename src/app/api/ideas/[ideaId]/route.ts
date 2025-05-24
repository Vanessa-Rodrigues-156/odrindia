import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const { ideaId } = await params;
    
    // Fetch the idea with related information
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
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
        },
        collaborators: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                userRole: true,
              }
            }
          }
        },
        mentors: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                userRole: true,
              }
            }
          }
        },
        likes: true,
        comments: {
          where: { parentId: null },
          take: 5, // Just get a few comments for preview
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    });

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }
    
    // Increment the view count
    await prisma.idea.update({
      where: { id: ideaId },
      data: { views: { increment: 1 } }
    });
    
    // Format the response
    const formattedIdea = {
      ...idea,
      likeCount: idea.likes.length,
      commentCount: idea.comments.length,
      collaborators: idea.collaborators.map(c => ({
        id: c.userId,
        name: c.user.name,
        email: c.user.email,
        userRole: c.user.userRole,
        joinedAt: c.joinedAt
      })),
      mentors: idea.mentors.map(m => ({
        id: m.userId,
        name: m.user.name,
        email: m.user.email,
        userRole: m.user.userRole,
        assignedAt: m.assignedAt
      })),
    };
    
    return NextResponse.json(formattedIdea);
  } catch (error) {
    console.error("Error fetching idea:", error);
    return NextResponse.json({ 
      error: "Failed to fetch idea" 
    }, { status: 500 });
  }
}

// PUT: Update an idea
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const { ideaId } = await params;
    const updateData = await request.json();
    
    // Only allow updating of certain fields
    const allowedFields = ['title', 'caption', 'description', 'priorOdrExperience'];
    const filteredData = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {} as Record<string, any>);
    
    // Update the idea
    const updatedIdea = await prisma.idea.update({
      where: { id: ideaId },
      data: filteredData
    });
    
    return NextResponse.json({
      success: true,
      message: "Idea updated successfully",
      idea: updatedIdea
    });
  } catch (error) {
    console.error("Error updating idea:", error);
    return NextResponse.json({ 
      error: "Failed to update idea" 
    }, { status: 500 });
  }
}

// DELETE: Delete an idea
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const { ideaId } = await params;
    
    // Delete the idea (cascading delete will handle related records)
    await prisma.idea.delete({
      where: { id: ideaId }
    });
    
    return NextResponse.json({
      success: true,
      message: "Idea deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting idea:", error);
    return NextResponse.json({ 
      error: "Failed to delete idea" 
    }, { status: 500 });
  }
}
