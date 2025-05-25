import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getJwtUser } from "@/lib/auth-server";

// POST /api/meetings/end-meeting
// End a meeting for all participants
export async function POST(request: NextRequest) {
  try {
    const user = await getJwtUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomName, endTime } = await request.json();
    
    // Validate required fields
    if (!roomName) {
      return NextResponse.json({ error: "Missing required field: roomName" }, { status: 400 });
    }
    
    // Find the meeting by room name
    const meeting = await prisma.meetingLog.findFirst({
      where: { jitsiRoomName: roomName },
      include: {
        idea: {
          select: {
            id: true,
            ownerId: true
          }
        },
        participants: {
          select: {
            userId: true,
            isPresenter: true
          }
        }
      }
    });
    
    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    
    // Check if user has permissions to end the meeting
    // Allow meeting creators, idea owners, and presenters to end the meeting
    const isCreator = meeting.createdById === user.id;
    const isIdeaOwner = meeting.idea.ownerId === user.id;
    const isPresenter = meeting.participants.some(p => p.userId === user.id && p.isPresenter);
    
    if (!isCreator && !isIdeaOwner && !isPresenter) {
      return NextResponse.json(
        { error: "You don't have permission to end this meeting" },
        { status: 403 }
      );
    }
    
    // Update the meeting status to COMPLETED
    const updatedMeeting = await prisma.meetingLog.update({
      where: { id: meeting.id },
      data: {
        status: "COMPLETED",
        endTime: new Date(endTime)
      }
    });
    
    // Update all active participants as left
    await prisma.meetingParticipant.updateMany({
      where: {
        meetingId: meeting.id,
        leaveTime: null
      },
      data: {
        leaveTime: new Date(endTime)
      }
    });
    
    return NextResponse.json({
      success: true,
      message: "Meeting ended successfully",
      meeting: {
        id: updatedMeeting.id,
        status: updatedMeeting.status,
        endTime: updatedMeeting.endTime
      }
    });
    
  } catch (error) {
    console.error("Error ending meeting:", error);
    return NextResponse.json({ error: "Failed to end meeting" }, { status: 500 });
  }
}
