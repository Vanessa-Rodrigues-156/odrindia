import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ideaSubmissionSchema } from "../../submit-idea/ideaSchema";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    // Get user ID from auth token/cookie/session
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false, 
        message: "Authentication required" 
      }, { status: 401 });
    }
    
    // Extract token and verify (this is a simplified example)
    const token = authHeader.split(' ')[1];
    // In a real app, you would verify the JWT token here
    // For example: const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // For demonstration, let's assume we extracted the userId from the token
    // In a real app, this would come from JWT verification
    const userId = "user-id-from-token"; // Replace with actual JWT verification
    
    const formData = await req.formData();
    const data = {
      title: formData.get("title") as string | null,
      idea_caption: formData.get("idea_caption") as string | null || "",
      description: formData.get("description") as string | null,
      odr_experience: formData.get("odr_experience") as string | null,
      consent: String(formData.get("consent")) === "true",
    };

    // Use Zod schema for validation
    try {
      const validatedData = ideaSubmissionSchema.parse(data);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const errors = validationError.flatten();
        return NextResponse.json({ 
          success: false, 
          errors: errors.fieldErrors 
        }, { status: 400 });
      }
      throw validationError;
    }

    // Save to DB with user association
    const newIdea = await prisma.ideaSubmission.create({
      data: {
        title: data.title as string,
        ideaCaption: data.idea_caption as string,
        description: data.description as string,
        odrExperience: data.odr_experience as string,
        consent: data.consent,
        userId: userId, // Associate with the current user
        approved: false,
      },
    });

    return NextResponse.json({ 
      success: true,
      message: "Idea submitted successfully",
      ideaId: newIdea.id
    });
  } catch (error) {
    console.error("Error submitting idea:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to submit idea. Please try again later."
    }, { status: 500 });
  }
}
