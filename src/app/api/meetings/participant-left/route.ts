import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getJwtUser } from "@/lib/auth-server";

// POST /api/meetings/participant-left
// Record a participant leaving a meeting
export async function POST(request: NextRequest) {
  try {
    const user = await getJwtUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomName, participantId, leaveTime } = await request.json();
    
    // Find the meeting by room name
    const meeting = await prisma.meetingLog.findUnique({
      where: {
        jitsiRoomName: roomName
      }
    });
    
    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    
    // Find the participant
    const participant = await prisma.meetingParticipant.findFirst({
      where: {
        meetingId: meeting.id,
        userId: user.id
      }
    });
    
    if (!participant) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 });
    }
    
    // Update the participant's leave time
    const updatedParticipant = await prisma.meetingParticipant.update({
      where: {
        id: participant.id
      },
      data: {
        leaveTime: leaveTime ? new Date(leaveTime) : new Date()
      }
    });
    
    // Check if this was the last participant and update meeting status if needed
    const remainingParticipants = await prisma.meetingParticipant.findMany({
      where: {
        meetingId: meeting.id,
        leaveTime: null
      }
    });
    
    if (remainingParticipants.length === 0 && meeting.status === "IN_PROGRESS") {
      await prisma.meetingLog.update({
        where: {
          id: meeting.id
        },
        data: {
          status: "COMPLETED",
          endTime: new Date()
        }
      });
    }
    
    return NextResponse.json(updatedParticipant);
  } catch (error) {
    console.error("Error recording participant leave:", error);
    return NextResponse.json({ error: "Failed to record participant leave" }, { status: 500 });
  }
}
