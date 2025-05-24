import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ideaSubmissionSchema } from "../../submit-idea/ideaSchema";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    // Get the form data first
    const formData = await req.formData();
    
    // Extract userId from the form data
    const userId = formData.get("userId") as string;
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        message: "User ID is required. Please log in to submit ideas." 
      }, { status: 401 });
    }
    
    // Process the rest of the form data
    const data = {
      title: formData.get("title") as string | null,
      idea_caption: formData.get("idea_caption") as string | null || "",
      description: formData.get("description") as string | null,
      odr_experience: formData.get("odr_experience") as string | null,
      consent: String(formData.get("consent")) === "true",
    };

    // Use Zod schema for validation
    try {
      ideaSubmissionSchema.parse(data);
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

    // In the new schema, we directly create an Idea entry that starts as unapproved
    // Admin approval will change the approved flag later
    const newIdea = await prisma.idea.create({
      data: {
        title: data.title as string,
        caption: data.idea_caption as string,
        description: data.description as string,
        priorOdrExperience: data.odr_experience as string,
        approved: false,
        ownerId: userId, // Associate with the current user as owner
      },
    });

    return NextResponse.json({ 
      success: true,
      message: "Idea submitted successfully and awaiting approval",
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
