"use client"

import { useState } from "react"
import { ThumbsUp } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Idea } from "./types"

interface IdeaDetailsProps {
  idea: Idea
  user: any // Replace with your user type
  hasLiked: boolean
  ideaLikes: number
  onLikeIdea: () => Promise<void>
}

export default function IdeaDetails({ 
  idea, 
  user, 
  hasLiked, 
  ideaLikes, 
  onLikeIdea 
}: IdeaDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-[#0a1e42]">Idea Details</CardTitle>
          {user ? (
            <Button 
              variant={hasLiked ? "default" : "outline"}
              size="sm"
              onClick={onLikeIdea}
              className={hasLiked ? "bg-[#0a1e42] hover:bg-[#263e69]" : ""}
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              {ideaLikes}
            </Button>
          ) : (
            <div className="flex items-center text-sm text-gray-500">
              <ThumbsUp className="mr-2 h-4 w-4" />
              <span>{ideaLikes}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          <p>{idea.description}</p>
          <div className="mt-6">
            <Link href={`/discussion/${idea.id}/workplace`}>
              <Button className="bg-[#0a1e42] hover:bg-[#263e69]">
                Join Idea Workplace Meeting
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
