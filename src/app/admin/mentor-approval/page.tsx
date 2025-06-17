'use client';

import { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  User, 
  Loader2, 
  AlertCircle, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import axios from 'axios';

// Create an axios interceptor that adds the auth token to each request
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000/api'
});

// Add request interceptor to include auth token in every request
api.interceptors.request.use(config => {
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // If token exists, add it to the request headers
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

type Mentor = {
  id: string;
  name: string;
  email: string;
  country?: string;
  contactNumber?: string;
  mentor: {
    id: string;
    organization?: string;
    mentorType: string;
    role?: string;
    expertise?: string;
    description?: string;
  }
};

export default function MentorApprovalPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [currentMentor, setCurrentMentor] = useState<Mentor | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchPendingMentors();
  }, []);

  const fetchPendingMentors = async () => {
    try {
      setLoading(true);
      console.log('Fetching pending mentors...');
      
      // Log the token for debugging purposes (you can remove this later)
      console.log('Using token:', localStorage.getItem('token') ? 'Token exists' : 'No token found');
      
      const response = await api.get('/admin/approve-mentor');
      console.log('Received mentors data:', response.data);
      setMentors(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch pending mentors:', err);
      // Provide more detailed error information, especially for auth errors
      let errorMessage = 'Please try again later.';
      
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (err.response?.status === 403) {
          errorMessage = 'You do not have permission to access this resource.';
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error;
        }
      }
      
      setError(`Failed to load pending mentors. ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const approveMentor = async (mentorId: string) => {
    try {
      console.log(`Approving mentor: ${mentorId}`);
      await api.post('/admin/approve-mentor', { userId: mentorId });
      // Remove approved mentor from the list
      setMentors(mentors.filter(mentor => mentor.id !== mentorId));
      // Show success message
      alert('Mentor approved successfully');
    } catch (err) {
      console.error('Failed to approve mentor:', err);
      alert(`Failed to approve mentor: ${err instanceof Error ? err.message : 'Please try again.'}`);
    }
  };

  const openRejectModal = (mentor: Mentor) => {
    setCurrentMentor(mentor);
    setRejectionReason('');
    setRejectModalVisible(true);
  };

  const handleRejectConfirm = async () => {
    if (!currentMentor) return;
    
    try {
      console.log(`Rejecting mentor: ${currentMentor.id}, reason: ${rejectionReason || 'None provided'}`);
      await api.post('/admin/approve-mentor/reject', { 
        userId: currentMentor.id,
        reason: rejectionReason 
      });
      // Remove rejected mentor from the list
      setMentors(mentors.filter(mentor => mentor.id !== currentMentor.id));
      setRejectModalVisible(false);
      alert('Mentor application rejected');
    } catch (err) {
      console.error('Failed to reject mentor:', err);
      alert(`Failed to reject mentor: ${err instanceof Error ? err.message : 'Please try again.'}`);
    }
  };

  const toggleDescription = (mentorId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [mentorId]: !prev[mentorId]
    }));
  };

  const getMentorTypeDisplay = (type: string) => {
    const types: Record<string, string> = {
      'TECHNICAL_EXPERT': 'Technical Expert',
      'LEGAL_EXPERT': 'Legal Expert',
      'ODR_EXPERT': 'ODR Expert',
      'CONFLICT_RESOLUTION_EXPERT': 'Conflict Resolution Expert'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-4 my-4 bg-red-50 border border-red-200 rounded-md flex items-start">
        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-red-800">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-2xl font-bold mb-2">Mentor Approval</h1>
      <p className="text-gray-600 mb-6">
        Review and approve mentor applications. Once approved, mentors can be assigned to ideas.
      </p>
      
      {mentors.length === 0 ? (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md flex items-start">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-800">No pending mentor applications</h3>
            <p className="text-blue-700">There are no mentor applications waiting for approval at this time.</p>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-4">{mentors.length} pending application(s)</p>
          <hr className="mb-6" />
          
          {mentors.map(mentor => (
            <div 
              key={mentor.id}
              className="mb-6 border border-gray-200 rounded-md overflow-hidden shadow-sm"
            >
              <div className="p-4">
                <div className="flex items-center">
                  <div className="bg-gray-100 rounded-full p-2 mr-3">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{mentor.name}</h3>
                    <p className="text-gray-600 text-sm">{mentor.email}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md">
                        {getMentorTypeDisplay(mentor.mentor.mentorType)}
                      </span>
                      {mentor.country && (
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md">
                          {mentor.country}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <hr className="my-3" />
                
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Organization:</span> {mentor.mentor.organization || 'Not specified'}
                  </div>
                  
                  {mentor.mentor.role && (
                    <div>
                      <span className="font-medium">Role:</span> {mentor.mentor.role}
                    </div>
                  )}
                  
                  {mentor.mentor.expertise && (
                    <div>
                      <span className="font-medium">Expertise:</span> {mentor.mentor.expertise}
                    </div>
                  )}
                  
                  {mentor.mentor.description && (
                    <div>
                      <div className="font-medium">Reason for joining:</div>
                      <p className={expandedDescriptions[mentor.id] ? '' : 'line-clamp-2'}>
                        {mentor.mentor.description}
                      </p>
                      {mentor.mentor.description.length > 100 && (
                        <button 
                          className="text-blue-600 text-sm flex items-center mt-1"
                          onClick={() => toggleDescription(mentor.id)}
                        >
                          {expandedDescriptions[mentor.id] ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-1" /> Show less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4 mr-1" /> Show more
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 bg-green-500 text-white rounded-md flex items-center hover:bg-green-600 transition-colors"
                  onClick={() => approveMentor(mentor.id)}
                >
                  <Check className="w-4 h-4 mr-2" /> Approve
                </button>
                <button 
                  className="px-4 py-2 bg-white text-red-500 border border-red-300 rounded-md flex items-center hover:bg-red-50 transition-colors"
                  onClick={() => openRejectModal(mentor)}
                >
                  <X className="w-4 h-4 mr-2" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {rejectModalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Reject Mentor Application</h3>
            </div>
            
            <div className="p-4">
              <p>Are you sure you want to reject {currentMentor?.name}&apos;s application?</p>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for rejection (optional):
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  placeholder="Provide a reason for rejecting this application"
                ></textarea>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setRejectModalVisible(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={handleRejectConfirm}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
