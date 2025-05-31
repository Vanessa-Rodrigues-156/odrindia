"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { MentorWithIdeas } from '@/lib/mentors-service';
import { formatDistanceToNow } from 'date-fns';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MentorDetailModalProps {
  mentor: MentorWithIdeas | null;
  isOpen: boolean;
  onClose: () => void;
}

const MentorDetailModal: React.FC<MentorDetailModalProps> = ({ 
  mentor, 
  isOpen, 
  onClose 
}) => {
  if (!mentor) return null;

  const placeholderImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=0D8ABC&color=fff&size=256`;
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            Mentor Profile
            <button 
              className="ml-auto text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </DialogTitle>
          <DialogDescription>
            Detailed information about this mentor
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[70vh] pr-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left side - Mentor details */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-sky-200">
                <Image 
                  src={placeholderImage}
                  alt={mentor.name} 
                  fill
                  className="object-cover"
                />
              </div>
              
              <h2 className="text-2xl font-bold mb-2 text-center">{mentor.name}</h2>
              <p className="text-blue-600 mb-4 text-center">{mentor.email}</p>
              
              <div className="bg-gray-50 rounded-lg p-4 w-full">
                <h3 className="font-semibold text-lg mb-3 text-gray-800">Mentor Info</h3>
                
                <div className="space-y-2">
                  {mentor.contactNumber && (
                    <p className="text-sm">
                      <span className="font-medium">Contact:</span> {mentor.contactNumber}
                    </p>
                  )}
                  
                  {(mentor.city || mentor.country) && (
                    <p className="text-sm">
                      <span className="font-medium">Location:</span>{' '}
                      {[mentor.city, mentor.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                  
                  {mentor.institution && (
                    <p className="text-sm">
                      <span className="font-medium">Institution:</span> {mentor.institution}
                    </p>
                  )}
                  
                  {mentor.highestEducation && (
                    <p className="text-sm">
                      <span className="font-medium">Education:</span> {mentor.highestEducation}
                    </p>
                  )}
                  
                  <p className="text-sm">
                    <span className="font-medium">Joined:</span>{' '}
                    {formatDistanceToNow(new Date(mentor.createdAt), { addSuffix: true })}
                  </p>
                </div>
                
                {mentor.odrLabUsage && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-md mb-2">ODR Lab Usage</h3>
                    <p className="text-sm text-gray-600">{mentor.odrLabUsage}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right side - Ideas being mentored */}
            <div className="w-full md:w-2/3">
              <h3 className="font-bold text-xl mb-4 text-gray-800 flex items-center">
                Ideas Being Mentored
                <Badge variant="outline" className="ml-2 bg-blue-50">
                  {mentor.mentoringIdeas.length}
                </Badge>
              </h3>
              
              {mentor.mentoringIdeas.length > 0 ? (
                <div className="space-y-4">
                  {mentor.mentoringIdeas.map(({ idea }) => (
                    <Card key={idea.id} className="hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-4">
                        <Link href={`/ideas/${idea.id}`} className="hover:no-underline">
                          <h4 className="font-semibold text-lg text-blue-700 hover:text-blue-800 mb-2">
                            {idea.title}
                          </h4>
                        </Link>
                        
                        {idea.caption && (
                          <p className="text-sm text-gray-600 mb-2">{idea.caption}</p>
                        )}
                        
                        <p className="text-sm text-gray-800 line-clamp-2 mb-3">
                          {idea.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            Created {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
                          </span>
                          <span>{idea.views} views</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <p className="text-gray-600">This mentor is not currently mentoring any ideas.</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MentorDetailModal;
