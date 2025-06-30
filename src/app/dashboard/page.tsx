'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { AlertCircle, User, Briefcase, Lightbulb, XCircle, Settings, Edit } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProfileEditor from '@/components/profile/ProfileEditor';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [stats, setStats] = useState({
    ideasCount: 0,
    collaborationsCount: 0,
    mentorshipsCount: 0
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        const response = await apiFetch('/api/user/stats');
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserStats();
    }
  }, [user?.id]);

  return (
    <div className="max-w-6xl mx-auto p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#0a1e42]">Dashboard</h1>
        <Button
          onClick={() => setIsProfileEditorOpen(true)}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Settings className="h-4 w-4" />
          <span>Profile Settings</span>
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16 border-4 border-blue-200">
                <AvatarImage
                  src={user?.imageAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || '')}`}
                  alt={user?.name || 'User'}
                />
                <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-[#0a1e42]">Welcome back, {user?.name}</h2>
                <p className="text-gray-600 flex items-center mt-1">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {user?.userRole?.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </p>
                {(() => {
                  // Get institution from role-specific data
                  const extendedUser = user as any;
                  let institution = '';
                  
                  if (extendedUser?.userRole === 'INNOVATOR' && extendedUser?.innovator?.institution) {
                    institution = extendedUser.innovator.institution;
                  } else if (extendedUser?.userRole === 'MENTOR' && extendedUser?.mentor?.organization) {
                    institution = extendedUser.mentor.organization;
                  } else if (extendedUser?.userRole === 'OTHER' && extendedUser?.other?.workplace) {
                    institution = extendedUser.other.workplace;
                  } else if (extendedUser?.faculty?.institution) {
                    institution = extendedUser.faculty.institution;
                  }
                  
                  return institution ? (
                    <p className="text-sm text-gray-500 mt-1">{institution}</p>
                  ) : null;
                })()}
              </div>
            </div>
            <Button
              onClick={() => setIsProfileEditorOpen(true)}
              size="sm"
              variant="ghost"
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Show pending approval status for mentors */}
      {(user?.hasMentorApplication && !user?.isMentorApproved) && (
        <div className="p-4 mb-6 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="flex items-center text-yellow-800 font-medium">
            <AlertCircle className="w-5 h-5 mr-2" /> Mentor Approval Pending
          </h3>
          <p className="text-yellow-700 mt-1">
            Your mentor application is pending approval. You&apos;ll have full access to mentor features once approved.
          </p>
        </div>
      )}
      
      {/* Show message for users whose mentor application was rejected */}
      {user?.userRole === "OTHER" && user?.mentorRejectionReason && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-md">
          <h3 className="flex items-center text-red-800 font-medium">
            <XCircle className="w-5 h-5 mr-2" /> Mentor Application Rejected
          </h3>
          <p className="text-red-700 mt-1">
            Your mentor application was not approved. Reason: {user.mentorRejectionReason || "No reason provided."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white hover:bg-red-50 border-red-200 text-red-700"
              onClick={() => window.location.href = "/contact-admin"}>
              Contact Admin
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white hover:bg-red-50 border-red-200 text-red-700"
              onClick={() => window.location.href = "/apply-mentor"}>
              Apply Again as Mentor
            </Button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Lightbulb className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-lg">Your Ideas</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.ideasCount}</p>
          <p className="text-sm text-gray-600 mt-1">Ideas you&apos;ve created</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-2 rounded-full mr-3">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-lg">Collaborations</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.collaborationsCount}</p>
          <p className="text-sm text-gray-600 mt-1">Projects you&apos;re contributing to</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-lg">Mentorships</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.mentorshipsCount}</p>
          <p className="text-sm text-gray-600 mt-1">
            {user?.userRole === "MENTOR" ? "Projects you're mentoring" : "Projects where you have mentors"}
          </p>
        </div>
      </div>
      
      {/* Add more dashboard content here based on user role */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="flex items-center justify-center space-x-2 h-12"
            onClick={() => window.location.href = "/submit-idea"}
          >
            <Lightbulb className="h-5 w-5" />
            <span>Submit New Idea</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-center space-x-2 h-12"
            onClick={() => window.location.href = "/ideas"}
          >
            <User className="h-5 w-5" />
            <span>Browse Ideas</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center justify-center space-x-2 h-12"
            onClick={() => window.location.href = "/mentors"}
          >
            <Briefcase className="h-5 w-5" />
            <span>Find Mentors</span>
          </Button>
        </div>
      </div>

      {/* Profile Editor Modal */}
      <ProfileEditor
        isOpen={isProfileEditorOpen}
        onClose={() => setIsProfileEditorOpen(false)}
        onSave={() => {
          // Profile editor handles the save and user refresh
          console.log('Profile saved successfully');
        }}
      />
    </div>
  );
}