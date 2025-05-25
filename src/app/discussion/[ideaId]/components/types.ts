// Types used throughout the discussion components
export type Idea = {
  id: string
  name: string
  email: string
  country: string
  description: string
  submittedAt: string
  likes: number
}

export type Comment = {
  id: string
  author: string
  authorRole: string
  content: string
  createdAt: string
  likes: number
  parentId: string | null
  avatar: string // Add avatar field
  replies?: Comment[]
}
