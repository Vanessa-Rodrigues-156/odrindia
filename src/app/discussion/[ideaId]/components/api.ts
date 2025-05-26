"use client"

import { Comment } from "./types"

// API service functions for discussion-related operations
export const fetchComments = async (ideaId: string): Promise<Comment[]> => {
  const res = await fetch(`/api/ideas/${ideaId}/comments`)
  if (!res.ok) throw new Error('Failed to fetch comments')
  return res.json()
}

export const checkIdeaLikeStatus = async (ideaId: string, userId: string): Promise<boolean> => {
  const res = await fetch(`/api/ideas/${ideaId}/like/check?userId=${userId}`)
  if (!res.ok) throw new Error('Failed to check like status')
  const data = await res.json()
  return !!data.hasLiked
}

export const fetchLikedComments = async (ideaId: string, userId: string): Promise<string[]> => {
  const res = await fetch(`/api/ideas/${ideaId}/comments/likes?userId=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch liked comments')
  const data = await res.json()
  return data.likedComments
}

export const likeIdea = async (ideaId: string, userId: string, action: 'like' | 'unlike') => {
  const res = await fetch(`/api/ideas/${ideaId}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, action }),
  })
  
  if (!res.ok) throw new Error('Failed to update idea like')
  return res.json()
}

export const likeComment = async (ideaId: string, commentId: string, userId: string, action: 'like' | 'unlike') => {
  const res = await fetch(`/api/ideas/${ideaId}/comments/${commentId}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, action }),
  })
  
  if (!res.ok) throw new Error('Failed to update comment like')
  return res.json()
}

interface CommentPayload {
  content: string;
  userId: string;
  parentId?: string;
}

export const postComment = async (ideaId: string, userId: string, content: string, parentId?: string) => {
  const payload: CommentPayload = {
    content,
    userId
  }
  
  if (parentId) {
    payload.parentId = parentId
  }
  
  const res = await fetch(`/api/ideas/${ideaId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  
  if (!res.ok) throw new Error('Failed to post comment')
  return res.json()
}
