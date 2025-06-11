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

  const placeholderImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name || 'Mentor')}&background=0D8ABC&color=fff&size=256&bold=true`;
  
  // Try loading mentor profile image from different possible sources/extensions
  const getMentorImageSrc = () => {
    // We'll use a path in the public folder: /mentor/{id}.{extension}
    // The image loading will try this path first, and if it fails,
    // the onError handler will progressively try other formats
    
    // Check if the mentor id exists
    if (!mentor.id) return placeholderImage;
    
    // Start with jpg format by default - we'll handle fallbacks in the onError handler
    // Our error handler will try: jpg -> png -> jpeg -> placeholder
    return `/mentor/${mentor.id}.jpg`;
  };
  
  // Function to handle image error and fall back to placeholder
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    
    // If current source is JPG, try PNG before falling back to placeholder
    if (target.src.endsWith('.jpg')) {
      const pngSrc = target.src.replace('.jpg', '.png');
      target.src = pngSrc;
    } 
    // If current source is PNG, try JPEG before falling back to placeholder
    else if (target.src.endsWith('.png')) {
      const jpegSrc = target.src.replace('.png', '.jpeg');
      target.src = jpegSrc;
    }
    // Otherwise, fall back to placeholder
    else {
      target.src = placeholderImage;
    }
    
    // Add a one-time error handler to catch if the alternate format also fails
    target.onerror = () => {
      target.src = placeholderImage;
      target.onerror = null; // Remove the error handler after fallback
    };
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-6 bg-gradient-to-b from-white to-blue-50">
        <DialogHeader className="pb-4 border-b border-blue-100">
          <DialogTitle className="text-2xl font-bold flex items-center text-blue-800">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-sky-500">
              Mentor Profile
            </span>
            <button 
              className="ml-auto text-gray-500 hover:text-red-500 transition-colors duration-200"
              onClick={onClose}
              aria-label="Close dialog"
            >
              {/* <X size={22} /> */}
            </button>
          </DialogTitle>
          <DialogDescription className="text-blue-600">
            Detailed information about this mentor
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[70vh] px-2">
          <div className="flex flex-col md:flex-row gap-8 py-6">
            {/* Left side - Mentor details */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="relative w-44 h-44 rounded-full overflow-hidden mb-5 border-4 border-sky-300 shadow-lg">
                <Image 
                  src={getMentorImageSrc()}
                  alt={mentor.name || 'Mentor'} 
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                  priority
                  onError={handleImageError}
                />
              </div>
              
              <h2 className="text-2xl font-bold mb-3 text-center text-blue-900 break-words max-w-full px-4">
                {mentor.name}
              </h2>
              <p className="text-blue-600 mb-5 text-center break-all max-w-full px-2">
                {mentor.email}
              </p>
              
              <div className="bg-white rounded-xl p-5 w-full shadow-sm border border-blue-100 hover:shadow-md transition-shadow duration-300">
                <h3 className="font-semibold text-lg mb-4 text-blue-800 border-b border-blue-100 pb-2">
                  Mentor Info
                </h3>
                
                <div className="space-y-3">
                  {(mentor.city || mentor.country) && (
                    <div className="text-sm flex flex-col">
                      <span className="font-medium text-blue-700">Location:</span>
                      <span className="text-gray-700 break-words">
                        {[mentor.city, mentor.country].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {mentor.institution && (
                    <div className="text-sm flex flex-col">
                      <span className="font-medium text-blue-700">Institution:</span>
                      <span className="text-gray-700 break-words">{mentor.institution}</span>
                    </div>
                  )}
                  
                  {mentor.highestEducation && (
                    <div className="text-sm flex flex-col">
                      <span className="font-medium text-blue-700">Education:</span>
                      <span className="text-gray-700 break-words">{mentor.highestEducation}</span>
                    </div>
                  )}
                  
                  <div className="text-sm flex flex-col">
                    <span className="font-medium text-blue-700">Joined:</span>
                    <span className="text-gray-700">
                      {formatDistanceToNow(new Date(mentor.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                {/* {mentor.odrLabUsage && (
                  <div className="mt-5 pt-4 border-t border-blue-100">
                    <h3 className="font-semibold text-md mb-2 text-blue-800">ODR Lab Usage</h3>
                    <p className="text-sm text-gray-600 break-words whitespace-pre-wrap">
                      {mentor.odrLabUsage}
                    </p>
                  </div>
                )} */}
              </div>
            </div>
            
            {/* Right side - Ideas being mentored */}
            <div className="w-full md:w-2/3">
              <div className="flex items-center justify-between mb-5 pb-2 border-b border-blue-100">
                <h3 className="font-bold text-xl text-blue-800 flex items-center">
                  Ideas Being Mentored
                  <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-700 border-blue-300">
                    {mentor.mentoringIdeas.length}
                  </Badge>
                </h3>
              </div>
              
              {mentor.mentoringIdeas.length > 0 ? (
                <div className="space-y-5">
                  {mentor.mentoringIdeas.map(({ idea }) => (
                    <Card key={idea.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-blue-100">
                      <CardContent className="p-5">
                        <Link href={`/ideas/${idea.id}`} className="hover:no-underline block">
                          <h4 className="font-semibold text-lg text-blue-700 hover:text-blue-800 mb-3 break-words">
                            {idea.title}
                          </h4>
                        </Link>
                        
                        {idea.caption && (
                          <p className="text-sm text-blue-600 mb-3 break-words">
                            {idea.caption}
                          </p>
                        )}
                        
                        <p className="text-sm text-gray-700 line-clamp-3 mb-4 break-words whitespace-pre-wrap">
                          {idea.description || 'No description available'}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-gray-100">
                          <span className="text-blue-500 my-1">
                            Created {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
                          </span>
                          <span className="bg-blue-50 px-2 py-1 rounded-full text-blue-700">
                            {(idea.views || 0).toLocaleString()} views
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-10 rounded-xl text-center border border-blue-100 shadow-sm">
                  <p className="text-blue-600">This mentor is not currently mentoring any ideas.</p>
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
