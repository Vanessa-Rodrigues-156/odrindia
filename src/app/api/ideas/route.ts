import { NextResponse } from "next/server";

// This would be replaced with a database connection in production
const mockIdeas = [
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
  // Add more mock ideas here
];

export async function GET() {
  return NextResponse.json(mockIdeas);
}
