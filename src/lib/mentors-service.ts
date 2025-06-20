import { apiFetch } from "./api";

// Define type for mentor
export interface MentorWithIdeas {
  id: string;
  name: string;
  email: string;
  userRole: string;
  contactNumber?: string;
  city?: string;
  country?: string;
  institution?: string;
  highestEducation?: string;
  odrLabUsage?: string;
  imageAvatar?: string;
  isMentorApproved?: boolean;
  createdAt: string;
  ideas?: {
    id: string;
    title: string;
    caption?: string;
    description?: string;
    createdAt: string;
    views?: number;
  }[];
}

// Get all mentors
export async function getAllMentors(): Promise<MentorWithIdeas[]> {
  try {
    const response = await apiFetch("/mentors");
    
    if (!response.ok) {
      throw new Error(`Failed to fetch mentors: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Filter to only include approved mentors
    return data.mentors.filter((mentor: MentorWithIdeas) => mentor.isMentorApproved === true);
  } catch (error) {
    console.error("Error fetching mentors:", error);
    throw error;
  }
}

// Get individual mentor details
export async function getMentor(id: string): Promise<MentorWithIdeas> {
  try {
    const response = await apiFetch(`/mentors/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch mentor: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching mentor with ID ${id}:`, error);
    throw error;
  }
}
