import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { 
      name, 
      email, 
      password, 
      userRole, 
      contactNumber,
      city,
      country, 
      institution,
      highestEducation,
      odrLabUsage
    } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already in use." }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with new schema fields
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        userRole: userRole || "INNOVATOR",
        contactNumber: contactNumber || null,
        city: city || null,
        country: country || null,
        institution: institution || null,
        highestEducation: highestEducation || null,
        odrLabUsage: odrLabUsage || null
      },
      select: {
        id: true,
        name: true,
        email: true,
        userRole: true,
        contactNumber: true,
        city: true,
        country: true,
        institution: true,
        highestEducation: true,
        odrLabUsage: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}