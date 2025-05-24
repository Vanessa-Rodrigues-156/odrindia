import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data = {
      title: formData.get("title"),
      idea_caption: formData.get("idea_caption"),
      description: formData.get("description"),
      odr_experience: formData.get("odr_experience"),
      consent: String(formData.get("consent")) === "true",
    };

    // Basic validation (add Zod if needed)
    if (!data.title || !data.description || !data.odr_experience || !data.consent) {
      return NextResponse.json({ error: "All required fields must be filled." }, { status: 400 });
    }

    // Save to DB (update your Prisma model accordingly)
    await prisma.ideaSubmission.create({
      data: {
        title: data.title as string,
        ideaCaption: data.idea_caption as string,
        description: data.description as string,
        odrExperience: data.odr_experience as string,
        consent: !!data.consent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
