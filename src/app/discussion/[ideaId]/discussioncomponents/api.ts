import { Idea, Comment } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

// Helper function to create authenticated headers
const createAuthHeaders = (accessToken?: string | null): HeadersInit => {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return headers;
};

// Fetch idea details with authentication
export async function fetchIdeaDetails(ideaId: string | null, accessToken?: string | null): Promise<Idea> {
  if (!ideaId) {
    throw new Error("Idea ID is required");
  }
  
  try {
    const res = await fetch(`${API_URL}/ideas/${ideaId}`, { 
      headers: createAuthHeaders(accessToken) 
    });
    
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
    const res = await fetch(`${API_URL}/ideas/${ideaId}/comments`, { 
      headers: createAuthHeaders(accessToken) 
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      throw new Error('Failed to fetch comments');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

// Check if user has liked an idea
export async function checkIdeaLikeStatus(ideaId: string, userId: string, accessToken?: string | null): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/ideas/${ideaId}/likes/check?userId=${userId}`, { 
      headers: createAuthHeaders(accessToken) 
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Authentication failed');
      }
      throw new Error('Failed to check like status');
    }
    
    const data = await res.json();
    return data.liked;
  } catch (error) {
    console.error('Error checking like status:', error);
    throw error;
  }
}

// Fetch comments liked by user
export async function fetchLikedComments(ideaId: string, userId: string, accessToken?: string | null): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/ideas/${ideaId}/comments/liked?userId=${userId}`, { 
      headers: createAuthHeaders(accessToken) 
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Authentication failed');
      }
      throw new Error('Failed to fetch liked comments');
    }
    
    const data = await res.json();
    return data.likedComments || [];
  } catch (error) {
    console.error('Error fetching liked comments:', error);
    throw error;
  }
}

// Like or unlike an idea
export async function likeIdea(ideaId: string, userId: string, action: 'like' | 'unlike', accessToken?: string | null) {
  try {
    const res = await fetch(`${API_URL}/ideas/${ideaId}/likes`, {
      method: 'POST',
      headers: createAuthHeaders(accessToken),
      body: JSON.stringify({ userId, action })
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Authentication failed');
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
    const res = await fetch(`${API_URL}/ideas/${ideaId}/comments/${commentId}/likes`, {
      method: 'POST',
      headers: createAuthHeaders(accessToken),
      body: JSON.stringify({ userId, action })
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Authentication failed');
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
    const res = await fetch(`${API_URL}/ideas/${ideaId}/comments`, {
      method: 'POST',
      headers: createAuthHeaders(accessToken),
      body: JSON.stringify({ userId, content, parentId })
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Authentication failed');
      }
      throw new Error('Failed to post comment');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error posting comment:', error);
    throw error;
  }
}
