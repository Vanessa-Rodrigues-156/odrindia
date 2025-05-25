import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getJwtUser } from "@/lib/auth-server";

// GET /api/meetings/[meetingId]
// Get details of a specific meeting
export async function GET(
  request: NextRequest,
  { params }: { params: { meetingId: string } }
) {
  try {
    const user = await getJwtUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const meetingId = params.meetingId;
    
    const meeting = await prisma.meetingLog.findUnique({
      where: {
        id: meetingId
      },
      include: {
        idea: {
          select: {
            id: true,
            title: true,
            ownerId: true
          }
        },
        createdBy: {
          select: {
            id: true, 
            name: true,
            email: true
          }
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        notes: {
          include: {
            author: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });
    
    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    
    // Check if user is authorized to view this meeting
    // They should be either the idea owner, a collaborator, a mentor, or a meeting participant
    const isIdeaOwner = meeting.idea.ownerId === user.id;
    
    if (!isIdeaOwner) {
      // Check if user is a collaborator
      const isCollaborator = await prisma.ideaCollaborator.findUnique({
        where: {
          userId_ideaId: {
            userId: user.id,
            ideaId: meeting.idea.id
          }
        }
      });
      
      // Check if user is a mentor
      const isMentor = await prisma.ideaMentor.findUnique({
        where: {
          userId_ideaId: {
            userId: user.id,
            ideaId: meeting.idea.id
          }
        }
      });
      
      // Check if user is a participant
      const isParticipant = meeting.participants.some(p => p.user.id === user.id);
      
      if (!isCollaborator && !isMentor && !isParticipant) {
        return NextResponse.json({ error: "Not authorized to view this meeting" }, { status: 403 });
      }
    }
    
    return NextResponse.json(meeting);
  } catch (error) {
    console.error("Error fetching meeting:", error);
    return NextResponse.json({ error: "Failed to fetch meeting details" }, { status: 500 });
  }
}
