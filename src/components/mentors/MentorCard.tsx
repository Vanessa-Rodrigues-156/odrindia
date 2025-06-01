"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MentorWithIdeas } from '@/lib/mentors-service';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MentorCardProps {
  mentor: MentorWithIdeas;
  onClick: () => void;
}

const MentorCard: React.FC<MentorCardProps> = ({ mentor, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(`/mentor/${mentor.id}.png`);
  const ideaCount = mentor.mentoringIdeas.length;
  
  // Generate placeholder image based on mentor's name
  const placeholderImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=0D8ABC&color=fff&size=256`;
  
  // If PNG fails, try JPG, else fallback to placeholder
  const handleImgError = () => {
    if (imgSrc === `/mentor/${mentor.id}.png`) {
      setImgSrc(`/mentor/${mentor.id}.jpg`);
    } else {
      setImgSrc(placeholderImage);
    }
  };
  
  return (
    <TooltipProvider>
      <motion.div 
        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -5 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-5">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden">
              <Image 
                src={imgSrc}
                alt={mentor.name} 
                fill
                className="object-cover"
                onError={handleImgError}
              />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">{mentor.name}</h3>
            
            {!isHovered ? (
              <>
                <p className="text-gray-600 text-center mb-2 truncate w-full">
                  {mentor.institution || 'Institution not specified'}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  Mentoring {ideaCount} {ideaCount === 1 ? 'idea' : 'ideas'}
                </p>
              </>
            ) : (
              <motion.div 
                className="flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-gray-600 mb-1 truncate w-full">
                      <span className="font-medium text-gray-800">Email:</span> {mentor.email}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{mentor.email}</p>
                  </TooltipContent>
                </Tooltip>
                
                {mentor.city && mentor.country && (
                  <p className="text-gray-600 mb-1 text-center">
                    <span className="font-medium text-gray-800">Location:</span>{' '}
                    {mentor.city}, {mentor.country}
                  </p>
                )}
                
                {mentor.highestEducation && (
                  <p className="text-gray-600 mb-1 text-center truncate w-full">
                    <span className="font-medium text-gray-800">Education:</span>{' '}
                    {mentor.highestEducation}
                  </p>
                )}
              </motion.div>
            )}
            
            <Button 
              onClick={onClick} 
              variant="outline" 
              className="mt-3 w-full bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200"
            >
              View Profile
            </Button>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default MentorCard;
