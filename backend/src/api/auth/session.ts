import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth";

export default async function sessionHandler(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  // Only return user fields expected by frontend
  const user = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    userRole: req.user.userRole,
    contactNumber: req.user.contactNumber,
    city: req.user.city,
    country: req.user.country,
    institution: req.user.institution,
    highestEducation: req.user.highestEducation,
    odrLabUsage: req.user.odrLabUsage,
    createdAt: req.user.createdAt,
  };
  res.json({ user });
}
