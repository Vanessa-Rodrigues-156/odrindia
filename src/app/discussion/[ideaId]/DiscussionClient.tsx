"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"

// Import components
import IdeaHeader from "./discussioncomponents/IdeaHeader"
import IdeaDetails from "./discussioncomponents/IdeaDetails"
import CommentForm from "./discussioncomponents/CommentForm"
import CommentsList from "./discussioncomponents/CommentsList"

// Import types and API functions
import { Idea, Comment } from "./discussioncomponents/types"
import { 
  fetchComments, 
  checkIdeaLikeStatus, 
  fetchLikedComments,
  likeIdea, 
  likeComment, 
  postComment,
  fetchIdeaDetails
} from "./discussioncomponents/api"

interface DiscussionClientProps {
  idea: Idea
  initialComments: Comment[]
}

export default function DiscussionClient({ idea: initialIdea, initialComments }: DiscussionClientProps) {
  const { toast } = useToast()
  const { user, accessToken } = useAuth()
  const [idea, setIdea] = useState<Idea>(initialIdea)
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [ideaLikes, setIdeaLikes] = useState(initialIdea.likes)
  const [hasLiked, setHasLiked] = useState(false)
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Fetch comments on mount
    const loadComments = async () => {
      try {
        const data = await fetchComments(idea.id, accessToken)
        // Comments should already be properly structured from the API
        setComments(data)
      } catch (error) {
        console.error("Failed to load comments:", error)
        toast({ title: "Error", description: "Failed to load comments." })
      }
    }
    
    loadComments()
    
    // Check user's like status
    if (user?.id) {
      const checkLikeStatus = async () => {
        try {
          // Check idea like status
          const ideaLiked = await checkIdeaLikeStatus(idea.id, user.id, accessToken)
          setHasLiked(ideaLiked)
          
          // Check comment likes
          const likedComments = await fetchLikedComments(idea.id, user.id, accessToken)
          const likedCommentsMap: Record<string, boolean> = {}
          likedComments.forEach((commentId: string) => {
            likedCommentsMap[commentId] = true
          })
          setCommentLikes(likedCommentsMap)
        } catch (error) {
          console.error("Failed to check like status:", error)
        }
      }
      
      checkLikeStatus()
    }
  }, [idea.id, user?.id, toast, accessToken])

  // Handler for updating collaborator/mentor status
  const handleCollaborationUpdated = async () => {
    try {
      const updatedIdea = await fetchIdeaDetails(idea.id, accessToken);
      setIdea(updatedIdea);
    } catch (error) {
      console.error("Failed to refresh idea details:", error);
    }
  }
  
  // Handler for liking/unliking an idea
  const handleLikeIdea = async () => {
    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to like ideas." })
      return
    }
    
    const action = hasLiked ? "unlike" : "like"
    try {
      const data = await likeIdea(idea.id, user.id, action, accessToken)
      setIdeaLikes(data.likes)
      setHasLiked(!hasLiked)
    } catch (error) {
      toast({ title: "Error", description: "Failed to update like." })
    }
  }
  
  // Handler for liking/unliking a comment
  const handleLikeComment = async (commentId: string) => {
    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to like comments." })
      return
    }
    
    const isLiked = commentLikes[commentId]
    const action = isLiked ? "unlike" : "like"
    try {
      const data = await likeComment(idea.id, commentId, user.id, action, accessToken)
      setCommentLikes((prev) => ({ ...prev, [commentId]: !isLiked }))
      setComments((prev) => prev.map(c =>
        c.id === commentId ? { ...c, likes: data.likes } : c
      ))
    } catch (error) {
      toast({ title: "Error", description: "Failed to update comment like." })
    }
  }

  // Handler for replying to a comment
  const handleReply = (parentId: string) => {
    setReplyingTo(parentId === replyingTo ? null : parentId)
  }
  
  // Handler for submitting a new comment
  const handleSubmitComment = async (content: string) => {
    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to post comments." })
      return
    }
    
    try {
      const newComment = await postComment(idea.id, user.id, content, undefined, accessToken)
      setComments((prev) => [...prev, { ...newComment, replies: [] }])
      toast({ title: "Comment posted", description: "Your comment has been added to the discussion." })
    } catch (error) {
      toast({ title: "Error", description: "Failed to post comment." })
    }
  }

  // Handler for submitting a reply to a comment
  const handleSubmitReply = async (parentId: string, content: string) => {
    if (!user) {
      toast({ title: "Authentication Required", description: "Please sign in to post replies." })
      return
    }
    
    try {
      const newReply = await postComment(idea.id, user.id, content, parentId, accessToken)
      
      // Update comments state to add the reply to the correct parent
      // This function recursively searches for the parent comment in the comment tree
      const addReply = (comments: Comment[]): Comment[] =>
        comments.map(comment => {
          // If this is the parent comment, add the new reply to its replies array
          if (comment.id === parentId) {
            return { 
              ...comment, 
              replies: [...(comment.replies || []), newReply] 
            }
          } 
          // If this comment has replies, recursively search for the parent in those replies
          else if (comment.replies && comment.replies.length > 0) {
            return { 
              ...comment, 
              replies: addReply(comment.replies) 
            }
          }
          // Otherwise, just return the comment unchanged
          return comment
        })
        
      setComments(prev => addReply(prev))
      setReplyingTo(null)
      toast({ title: "Reply posted", description: "Your reply has been added to the discussion." })
    } catch (error) {
      toast({ title: "Error", description: "Failed to post reply." })
    }
  }
  
  // Handler for toggling comment expansion
  const handleToggleExpand = (commentId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        {/* Idea Header */}
        <IdeaHeader idea={idea} />
        
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              {/* Idea Details */}
              <IdeaDetails 
                idea={idea} 
                user={user} 
                hasLiked={hasLiked} 
                ideaLikes={ideaLikes} 
                onLikeIdea={handleLikeIdea} 
                onCollaborationUpdated={handleCollaborationUpdated}
              />
              
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-bold text-[#0a1e42]">Discussion</h2>
                
                {/* Comment Form */}
                <CommentForm 
                  ideaId={idea.id}
                  user={user}
                  onSubmitComment={handleSubmitComment}
                />
                
                {/* Comments List */}
                <CommentsList
                  comments={comments}
                  ideaId={idea.id}
                  userId={user?.id}
                  commentLikes={commentLikes}
                  expandedComments={expandedComments}
                  user={user}
                  onLikeComment={handleLikeComment}
                  onReply={handleReply}
                  onSubmitReply={handleSubmitReply}
                  onToggleExpand={handleToggleExpand}
                  replyingTo={replyingTo}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
