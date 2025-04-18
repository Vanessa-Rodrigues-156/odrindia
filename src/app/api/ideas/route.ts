import { NextResponse } from "next/server";
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Path to the submissions JSON file
const SUBMISSIONS_FILE_PATH = path.join(process.cwd(), 'src', 'app', 'submit-idea', 'submissions.json');

// Fallback mock ideas for when no submissions exist
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

// function processIdea(data: unknown) {
//   // Ensure proper type checking here
// }

export async function GET() {
  try {
    // Check if submissions file exists and read it
    if (existsSync(SUBMISSIONS_FILE_PATH)) {
      const submissionsData = await readFile(SUBMISSIONS_FILE_PATH, 'utf8');
      console.log("Unused variable:", submissionsData); // Log unused variable
      const submissions = JSON.parse(submissionsData);
      
      // Map submissions to the expected format for ideas
      const ideas = submissions.map((submission: { id: string; name: string; email: string; country: string; description: string; files: string[]; submittedAt: string; }) => ({
        id: submission.id,
        name: submission.name,
        email: submission.email,
        country: submission.country,
        description: submission.description,
        attachments: submission.files.map((filePath, index) => {
          const filename = path.basename(filePath);
          return {
            id: `att-${submission.id}-${index}`,
            filename: filename,
            url: `/api/attachments/${submission.id}/${filename}`
          };
        }),
        submittedAt: submission.submittedAt,
        likes: 0,             // Default value for new submissions
        commentCount: 0       // Default value for new submissions
      }));
      
      // Combine real submissions with mock data or just return submissions
      // return NextResponse.json([...ideas, ...mockIdeas]);
      return NextResponse.json(ideas);
    }
    
    // If file doesn't exist, return mock data
    return NextResponse.json(mockIdeas);
    
  } catch (error) {
    console.error('Error reading submissions:', error);
    // Return mock data as fallback in case of any errors
    return NextResponse.json(mockIdeas);
  }
}
