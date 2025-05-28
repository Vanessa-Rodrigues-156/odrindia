import { Router } from "express";
import { authenticateJWT, AuthRequest } from "../../middleware/auth";
import prisma from "../../lib/prisma";

const router = Router();
router.use(authenticateJWT);

function requireAdmin(req: AuthRequest, res, next) {
  if (req.user?.userRole !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

// List all users (no password)
router.get("/", requireAdmin, async (req, res) => {
  const users = await prisma.user.findMany({
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
      updatedAt: true,
    },
  });
  res.json(users);
});

// Get user by id
router.get("/:id", requireAdmin, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
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
      updatedAt: true,
    },
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// Update user (role or info)
router.put("/:id", requireAdmin, async (req, res) => {
  const {
    name,
    userRole,
    contactNumber,
    city,
    country,
    institution,
    highestEducation,
    odrLabUsage,
  } = req.body;
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: {
      name,
      userRole,
      contactNumber,
      city,
      country,
      institution,
      highestEducation,
      odrLabUsage,
    },
  });
  res.json({ success: true, user });
});

// Delete user
router.delete("/:id", requireAdmin, async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
