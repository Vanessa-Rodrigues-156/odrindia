// Types used throughout the discussion components
// Make sure these types match our Prisma schema and are used consistently in the application

export interface User {
  id: string;
  name: string;
  email: string;
  userRole: "INNOVATOR" | "MENTOR" | "ADMIN" | "OTHER";
  contactNumber?: string;
  city?: string;
  country?: string;
  institution?: string;
  highestEducation?: string;
  odrLabUsage?: string;
  createdAt?: string;
}

export interface Idea {
  id: string;
  title: string;
  caption?: string;
  description: string;
  priorOdrExperience?: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner: User;
  collaborators: IdeaCollaborator[];
  mentors: IdeaMentor[];
  views: number;
  likes: number;
  commentCount: number;
}

export interface IdeaCollaborator {
  userId: string;
  ideaId: string;
  joinedAt: string;
  user: User;
}

export interface IdeaMentor {
  userId: string;
  ideaId: string;
  assignedAt: string;
  user: User;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  ideaId: string;
  userId: string;
  user: User;
  parentId?: string;
  parent?: Comment;
  replies?: Comment[];
  likes: number;
}
