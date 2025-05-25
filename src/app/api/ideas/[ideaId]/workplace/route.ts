import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/ideas/[ideaId]/workplace
// Get workplace data for an idea
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
        description: true,
        workplaceData: true
      }
    });

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    return NextResponse.json(idea);
  } catch (error) {
    console.error("Error fetching workplace data:", error);
    return NextResponse.json({ error: "Failed to fetch workplace data" }, { status: 500 });
  }
}

// POST /api/ideas/[ideaId]/workplace
// Update workplace data for an idea
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const { ideaId } = await params;
    const { workplaceData } = await request.json();
    
    // Update idea with workplace data
    const updatedIdea = await prisma.idea.update({
      where: { id: ideaId },
      data: {
        workplaceData: workplaceData
      },
      select: {
        id: true,
        workplaceData: true
      }
    });
    
    return NextResponse.json(updatedIdea);
  } catch (error) {
    console.error("Error updating workplace data:", error);
    return NextResponse.json({ error: "Failed to update workplace data" }, { status: 500 });
  }
}
