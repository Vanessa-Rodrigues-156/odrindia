"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { Calendar, Clock, Users, FileText, CalendarPlus, Play, FileEdit } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from 'date-fns'

interface MeetingLogsProps {
  ideaId: string;
}

interface Meeting {
  id: string;
  title: string;
  startTime: string;
  endTime?: string;
  status: string;
  createdBy: {
    id: string;
    name: string;
  };
  _count: {
    participants: number;
    notes: number;
  };
}

export function MeetingLogs({ ideaId }: MeetingLogsProps) {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // New meeting form state
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);
  const [newMeetingTitle, setNewMeetingTitle] = useState("");
  const [newMeetingDate, setNewMeetingDate] = useState("");
  const [newMeetingTime, setNewMeetingTime] = useState("");
  
  // Fetch meetings for the idea
  useEffect(() => {
    if (ideaId) {
      fetchMeetings();
    }
  }, [ideaId]);
  
  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/meetings/idea/${ideaId}`, {
        headers: {
          'x-auth-user': user ? encodeURIComponent(JSON.stringify(user)) : '',
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch meetings");
      }
      const data = await response.json();
      setMeetings(data);
    } catch (err) {
      console.error("Error fetching meetings:", err);
      setError("Failed to load meetings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateMeeting = async () => {
    if (!newMeetingTitle || !newMeetingDate || !newMeetingTime) {
      setError("Please fill in all fields");
      return;
    }
    
    try {
      // Combine date and time for the startTime
      const startTime = new Date(`${newMeetingDate}T${newMeetingTime}`);
      
      const response = await fetch("/api/meetings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'x-auth-user': user ? encodeURIComponent(JSON.stringify(user)) : '',
        },
        body: JSON.stringify({
          title: newMeetingTitle,
          ideaId,
          startTime: startTime.toISOString(),
          jitsiRoomName: `idea-${ideaId}`
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create meeting");
      }
      
      // Reset form and fetch updated meetings
      setNewMeetingTitle("");
      setNewMeetingDate("");
      setNewMeetingTime("");
      setIsCreatingMeeting(false);
      fetchMeetings();
    } catch (err) {
      console.error("Error creating meeting:", err);
      setError("Failed to create meeting. Please try again.");
    }
  };
  
  const getMeetingStatusClass = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-600";
      case "IN_PROGRESS":
        return "bg-green-100 text-green-600";
      case "COMPLETED":
        return "bg-gray-100 text-gray-600";
      case "CANCELLED":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };
  
  const formatMeetingDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Meeting Logs</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsCreatingMeeting(true)}
        >
          <CalendarPlus className="h-4 w-4 mr-1" /> Schedule Meeting
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-100 p-2 rounded text-red-600 text-sm">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center p-4">
          <div className="animate-spin h-6 w-6 border-2 border-[#0a1e42] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading meetings...</p>
        </div>
      ) : meetings.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 rounded-lg border border-dashed">
          <Calendar className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <h3 className="text-gray-600 font-medium mb-1">No meetings yet</h3>
          <p className="text-gray-500 text-sm mb-3">Schedule your first meeting to collaborate with your team.</p>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => setIsCreatingMeeting(true)}
          >
            <CalendarPlus className="h-4 w-4 mr-1" /> Schedule Meeting
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="p-3 border rounded-lg bg-white shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-[#0a1e42]">{meeting.title}</h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatMeetingDate(meeting.startTime)}
                    {meeting.endTime && (
                      <span className="ml-1">
                        to {formatMeetingDate(meeting.endTime)}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getMeetingStatusClass(meeting.status)}`}>
                  {meeting.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-3 pt-2 border-t">
                <div className="flex space-x-4">
                  <div className="flex items-center text-xs text-gray-600">
                    <Users className="h-3 w-3 mr-1" />
                    {meeting._count.participants} participant{meeting._count.participants !== 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <FileText className="h-3 w-3 mr-1" />
                    {meeting._count.notes} note{meeting._count.notes !== 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDistanceToNow(new Date(meeting.startTime), { addSuffix: true })}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Link href={`/discussion/${ideaId}/meetings/${meeting.id}`}>
                    <Button variant="outline" size="sm" className="text-xs px-2">
                      <FileEdit className="h-3 w-3 mr-1" /> View Details
                    </Button>
                  </Link>
                  {meeting.status === "SCHEDULED" && (
                    <Link href={`/discussion/${ideaId}/meetings/${meeting.id}`}>
                      <Button variant="default" size="sm" className="text-xs px-2 bg-[#0a1e42] hover:bg-[#0a1e42]/90">
                        <Play className="h-3 w-3 mr-1" /> Join
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Create Meeting Dialog */}
      <Dialog open={isCreatingMeeting} onOpenChange={setIsCreatingMeeting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule a New Meeting</DialogTitle>
            <DialogDescription>
              Enter the details for your meeting. You can schedule it now and start it later.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Meeting Title</label>
              <Input
                id="title"
                value={newMeetingTitle}
                onChange={(e) => setNewMeetingTitle(e.target.value)}
                placeholder="Enter meeting title"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <Input
                  id="date"
                  type="date"
                  value={newMeetingDate}
                  onChange={(e) => setNewMeetingDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <Input
                  id="time"
                  type="time"
                  value={newMeetingTime}
                  onChange={(e) => setNewMeetingTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 p-2 rounded text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingMeeting(false)}>Cancel</Button>
            <Button onClick={handleCreateMeeting}>Create Meeting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
