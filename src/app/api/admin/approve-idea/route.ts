import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all unapproved idea submissions
export async function GET() {
  const submissions = await prisma.ideaSubmission.findMany({
    where: { approved: false },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(submissions);
}

// POST: Approve an idea submission and create an Idea
export async function POST(req: NextRequest) {
  const { submissionId } = await req.json();
  const submission = await prisma.ideaSubmission.findUnique({ where: { id: submissionId } });
  if (!submission) {
    return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  }
  if (submission.approved) {
    return NextResponse.json({ error: "Already approved" }, { status: 400 });
  }
  // Create Idea
  const idea = await prisma.idea.create({
    data: {
      name: submission.name,
      email: submission.email,
      country: submission.address, // Or use a country field if available
      description: submission.description,
    },
  });
  // Mark submission as approved and link to Idea
  await prisma.ideaSubmission.update({
    where: { id: submissionId },
    data: { approved: true, ideaId: idea.id },
  });
  return NextResponse.json({ success: true, idea });
}
