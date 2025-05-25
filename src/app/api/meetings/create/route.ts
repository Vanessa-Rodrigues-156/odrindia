import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getJwtUser } from "@/lib/auth";

// POST /api/meetings/create
// Create a new meeting
export async function POST(request: NextRequest) {
  try {
    const user = await getJwtUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, ideaId, startTime, jitsiRoomName } = await request.json();
    
    // Validate required fields
    if (!title || !ideaId || !startTime || !jitsiRoomName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    // Create the meeting
    const meeting = await prisma.meetingLog.create({
      data: {
        title,
        startTime: new Date(startTime),
        jitsiRoomName,
        status: "SCHEDULED",
        idea: { connect: { id: ideaId } },
        createdBy: { connect: { id: user.id } },
        // Add the creator as the first participant and presenter
        participants: {
          create: {
            user: { connect: { id: user.id } },
            isPresenter: true,
          }
        }
      },
      include: {
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
        }
      }
    });
    
    return NextResponse.json(meeting);
  } catch (error) {
    console.error("Error creating meeting:", error);
    return NextResponse.json({ error: "Failed to create meeting" }, { status: 500 });
  }
}
