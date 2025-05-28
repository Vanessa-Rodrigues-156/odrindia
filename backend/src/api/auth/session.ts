import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth";

export default async function sessionHandler(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json({ user: req.user });
}
