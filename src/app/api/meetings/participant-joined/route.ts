import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getJwtUser } from "@/lib/auth-server";

// POST /api/meetings/participant-joined
// Record a participant joining a meeting
export async function POST(request: NextRequest) {
  try {
    const user = await getJwtUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomName, participantId, displayName, joinTime } = await request.json();
    
    // Find the meeting by room name
    const meeting = await prisma.meetingLog.findUnique({
      where: {
        jitsiRoomName: roomName
      }
    });
    
    if (!meeting) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }
    
    // Check if this participant already exists
    const existingParticipant = await prisma.meetingParticipant.findFirst({
      where: {
        meetingId: meeting.id,
        userId: user.id
      }
    });
    
    if (existingParticipant) {
      // Update the existing participant entry
      const updatedParticipant = await prisma.meetingParticipant.update({
        where: {
          id: existingParticipant.id
        },
        data: {
          joinTime: joinTime ? new Date(joinTime) : new Date()
        }
      });
      return NextResponse.json(updatedParticipant);
    }
    
    // Create a new participant entry
    const participant = await prisma.meetingParticipant.create({
      data: {
        meeting: { connect: { id: meeting.id } },
        user: { connect: { id: user.id } },
        joinTime: joinTime ? new Date(joinTime) : new Date(),
        isPresenter: meeting.createdById === user.id // Make creator the presenter
      }
    });
    
    return NextResponse.json(participant);
  } catch (error) {
    console.error("Error recording participant join:", error);
    return NextResponse.json({ error: "Failed to record participant join" }, { status: 500 });
  }
}
