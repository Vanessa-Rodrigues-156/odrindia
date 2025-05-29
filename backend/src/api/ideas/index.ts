import { Router, Request, Response } from "express";
import prisma from "../../lib/prisma";
import { authenticateJWT, AuthRequest } from "../../middleware/auth";

const router = Router();
router.use(authenticateJWT);

// List all ideas (with owner, collaborators, mentors, comments, likes)
router.get("/", async (req, res) => {
  const ideas = await prisma.idea.findMany({
    include: {
      owner: true,
      collaborators: { include: { user: true } },
      mentors: { include: { user: true } },
      comments: true,
      likes: true,
      meetings: true,
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(ideas);
});

// Create a new idea (from submission form)
router.post("/", async (req: AuthRequest, res) => {
  const { title, caption, description, priorOdrExperience } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required." });
  }

  try {
    const idea = await prisma.idea.create({
      data: {
        title,
        caption: caption || null,
        description,
        priorOdrExperience: priorOdrExperience || null,
        ownerId: req.user.id,
      },
      include: {
        owner: true,
        collaborators: true,
        mentors: true,
        comments: true,
        likes: true,
      },
    });
    res.status(201).json(idea);
  } catch (err) {
    res.status(500).json({ error: "Failed to create idea." });
  }
});

// Get all approved ideas (for ODR Lab page)
router.get("/approved", async (req: Request, res: Response) => {
  try {
    const ideas = await prisma.idea.findMany({
      where: { approved: true },
      include: {
        owner: true,
        likes: true,
        comments: true,
      },
      orderBy: { createdAt: "desc" },
    });
    // Map to frontend format
    const mapped = ideas.map(idea => ({
      id: idea.id,
      name: idea.owner?.name || "Anonymous",
      email: idea.owner?.email || "anonymous@example.com",
      country: idea.owner?.country || "",
      title: idea.title,
      caption: idea.caption,
      description: idea.description,
      submittedAt: idea.createdAt.toISOString(),
      likes: idea.likes?.length || 0,
      commentCount: idea.comments?.length || 0,
    }));
    res.json(mapped);
  } catch (err) {
    console.error("[Ideas] Error fetching approved ideas:", err);
    res.status(500).json({ error: "Failed to fetch ideas" });
  }
});

// Get idea details (for discussion board, must be approved)
router.get(
  "/:id",
  authenticateJWT,
  async (req: AuthRequest, res: Response) => {
    try {
      const idea = await prisma.idea.findUnique({
        where: { id: req.params.id, approved: true },
        include: {
          owner: true,
          likes: true,
          comments: {
            include: {
              user: true,
              likes: true,
            },
            orderBy: { createdAt: "asc" },
          },
        },
      });
      if (!idea)
        return res
          .status(404)
          .json({ error: "Idea not found or not approved" });
      // Map comments to tree structure if needed (frontend can also do this)
      res.json(idea);
    } catch (err) {
      console.error("[Ideas] Error fetching idea details:", err);
      res.status(500).json({ error: "Failed to fetch idea details" });
    }
  }
);

// Update idea (owner only)
router.put("/:id", async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { title, caption, description, priorOdrExperience } = req.body;
  const idea = await prisma.idea.findUnique({ where: { id } });
  if (!idea) return res.status(404).json({ error: "Idea not found" });
  if (idea.ownerId !== req.user.id && req.user.userRole !== "ADMIN") {
    return res.status(403).json({ error: "Not authorized" });
  }
  const updated = await prisma.idea.update({
    where: { id },
    data: { title, caption, description, priorOdrExperience },
  });
  res.json(updated);
});

// Delete idea (owner or admin)
router.delete("/:id", async (req: AuthRequest, res) => {
  const { id } = req.params;
  const idea = await prisma.idea.findUnique({ where: { id } });
  if (!idea) return res.status(404).json({ error: "Idea not found" });
  if (idea.ownerId !== req.user.id && req.user.userRole !== "ADMIN") {
    return res.status(403).json({ error: "Not authorized" });
  }
  await prisma.idea.delete({ where: { id } });
  res.json({ success: true });
});

// List collaborators
router.get("/:id/collaborators", async (req, res) => {
  const { id } = req.params;
  const collaborators = await prisma.ideaCollaborator.findMany({
    where: { ideaId: id },
    include: { user: true },
  });
  res.json(collaborators);
});

// Add collaborator
router.post("/:id/collaborators", async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "userId required" });
  const collab = await prisma.ideaCollaborator.create({
    data: { ideaId: id, userId },
  });
  res.status(201).json(collab);
});

// List mentors
router.get("/:id/mentors", async (req, res) => {
  const { id } = req.params;
  const mentors = await prisma.ideaMentor.findMany({
    where: { ideaId: id },
    include: { user: true },
  });
  res.json(mentors);
});

// Add mentor
router.post("/:id/mentors", async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "userId required" });
  const mentor = await prisma.ideaMentor.create({
    data: { ideaId: id, userId },
  });
  res.status(201).json(mentor);
});

// List comments
router.get("/:id/comments", async (req, res) => {
  const { id } = req.params;
  const comments = await prisma.comment.findMany({
    where: { ideaId: id },
    include: { user: true, replies: true, likes: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(comments);
});

// Add comment
router.post("/:id/comments", async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { content, parentId } = req.body;
  if (!content) return res.status(400).json({ error: "Content required" });
  const comment = await prisma.comment.create({
    data: {
      content,
      ideaId: id,
      userId: req.user.id,
      parentId: parentId || null,
    },
    include: { user: true, replies: true, likes: true },
  });
  res.status(201).json(comment);
});

// Like/unlike idea
router.post("/:id/like", async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'like' or 'unlike'
  if (!["like", "unlike"].includes(action)) {
    return res.status(400).json({ error: "Invalid action" });
  }
  if (action === "like") {
    const like = await prisma.like.upsert({
      where: { userId_ideaId: { userId: req.user.id, ideaId: id } },
      update: {},
      create: { userId: req.user.id, ideaId: id },
    });
    return res.json({ liked: true, like });
  } else {
    await prisma.like.deleteMany({
      where: { userId: req.user.id, ideaId: id },
    });
    return res.json({ liked: false });
  }
});

export default router;
