"use client"

import { useState, useEffect } from "react"
import { CalendarIcon } from "lucide-react"
import { format, addDays } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Event {
  id: string
  title: string
  date: Date | string
  type: "meeting" | "deadline" | "other"
}

interface WorkplaceCalendarProps {
  ideaId?: string;
}

export function WorkplaceCalendar({ ideaId }: WorkplaceCalendarProps) {
  const today = new Date()
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Team Discussion",
      date: addDays(today, 1),
      type: "meeting"
    },
    {
      id: "2",
      title: "Idea Submission Deadline",
      date: addDays(today, 5),
      type: "deadline"
    }
  ])
  
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: format(today, "yyyy-MM-dd"),
    type: "meeting" as const
  })

  const [isSaving, setIsSaving] = useState(false);
  
  // Load events when component mounts
  useEffect(() => {
    if (ideaId) {
      fetch(`/api/ideas/${ideaId}/workplace`)
        .then(res => res.json())
        .then(data => {
          if (data.workplaceData && data.workplaceData.events) {
            // Convert date strings back to Date objects
            const loadedEvents = data.workplaceData.events.map((event: Event) => ({
              ...event,
              date: new Date(event.date)
            }));
            setEvents(loadedEvents);
          }
        })
        .catch(error => console.error("Failed to load calendar events:", error));
    }
  }, [ideaId]);
  
  // Save events to the server
  const saveEvents = async (updatedEvents: Event[]) => {
    if (!ideaId) return;
    
    setIsSaving(true);
    try {
      await fetch(`/api/ideas/${ideaId}/workplace`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workplaceData: {
            events: updatedEvents,
          }
        }),
      });
    } catch (error) {
      console.error("Error saving events:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const addEvent = () => {
    if (newEvent.title.trim() === "") return
    
    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: new Date(newEvent.date),
      type: newEvent.type
    }
    
    const updatedEvents = [...events, event];
    setEvents(updatedEvents);
    setNewEvent({
      title: "",
      date: format(today, "yyyy-MM-dd"),
      type: "meeting"
    });
    
    // Save to server
    saveEvents(updatedEvents);
  }
  
  const deleteEvent = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    
    // Save to server
    saveEvents(updatedEvents);
  };

  const getEventTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "meeting": return "bg-blue-100 text-blue-800"
      case "deadline": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-[#0a1e42]">
          <CalendarIcon className="mr-2 h-5 w-5" /> 
          Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add event"
              className="flex-1 px-3 py-2 border rounded-md text-sm"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <input
              type="date"
              className="px-3 py-2 border rounded-md text-sm"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            />
            <select
              className="px-3 py-2 border rounded-md text-sm"
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
            >
              <option value="meeting">Meeting</option>
              <option value="deadline">Deadline</option>
              <option value="other">Other</option>
            </select>
            <button 
              className={`px-3 py-2 bg-[#0a1e42] text-white rounded-md text-sm hover:bg-[#263e69] ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={addEvent}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Add'}
            </button>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-gray-500">Upcoming Events</h3>
            {events.length > 0 ? (
              <div className="space-y-2">
                {events
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(event => (
                    <div key={event.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(event.date), "MMMM d, yyyy")}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                        <button 
                          onClick={() => deleteEvent(event.id)} 
                          className="text-gray-400 hover:text-red-500 ml-2"
                          disabled={isSaving}
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">No upcoming events</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
