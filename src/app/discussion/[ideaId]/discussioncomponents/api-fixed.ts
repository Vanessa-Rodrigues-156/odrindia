import { apiFetch } from "@/lib/api";
import { Idea, Comment } from "./types";

// Fetch idea details with authentication
export async function fetchIdeaDetails(ideaId: string | null, accessToken?: string | null): Promise<Idea> {
  if (!ideaId) {
    throw new Error("Idea ID is required");
  }
  
  try {
    // Use global apiFetch which handles authentication automatically
    const res = await apiFetch(`/ideas/${ideaId}`);
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`Failed to fetch idea details: ${res.status} ${res.statusText}${errorData.message ? ' - ' + errorData.message : ''}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching idea details:', error);
    throw error;
  }
}

// Fetch comments with authentication
export async function fetchComments(ideaId: string | null, accessToken?: string | null): Promise<Comment[]> {
  if (!ideaId) {
    return [];
  }
  
  try {
    const res = await apiFetch(`/ideas/${ideaId}/comments`);
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      throw new Error('Failed to fetch comments');
    }
    // Map 'author' to 'user' recursively for all comments and replies
    const mapComment = (comment: any): Comment => ({
      ...comment,
      user: comment.author,
      replies: comment.replies ? comment.replies.map(mapComment) : [],
    });
    const comments = await res.json();
    return comments.map(mapComment);
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

// Check if user has liked an idea
export async function checkIdeaLikeStatus(ideaId: string, userId: string, accessToken?: string | null): Promise<boolean> {
  try {
    const res = await apiFetch(`/ideas/${ideaId}/likes/check?userId=${userId}`);
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      throw new Error('Failed to check like status');
    }
    
    const data = await res.json();
    return data.hasLiked || false;
  } catch (error) {
    console.error('Error checking like status:', error);
    return false;
  }
}

// Fetch liked comments for a user
export async function fetchLikedComments(ideaId: string, userId: string, accessToken?: string | null): Promise<string[]> {
  try {
    const res = await apiFetch(`/ideas/${ideaId}/comments/liked?userId=${userId}`);
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      throw new Error('Failed to fetch liked comments');
    }
    
    const data = await res.json();
    return data.likedCommentIds || [];
  } catch (error) {
    console.error('Error fetching liked comments:', error);
    return [];
  }
}

// Like or unlike an idea
export async function likeIdea(ideaId: string, userId: string, action: 'like' | 'unlike', accessToken?: string | null) {
  try {
    const res = await apiFetch(`/ideas/${ideaId}/likes`, {
      method: 'POST',
      body: JSON.stringify({ userId, action }),
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      throw new Error('Failed to update like');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error updating idea like:', error);
    throw error;
  }
}

// Like or unlike a comment
export async function likeComment(ideaId: string, commentId: string, userId: string, action: 'like' | 'unlike', accessToken?: string | null) {
  try {
    const res = await apiFetch(`/ideas/${ideaId}/comments/${commentId}/likes`, {
      method: 'POST',
      body: JSON.stringify({ userId, action }),
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      throw new Error('Failed to update comment like');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error updating comment like:', error);
    throw error;
  }
}

// Post a comment
export async function postComment(ideaId: string, userId: string, content: string, parentId?: string, accessToken?: string | null) {
  try {
    const res = await apiFetch(`/ideas/${ideaId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ 
        content, 
        parentId: parentId || null 
      }),
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`Failed to post comment: ${errorData.message || 'Unknown error'}`);
    }
    
    const comment = await res.json();
    // Map 'author' to 'user' for consistency
    return {
      ...comment,
      user: comment.author,
      replies: comment.replies || [],
    };
  } catch (error) {
    console.error('Error posting comment:', error);
    throw error;
  }
}
