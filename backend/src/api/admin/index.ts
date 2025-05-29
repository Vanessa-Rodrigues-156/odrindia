import { Router, Response, NextFunction } from "express";
import { authenticateJWT, AuthRequest } from "../../middleware/auth";
import prisma from "../../lib/prisma";
import usersRoutes from "./users";
import analyticsRoutes from "./analytics";
import approveIdeaRoutes from "./approve-idea";

const router = Router();
router.use(authenticateJWT);

// Middleware to check for ADMIN role
function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user?.userRole !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

// List all ideas pending approval
router.get("/ideas/pending", requireAdmin, async (req, res) => {
  const ideas = await prisma.idea.findMany({
    where: { approved: false },
    include: { owner: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(ideas);
});

// Approve an idea
router.post("/approve-idea", requireAdmin, async (req, res) => {
  const { ideaId } = req.body;
  if (!ideaId) return res.status(400).json({ error: "ideaId required" });
  await prisma.idea.update({ where: { id: ideaId }, data: { approved: true } });
  res.json({ success: true });
});

// Reject (delete) an idea
router.post("/reject-idea", requireAdmin, async (req, res) => {
  const { ideaId } = req.body;
  if (!ideaId) return res.status(400).json({ error: "ideaId required" });
  await prisma.idea.delete({ where: { id: ideaId } });
  res.json({ success: true });
});

router.use("/users", usersRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/approve-idea", approveIdeaRoutes);

export default router;
