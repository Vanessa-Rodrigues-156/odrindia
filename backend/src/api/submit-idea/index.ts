import { Router } from "express";
import { authenticateJWT, AuthRequest } from "../../middleware/auth";
import prisma from "../../lib/prisma";

const router = Router();
router.use(authenticateJWT);

// Submit a new idea (pending approval)
router.post("/", async (req: AuthRequest, res) => {
  const { title, idea_caption, description, odr_experience, consent } =
    req.body;

  if (!title || !description || !odr_experience || !consent) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const idea = await prisma.idea.create({
      data: {
        title,
        caption: idea_caption || null,
        description,
        priorOdrExperience: odr_experience,
        ownerId: req.user.id,
        approved: false,
      },
    });
    res.status(201).json({
      success: true,
      message: "Idea submitted successfully and awaiting approval",
      ideaId: idea.id,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to submit idea. Please try again later.",
    });
  }
});

export default router;
