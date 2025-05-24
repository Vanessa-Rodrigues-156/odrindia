import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // For NextAuth credentials, return user info (without password)
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      userRole: user.userRole,
      contactNumber: user.contactNumber,
      city: user.city,
      country: user.country,
      institution: user.institution,
      highestEducation: user.highestEducation,
      odrLabUsage: user.odrLabUsage,
      createdAt: user.createdAt,
    };
    
    return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
