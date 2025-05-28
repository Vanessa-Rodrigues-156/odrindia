import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function loginHandler(req: Request, res: Response) {
  try {
    const { email, password: inputPassword } = req.body;
    if (!email || !inputPassword) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const isValid = await bcrypt.compare(inputPassword, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const { password: userPassword, ...userWithoutPassword } = user;
    const token = jwt.sign(
      userWithoutPassword,
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );
    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
