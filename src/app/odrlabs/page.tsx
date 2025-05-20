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
    orderBy: { createdAt: "desc" },
    include: {
      comments: true,
    },
  })
  // Map DB results to match OdrLabsClient expected props
  const ideas = ideasFromDb.map((idea) => ({
    id: idea.id,
    name: idea.name,
    email: idea.email,
    country: idea.country,
    description: idea.description,
    submittedAt: idea.createdAt.toISOString(),
    likes: idea.likes,
    commentCount: idea.comments.length,
  }))
  return <OdrLabsClient initialIdeas={ideas} />
}
