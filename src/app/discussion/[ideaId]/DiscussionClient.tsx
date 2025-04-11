"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, ThumbsUp, MessageSquare, Paperclip, Send, ChevronUp, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Attachment = {
  id: string
  filename: string
  url: string
}

type Idea = {
  id: string
  name: string
  email: string
  country: string
  description: string
  attachments: Attachment[]
  submittedAt: string
  likes: number
}

type Comment = {
  id: string
  author: string
  authorRole: string
  content: string
  createdAt: string
  likes: number
  parentId: string | null
  replies?: Comment[]
}

interface DiscussionClientProps {
  idea: Idea
  initialComments: Comment[]
}

export default function DiscussionClient({ idea, initialComments }: DiscussionClientProps) {
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [commentContent, setCommentContent] = useState("")
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [ideaLikes, setIdeaLikes] = useState(idea.likes)
  const [hasLiked, setHasLiked] = useState(false)
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({})

  const handleLikeIdea = () => {
    if (hasLiked) {
      setIdeaLikes(prev => prev - 1)
      setHasLiked(false)
    } else {
      setIdeaLikes(prev => prev + 1)
      setHasLiked(true)
    }
    
    // Here you would make an API call to update the like count
  }
  
  const handleLikeComment = (commentId: string) => {
    const newLikes = { ...commentLikes }
    newLikes[commentId] = !newLikes[commentId]
    setCommentLikes(newLikes)
    
    // Here you would update the actual comment likes in the database
  }

  const handleReply = (parentId: string) => {
    setReplyingTo(parentId === replyingTo ? null : parentId)
    setReplyContent("")
  }
  
  const submitReply = (parentId: string) => {
    if (!replyContent.trim()) return
    
    const newReply: Comment = {
      id: `comment-${Date.now()}`,
      author: "Current User", // This would come from authentication
      authorRole: "Community Member",
      content: replyContent,
      createdAt: new Date().toISOString(),
      likes: 0,
      parentId: parentId
    }
    
    // Find the parent comment and add the reply
    const updateComments = (comments: Comment[]): Comment[] => {
      return comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          }
        } else if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateComments(comment.replies)
          }
        }
        return comment
      })
    }
    
    // If replying to a top-level comment
    if (comments.some(c => c.id === parentId)) {
      setComments(updateComments(comments))
    } else {
      // If replying to a nested comment, need to recursively find it
      setComments(updateComments(comments))
    }
    
    setReplyingTo(null)
    setReplyContent("")
    
    toast({
      title: "Reply posted",
      description: "Your reply has been added to the discussion."
    })
  }
  
  const submitComment = () => {
    if (!commentContent.trim()) return
    
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: "Current User", // This would come from authentication
      authorRole: "Community Member",
      content: commentContent,
      createdAt: new Date().toISOString(),
      likes: 0,
      parentId: null,
      replies: []
    }
    
    setComments([...comments, newComment])
    setCommentContent("")
    
    toast({
      title: "Comment posted",
      description: "Your comment has been added to the discussion."
    })
  }
  
  const toggleCommentExpanded = (commentId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }))
  }
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  // Recursive component for comment thread
  const CommentThread = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const isExpanded = expandedComments[comment.id] !== false // Default to expanded
    
    return (
      <div className={`border-l-2 ${depth > 0 ? "border-gray-200 pl-4" : "border-transparent"} mt-4`}>
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-[#0a1e42] text-white">
              {getInitials(comment.author)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <span className="font-medium">{comment.author}</span>
                  {comment.authorRole && (
                    <span className="ml-2 rounded bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-700">
                      {comment.authorRole}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {format(new Date(comment.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              
              <p className="text-gray-700">{comment.content}</p>
              
              <div className="mt-2 flex gap-4">
                <button 
                  onClick={() => handleLikeComment(comment.id)}
                  className={`flex items-center gap-1 text-sm ${
                    commentLikes[comment.id] ? "text-sky-600 font-medium" : "text-gray-500"
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span>{comment.likes + (commentLikes[comment.id] ? 1 : 0)}</span>
                </button>
                
                <button 
                  onClick={() => handleReply(comment.id)}
                  className={`flex items-center gap-1 text-sm ${
                    replyingTo === comment.id ? "text-sky-600 font-medium" : "text-gray-500"
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Reply</span>
                </button>
                
                {comment.replies && comment.replies.length > 0 && (
                  <button 
                    onClick={() => toggleCommentExpanded(comment.id)}
                    className="flex items-center gap-1 text-sm text-gray-500"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        <span>Hide replies</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        <span>Show replies ({comment.replies.length})</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
            
            {replyingTo === comment.id && (
              <div className="mt-3 flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#0a1e42] text-white">
                    CU
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="mb-2 h-20 resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setReplyingTo(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-[#0a1e42] hover:bg-[#263e69]"
                      onClick={() => submitReply(comment.id)}
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {isExpanded && comment.replies && comment.replies.length > 0 && (
              <div className="mt-1">
                {comment.replies.map((reply) => (
                  <CommentThread key={reply.id} comment={reply} depth={depth + 1} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-[#0a1e42] py-8 text-white md:py-12">
          <div className="container mx-auto px-4">
            <Link href="/odrlabs" className="mb-6 inline-flex items-center text-gray-200 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to ODR Labs
            </Link>
            <div className="mx-auto max-w-4xl">
              <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
                {idea.description.split('.')[0]}
              </h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-300">
                <div>Posted by {idea.name}</div>
                <div>From {idea.country}</div>
                <div>{format(new Date(idea.submittedAt), "MMMM d, yyyy")}</div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-[#0a1e42]">Idea Details</CardTitle>
                    <Button 
                      variant={hasLiked ? "default" : "outline"}
                      size="sm"
                      onClick={handleLikeIdea}
                      className={hasLiked ? "bg-[#0a1e42] hover:bg-[#263e69]" : ""}
                    >
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      {ideaLikes}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p>{idea.description}</p>
                  </div>
                  
                  {idea.attachments.length > 0 && (
                    <div className="mt-6 rounded-lg border border-gray-200 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-700">Attachments</span>
                      </div>
                      <ul className="space-y-2">
                        {idea.attachments.map((attachment) => (
                          <li key={attachment.id}>
                            <a
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 rounded-md border border-transparent p-2 text-sky-600 hover:bg-gray-50 hover:underline"
                            >
                              {attachment.filename}
                              <span className="text-xs text-gray-500">↗</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="mt-8">
                <h2 className="mb-4 text-xl font-bold text-[#0a1e42]">Discussion</h2>
                
                <div className="mb-6 flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-[#0a1e42] text-white">CU</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share your thoughts on this idea..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      className="mb-2 resize-none"
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={submitComment}
                        className="bg-[#0a1e42] hover:bg-[#263e69]"
                        disabled={!commentContent.trim()}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>
                
                {comments.length > 0 ? (
                  <div className="space-y-6">
                    {comments.map((comment) => (
                      <CommentThread key={comment.id} comment={comment} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
                    <p className="text-gray-500">No comments yet. Be the first to start the discussion!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
