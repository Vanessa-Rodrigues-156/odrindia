import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getJwtUser } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getJwtUser(request);
    
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    // Fetch only approved ideas from the database
    const ideasFromDb = await prisma.idea.findMany({
      where: {
        approved: true
      },
      orderBy: { createdAt: "desc" },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            country: true,
            institution: true,
          }
        },
        comments: true,
        likes: true
      }
    });
    
    // Map DB results to match OdrLabsClient expected props
    const ideas = ideasFromDb.map((idea) => ({
      id: idea.id,
      name: idea.owner.name,
      email: idea.owner.email,
      country: idea.owner.country || "India", // Default to India if no country specified
      title: idea.title,
      caption: idea.caption || "",
      description: idea.description,
      submittedAt: idea.createdAt.toISOString(),
      likes: idea.likes.length,
      commentCount: idea.comments.length,
    }));
    
    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("Error fetching ODR Labs ideas:", error);
    return NextResponse.json({ 
      error: "Failed to fetch ideas" 
    }, { status: 500 });
  }
}
