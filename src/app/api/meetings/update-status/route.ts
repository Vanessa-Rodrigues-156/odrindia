import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getJwtUser } from "@/lib/auth-server";

// POST /api/meetings/update-status
// Update the status of a meeting (start, end, etc.)
export async function POST(request: NextRequest) {
  try {
    const user = await getJwtUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomName, status, startTime, endTime } = await request.json();
    
    // Find the meeting by room name
    const meeting = await prisma.meetingLog.findUnique({
      where: {
        jitsiRoomName: roomName
      }
    });
    
    if (!meeting) {
      // If the meeting doesn't exist yet, create a default one
      // This handles the case where a meeting is started directly without being scheduled
      const ideaId = roomName.replace('idea-', '');
      
      // Check if the idea exists
      const idea = await prisma.idea.findUnique({
        where: { id: ideaId }
      });
      
      if (!idea) {
        return NextResponse.json({ error: "Invalid room name or idea not found" }, { status: 400 });
      }
      
      // Create a new meeting
      const newMeeting = await prisma.meetingLog.create({
        data: {
          title: `Meeting for ${idea.title}`,
          jitsiRoomName: roomName,
          startTime: startTime ? new Date(startTime) : new Date(),
          status: status || "IN_PROGRESS",
          idea: { connect: { id: ideaId } },
          createdBy: { connect: { id: user.id } },
          participants: {
            create: {
              user: { connect: { id: user.id } },
              isPresenter: true,
              joinTime: new Date()
            }
          }
        }
      });
      
      return NextResponse.json(newMeeting);
    }
    
    // Update the meeting status
    const updateData: any = {
      status: status
    };
    
    if (startTime) {
      updateData.startTime = new Date(startTime);
    }
    
    if (endTime) {
      updateData.endTime = new Date(endTime);
    }
    
    // If status is COMPLETED and no endTime was provided, set it to now
    if (status === "COMPLETED" && !endTime) {
      updateData.endTime = new Date();
    }
    
    const updatedMeeting = await prisma.meetingLog.update({
      where: {
        id: meeting.id
      },
      data: updateData
    });
    
    return NextResponse.json(updatedMeeting);
  } catch (error) {
    console.error("Error updating meeting status:", error);
    return NextResponse.json({ error: "Failed to update meeting status" }, { status: 500 });
  }
}
