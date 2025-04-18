import { Metadata } from "next";
import { notFound } from "next/navigation";
import DiscussionClient from "./DiscussionClient";

interface DiscussionPageProps {
  params: Promise<{ ideaId: string }>; // Updated to handle Promise
}

export async function generateMetadata({ params }: DiscussionPageProps): Promise<Metadata> {
  const { ideaId } = await params; // Await the params to extract ideaId
  const idea = await fetchIdea(ideaId);

  if (!idea) {
    return {
      title: "Idea Not Found",
      description: "The requested idea could not be found.",
    };
  }

  return {
    title: `Discussion: ${idea.description.split(".")[0]}`,
    description: idea.description.substring(0, 160),
  };
}

export default async function DiscussionPage({ params }: DiscussionPageProps) {
  const { ideaId } = await params; // Await the params to extract ideaId
  const idea = await fetchIdea(ideaId);

  if (!idea) {
    notFound();
  }

  const comments = await fetchComments(ideaId);

  return <DiscussionClient idea={idea} initialComments={comments} />;
}

// Mock function to fetch an idea - replace with actual API call
async function fetchIdea(ideaId: string) {
  // This would be a real API call in production
  const ideas = {
    "idea-001": {
      id: "idea-001",
      name: "John Doe",
      email: "john@example.com",
      country: "IN",
      description: "AI-powered conflict resolution assistant that helps parties identify common ground and suggests fair solutions based on similar cases.",
      attachments: [
        { id: "att-001", filename: "proposal.pdf", url: "/api/attachments/att-001" }
      ],
      submittedAt: "2023-11-15T10:30:00Z",
      likes: 42
    },
    "idea-002": {
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
      likes: 38
    },
    "idea-003": {
      id: "idea-003",
      name: "Raj Patel",
      email: "raj@example.com",
      country: "IN",
      description: "Virtual reality courtrooms for remote hearings with spatial audio and realistic environments to improve engagement and understanding.",
      attachments: [],
      submittedAt: "2023-11-05T09:15:00Z",
      likes: 27
    }
  }
  
  return ideas[ideaId as keyof typeof ideas] || null
}

// Mock function to fetch comments - replace with actual API call
async function fetchComments(ideaId: string) {
  if (ideaId === "idea-001") {
    return [
      {
        id: "comment-001",
        author: "Lisa Johnson",
        authorRole: "Legal Expert",
        content: "This is a fascinating idea! I think AI could really help with the initial assessment phase of disputes.",
        createdAt: "2023-11-16T10:40:00Z",
        likes: 15,
        parentId: null,
        replies: [
          {
            id: "comment-002",
            author: "David Chen",
            authorRole: "Tech Specialist",
            content: "I agree, but we need to ensure the AI recommendations are transparent and explainable.",
            createdAt: "2023-11-16T11:05:00Z",
            likes: 8,
            parentId: "comment-001"
          },
          {
            id: "comment-003",
            author: "John Doe",
            authorRole: "Idea Author",
            content: "Great point! I'm actually working on an explainability framework for this very reason.",
            createdAt: "2023-11-16T11:30:00Z",
            likes: 10,
            parentId: "comment-001"
          }
        ]
      },
      {
        id: "comment-004",
        author: "Maria Garcia",
        authorRole: "Judge",
        content: "I have concerns about how this would integrate with existing court systems. Would this be a complementary tool or replace certain functions?",
        createdAt: "2023-11-17T09:15:00Z",
        likes: 12,
        parentId: null,
        replies: []
      }
    ]
  }
  
  return []
}
