import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function loginHandler(req: Request, res: Response) {
  try {
    console.log("Login request received");
    
    // Validate request body
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log("Login rejected: Missing email or password");
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }
    
    // Ensure email is a valid string
    if (typeof email !== "string" || typeof password !== "string") {
      console.error("Login error: invalid data types", { 
        emailType: typeof email,
        passwordProvided: !!password
      });
      return res.status(400).json({ error: "Invalid input format" });
    }
    
    console.log(`Login attempt for email: ${email}`);
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
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
    
    // User not found - return generic error
    if (!user) {
      console.log(`Login failed: User not found for email: ${email}`);
      return res.status(401).json({ error: "Invalid email or password." });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log(`Login failed: Invalid password for email: ${email}`);
      return res.status(401).json({ error: "Invalid email or password." });
    }
    
    // Remove password from user object
    const { password: _pw, ...userWithoutPassword } = user;
    
    // Format user data for response
    const userResponse = {
      id: userWithoutPassword.id,
      name: userWithoutPassword.name,
      email: userWithoutPassword.email,
      userRole: userWithoutPassword.userRole,
      contactNumber: userWithoutPassword.contactNumber,
      city: userWithoutPassword.city,
      country: userWithoutPassword.country,
      institution: userWithoutPassword.institution,
      highestEducation: userWithoutPassword.highestEducation,
      odrLabUsage: userWithoutPassword.odrLabUsage,
      createdAt: userWithoutPassword.createdAt,
    };
    
    // Create JWT token with user data
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        userRole: user.userRole 
      },
      process.env.JWT_SECRET as string,
      { 
        expiresIn: "7d",
        algorithm: "HS256"
      }
    );
    
    console.log(`Login successful for user: ${email} with role: ${user.userRole}`);
    
    // Return user data and token
    return res.status(200).json({ 
      user: userResponse, 
      token,
      message: "Login successful" 
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
