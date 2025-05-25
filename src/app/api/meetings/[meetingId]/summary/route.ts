import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getJwtUser } from "@/lib/auth";

// POST /api/meetings/[meetingId]/summary
// Add or update the summary of a meeting
export async function POST(
  request: NextRequest,
  { params }: { params: { meetingId: string } }
) {
  try {
    const user = await getJwtUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const meetingId = params.meetingId;
    const { summary } = await request.json();
    
    // Check if the meeting exists
    const meeting = await prisma.meetingLog.findUnique({
      where: {
        id: meetingId
      },
      include: {
        idea: {
          select: {
            id: true,
            ownerId: true
          }
        }
      }
    });
    
    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    
    // Check if user is authorized to add a summary to this meeting
    // They should be either the idea owner, a collaborator, a mentor, the meeting creator, or a meeting presenter
    const isIdeaOwner = meeting.idea.ownerId === user.id;
    const isMeetingCreator = meeting.createdById === user.id;
    
    if (!isIdeaOwner && !isMeetingCreator) {
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
      
      // Check if user is a presenter
      const isPresenter = await prisma.meetingParticipant.findFirst({
        where: {
          meetingId,
          userId: user.id,
          isPresenter: true
        }
      });
      
      if (!isCollaborator && !isMentor && !isPresenter) {
        return NextResponse.json({ error: "Not authorized to add a summary to this meeting" }, { status: 403 });
      }
    }
    
    // Update the meeting with the summary
    const updatedMeeting = await prisma.meetingLog.update({
      where: {
        id: meetingId
      },
      data: {
        summary
      }
    });
    
    return NextResponse.json(updatedMeeting);
  } catch (error) {
    console.error("Error updating meeting summary:", error);
    return NextResponse.json({ error: "Failed to update meeting summary" }, { status: 500 });
  }
}
