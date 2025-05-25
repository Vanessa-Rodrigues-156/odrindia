import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getJwtUser } from "@/lib/auth-server";

// POST /api/meetings/[meetingId]/notes
// Add a note to a meeting
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
    const { content } = await request.json();
    
    if (!content) {
      return NextResponse.json({ error: "Note content is required" }, { status: 400 });
    }
    
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
    
    // Check if user is authorized to add notes to this meeting
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
      const isParticipant = await prisma.meetingParticipant.findFirst({
        where: {
          meetingId,
          userId: user.id
        }
      });
      
      if (!isCollaborator && !isMentor && !isParticipant) {
        return NextResponse.json({ error: "Not authorized to add notes to this meeting" }, { status: 403 });
      }
    }
    
    // Create the note
    const note = await prisma.meetingNote.create({
      data: {
        content,
        meeting: { connect: { id: meetingId } },
        author: { connect: { id: user.id } },
        lastEditedBy: { connect: { id: user.id } }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    return NextResponse.json(note);
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}

// GET /api/meetings/[meetingId]/notes
// Get all notes for a meeting
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
    
    // Check if user is authorized to view notes for this meeting
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
      const isParticipant = await prisma.meetingParticipant.findFirst({
        where: {
          meetingId,
          userId: user.id
        }
      });
      
      if (!isCollaborator && !isMentor && !isParticipant) {
        return NextResponse.json({ error: "Not authorized to view notes for this meeting" }, { status: 403 });
      }
    }
    
    // Get all notes for the meeting
    const notes = await prisma.meetingNote.findMany({
      where: {
        meetingId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        lastEditedBy: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}
