import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function loginHandler(req: Request, res: Response) {
  try {
    console.log("LOGIN REQ.BODY", req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }
    // Defensive: ensure email is a string
    if (typeof email !== "string") {
      console.error("Login error: email is not a string", email);
      return res.status(400).json({ error: "Invalid email format" });
    }
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true, // Make sure to include this!
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
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    // Remove password from user object
    const { password: _pw, ...userWithoutPassword } = user;
    // Only return fields expected by frontend
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
    const token = jwt.sign(
      { id: user.id, email: user.email, userRole: user.userRole },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );
    res.json({ user: userResponse, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
