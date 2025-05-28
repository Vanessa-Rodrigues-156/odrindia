// Types used throughout the discussion components
export type User = {
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
  createdAt: string;
};

export type Idea = {
  id: string;
  title: string;
  caption?: string | null;
  description: string;
  country: string;
  owner: User;
  createdAt: string;
  likes: number;
  comments: Comment[];
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: User;
  parentId: string | null;
  replies?: Comment[];
  likes: number;
};
