import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function signupHandler(req: Request, res: Response) {
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
    odrLabUsage,
  } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required." });
  }
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ error: "Email already in use." });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
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
      odrLabUsage: odrLabUsage || null,
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
  res.status(201).json({ user });
}
