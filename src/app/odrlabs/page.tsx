import { Metadata } from "next"
import OdrLabsClient from "./OdrLabsClient"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "ODR Labs - Innovative Ideas for Justice System",
  description: "Explore innovative ideas for a tech-enabled justice system submitted by the community.",
}

export default async function OdrLabsPage() {
  // Fetch only approved ideas from the database
  const ideasFromDb = await prisma.idea.findMany({
    where: {
      approved: true
    },
    orderBy: { createdAt: "desc" },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          country: true,
          institution: true,
        }
      },
      comments: true,
      likes: true
    }
  })
  
  // Map DB results to match OdrLabsClient expected props
  const ideas = ideasFromDb.map((idea) => ({
    id: idea.id,
    name: idea.owner.name,
    email: idea.owner.email,
    country: idea.owner.country || "India", // Default to India if no country specified
    title: idea.title,
    caption: idea.caption || "",
    description: idea.description,
    submittedAt: idea.createdAt.toISOString(),
    likes: idea.likes.length,
    commentCount: idea.comments.length,
  }))
  return <OdrLabsClient initialIdeas={ideas} />
}
