import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

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

    // User info without sensitive data
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

    // Create session data object with extended expiration
    const sessionData = {
      user: userWithoutPassword,
      exp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      iat: new Date().toISOString(), // Issued at time
    };
    
    // In production, this should be a JWT signed with a secret
    // For now we're using base64 encoding for simplicity
    const encodedSession = Buffer.from(JSON.stringify(sessionData)).toString('base64');
    
    // Set the session cookie (HTTP-only for security)
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'odrindia_session',
      value: encodedSession,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Less strict for better UX while maintaining security
      maxAge: 60 * 60 * 24 * 7, // 7 days (in seconds)
      path: '/',
    });
    
    // Also set a non-httpOnly cookie for client-side auth state management
    // This is less secure but allows for reactivity in the UI
    cookieStore.set({
      name: 'currentUser',
      value: JSON.stringify(userWithoutPassword),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days (in seconds)
      path: '/',
    });
    
    // Return user data to client
    return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
