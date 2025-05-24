import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Parse query params
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const approved = url.searchParams.get('approved') === 'true';
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Build the where clause
    let where = {
      approved: true, // By default, only show approved ideas
    } as any;
    
    // If search query is provided
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { caption: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // If approved param is explicitly set to false, show unapproved ideas (for admin)
    if (approved === false) {
      where.approved = false;
    }
    
    // Fetch ideas
    const ideas = await prisma.idea.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            institution: true,
          }
        },
        likes: true,
        comments: {
          select: {
            id: true,
          }
        }
      }
    });
    
    // Get total count for pagination
    const totalIdeas = await prisma.idea.count({ where });
    
    // Format the response
    const formattedIdeas = ideas.map(idea => ({
      id: idea.id,
      title: idea.title,
      caption: idea.caption,
      description: idea.description,
      createdAt: idea.createdAt,
      updatedAt: idea.updatedAt,
      views: idea.views,
      likeCount: idea.likes.length,
      commentCount: idea.comments.length,
      owner: {
        id: idea.owner.id,
        name: idea.owner.name,
        institution: idea.owner.institution,
      }
    }));
    
    return NextResponse.json({
      ideas: formattedIdeas,
      pagination: {
        page,
        limit,
        total: totalIdeas,
        totalPages: Math.ceil(totalIdeas / limit),
        hasMore: skip + ideas.length < totalIdeas
      }
    });
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return NextResponse.json({ 
      error: "Failed to fetch ideas" 
    }, { status: 500 });
  }
}
