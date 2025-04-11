import { Metadata } from "next"
import OdrLabsClient from "./OdrLabsClient"

export const metadata: Metadata = {
  title: "ODR Labs - Innovative Ideas for Justice System",
  description: "Explore innovative ideas for a tech-enabled justice system submitted by the community.",
}

export default async function OdrLabsPage() {
  // This would be replaced with actual data fetching from your backend
  const ideas = await fetchIdeas()
  
  return <OdrLabsClient initialIdeas={ideas} />
}

// Mock function to fetch ideas - replace with actual API call
async function fetchIdeas() {
  // This would be a real API call in production
  return [
    {
      id: "idea-001",
      name: "John Doe",
      email: "john@example.com",
      country: "IN",
      description: "AI-powered conflict resolution assistant that helps parties identify common ground and suggests fair solutions based on similar cases.",
      attachments: [
        { id: "att-001", filename: "proposal.pdf", url: "/api/attachments/att-001" }
      ],
      submittedAt: "2023-11-15T10:30:00Z",
      likes: 42,
      commentCount: 15
    },
    {
      id: "idea-002",
      name: "Jane Smith",
      email: "jane@example.com",
      country: "US",
      description: "Blockchain-based evidence management system that ensures transparency and prevents tampering while maintaining privacy standards.",
      attachments: [
        { id: "att-002", filename: "diagram.png", url: "/api/attachments/att-002" },
        { id: "att-003", filename: "whitepaper.pdf", url: "/api/attachments/att-003" }
      ],
      submittedAt: "2023-11-10T14:20:00Z",
      likes: 38,
      commentCount: 12
    },
    {
      id: "idea-003",
      name: "Raj Patel",
      email: "raj@example.com",
      country: "IN",
      description: "Virtual reality courtrooms for remote hearings with spatial audio and realistic environments to improve engagement and understanding.",
      attachments: [],
      submittedAt: "2023-11-05T09:15:00Z",
      likes: 27,
      commentCount: 8
    }
  ]
}
