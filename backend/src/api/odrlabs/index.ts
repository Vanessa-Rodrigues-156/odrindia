import { Router } from "express";
import { authenticateJWT } from "../../middleware/auth";
import prisma from "../../lib/prisma";

const router = Router();
router.use(authenticateJWT);

interface Owner {
  id: string;
  name: string;
  email: string;
  country?: string | null;
  institution?: string | null;
}

interface Comment {
  id: string;
  // Add more fields as needed
}

interface Like {
  id: string;
  // Add more fields as needed
}

interface Idea {
  id: string;
  title: string;
  caption?: string | null;
  description: string;
  createdAt: Date;
  owner: Owner;
  comments: Comment[];
  likes: Like[];
}

// List all approved ideas for ODR Labs
router.get("/ideas", async (req, res) => {
  const ideas = await prisma.idea.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          country: true,
          institution: true,
        },
      },
      comments: true,
      likes: true,
    },
  });

  // Map to ODR Labs client format if needed
  const result = ideas.map((idea: Idea) => ({
    id: idea.id,
    name: idea.owner.name,
    email: idea.owner.email,
    country: idea.owner.country || "India",
    title: idea.title,
    caption: idea.caption || "",
    description: idea.description,
    submittedAt: idea.createdAt.toISOString(),
    likes: idea.likes.length,
    commentCount: idea.comments.length,
  }));

  res.json({ ideas: result });
});

export default router;
