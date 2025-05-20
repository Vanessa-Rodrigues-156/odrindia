import { NextRequest, NextResponse } from "next/server";
import { ideaSubmissionSchema } from "../../submit-idea/ideaSchema";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files");
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

    // Handle file uploads
    const filePaths: string[] = [];
    if (files && files.length > 0 && files[0] instanceof File) {
      const submissionId = uuidv4();
      const uploadDir = path.join(process.cwd(), "src/app/submit-idea/data", submissionId);
      await mkdir(uploadDir, { recursive: true });
      for (const file of files as File[]) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filePath = path.join(uploadDir, file.name);
        await writeFile(filePath, buffer);
        filePaths.push(`/src/app/submit-idea/data/${submissionId}/${file.name}`);
      }
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
        files: filePaths,
        consent: !!data.consent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
