import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getJwtUser } from "@/lib/auth";

// GET /api/meetings/idea/[ideaId]
// Get all meetings for a specific idea
export async function GET(
  request: NextRequest,
  { params }: { params: { ideaId: string } }
) {
  try {
    const user = await getJwtUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const ideaId = params.ideaId;
    
    // Check if the user has access to the idea
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      select: {
        id: true,
        ownerId: true
      }
    });
    
    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }
    
    // Check if user is the idea owner, a collaborator, or a mentor
    const isIdeaOwner = idea.ownerId === user.id;
    
    if (!isIdeaOwner) {
      // Check if user is a collaborator
      const isCollaborator = await prisma.ideaCollaborator.findUnique({
        where: {
          userId_ideaId: {
            userId: user.id,
            ideaId
          }
        }
      });
      
      // Check if user is a mentor
      const isMentor = await prisma.ideaMentor.findUnique({
        where: {
          userId_ideaId: {
            userId: user.id,
            ideaId
          }
        }
      });
      
      if (!isCollaborator && !isMentor) {
        return NextResponse.json({ error: "Not authorized to view meetings for this idea" }, { status: 403 });
      }
    }
    
    // Get all meetings for the idea
    const meetings = await prisma.meetingLog.findMany({
      where: {
        ideaId
      },
      include: {
        createdBy: {
          select: {
            id: true, 
            name: true
          }
        },
        _count: {
          select: {
            participants: true,
            notes: true
          }
        }
      },
      orderBy: {
        startTime: 'desc'
      }
    });
    
    return NextResponse.json(meetings);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json({ error: "Failed to fetch meetings" }, { status: 500 });
  }
}
