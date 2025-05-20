import { NextRequest, NextResponse } from "next/server";
import { ideaSubmissionSchema } from "../../submit-idea/ideaSchema";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      role: formData.get("role"),
      course: formData.get("course"),
      institution: formData.get("institution"),
      idea_caption: formData.get("idea_caption"),
      description: formData.get("description"),
      consent: String(formData.get("consent")) === "true",
    };

    // Validate with Zod
    const parsed = ideaSubmissionSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ errors: parsed.error.flatten() }, { status: 400 });
    }

    // Save to DB
    await prisma.ideaSubmission.create({
      data: {
        name: data.name as string,
        email: data.email as string,
        phone: data.phone as string,
        address: data.address as string,
        role: data.role as string,
        course: data.course as string,
        institution: data.institution as string,
        ideaCaption: data.idea_caption as string,
        description: data.description as string,
        consent: !!data.consent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
