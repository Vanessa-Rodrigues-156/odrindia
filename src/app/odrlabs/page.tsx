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
    include:{
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          country: true, // Assuming country is stored in the user model
          userType: true, // Optional, if you want to display user type
          institution: true, // Optional, if you want to display institution
        }
      },
      comments: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          userId: true,
        }
      }
    }
  })
  // Map DB results to match OdrLabsClient expected props
  const ideas = ideasFromDb.map((idea) => ({
    id: idea.id,
    name: idea.user?.name || "Anonymous",
    email: idea.user?.email || "anonymous@example.com",
    country: "India", // Default country if not stored
    description: idea.description,
    submittedAt: idea.createdAt.toISOString(),
    likes: idea.likes,
    commentCount: idea.comments.length,
  }))
  return <OdrLabsClient initialIdeas={ideas} />
}
