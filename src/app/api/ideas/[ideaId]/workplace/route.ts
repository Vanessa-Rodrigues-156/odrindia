import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/ideas/[ideaId]/workplace
// Get idea details for the workplace page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const {ideaId} = await params;
    
    // Get idea details
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      select: {
        id: true,
        title: true, 
        description: true
      }
    });

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    return NextResponse.json(idea);
  } catch (error) {
    console.error("Error fetching idea details:", error);
    return NextResponse.json({ error: "Failed to fetch idea details" }, { status: 500 });
  }
}

// Note: POST endpoint removed as workplaceData is no longer stored
