'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { AlertCircle, User, Briefcase, Lightbulb, XCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
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
    <div className="max-w-5xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Show pending approval status for mentors */}
      {user?.userRole === "MENTOR" && !user?.isMentorApproved && (
        <div className="p-4 mb-6 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="flex items-center text-yellow-800 font-medium">
            <AlertCircle className="w-5 h-5 mr-2" /> Mentor Approval Pending
          </h3>
          <p className="text-yellow-700 mt-1">
            Your mentor account is pending approval. You&apos;ll have full access to mentor features once approved.
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
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}</h2>
        <p className="text-gray-700">
          This is your personal dashboard where you can track your activity and progress on the ODR Lab platform. 
        </p>
      </div>
    </div>
  );
}