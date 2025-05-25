"use client"

import { useState, useEffect } from "react"
import { StickyNoteIcon, Save, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Note {
  id: string
  content: string
  lastModified: Date
}

interface NoteTakingProps {
  ideaId?: string;
}

export function NoteTaking({ ideaId }: NoteTakingProps) {
  const [notes, setNotes] = useState<Note[]>([
    { 
      id: "1", 
      content: "Initial brainstorming session for idea implementation.", 
      lastModified: new Date() 
    }
  ])
  
  const [activeNoteId, setActiveNoteId] = useState<string | null>("1")
  const [activeNoteContent, setActiveNoteContent] = useState(notes[0].content)
  const [isSaving, setIsSaving] = useState(false);
  
  // Load notes when component mounts
  useEffect(() => {
    if (ideaId) {
      fetch(`/api/ideas/${ideaId}/workplace`, {
        credentials: 'include', // Include cookies for authentication
      })
        .then(res => res.json())
        .then(data => {
          if (data.workplaceData && data.workplaceData.notes) {
            setNotes(data.workplaceData.notes);
            if (data.workplaceData.notes.length > 0) {
              setActiveNoteId(data.workplaceData.notes[0].id);
              setActiveNoteContent(data.workplaceData.notes[0].content);
            }
          }
        })
        .catch(error => console.error("Failed to load notes:", error));
    }
  }, [ideaId]);
  
  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: "",
      lastModified: new Date()
    }
    setNotes([...notes, newNote])
    setActiveNoteId(newNote.id)
    setActiveNoteContent("")
  }
  
  const saveActiveNote = async () => {
    if (!activeNoteId) return
    
    const updatedNotes = notes.map(note => 
      note.id === activeNoteId 
        ? { ...note, content: activeNoteContent, lastModified: new Date() } 
        : note
    );
    
    setNotes(updatedNotes);
    setIsSaving(true);
    
    // Save to the server if ideaId is provided
    if (ideaId) {
      try {
        const response = await fetch(`/api/ideas/${ideaId}/workplace`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for authentication
          body: JSON.stringify({
            workplaceData: {
              notes: updatedNotes,
            }
          }),
        });
        
        if (!response.ok) {
          console.error("Failed to save notes");
        }
      } catch (error) {
        console.error("Error saving notes:", error);
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsSaving(false);
    }
  }
  
  const deleteNote = (id: string) => {
    const remainingNotes = notes.filter(note => note.id !== id);
    setNotes(remainingNotes);
    
    if (activeNoteId === id) {
      if (remainingNotes.length > 0) {
        setActiveNoteId(remainingNotes[0].id);
        setActiveNoteContent(remainingNotes[0].content);
      } else {
        setActiveNoteId(null);
        setActiveNoteContent("");
      }
    }
    
    // Save the deletion to the server
    if (ideaId) {
      fetch(`/api/ideas/${ideaId}/workplace`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          workplaceData: {
            notes: remainingNotes,
          }
        }),
      }).catch(error => console.error("Failed to save note deletion:", error));
    }
  }
  
  const selectNote = (id: string) => {
    const selectedNote = notes.find(note => note.id === id)
    if (selectedNote) {
      setActiveNoteId(id)
      setActiveNoteContent(selectedNote.content)
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 md:pb-4">
        <CardTitle className="flex items-center text-[#0a1e42]">
          <StickyNoteIcon className="mr-2 h-5 w-5" /> 
          Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={createNewNote}
            className="text-xs sm:text-sm"
          >
            New Note
          </Button>
          {activeNoteId && (
            <Button 
              variant="default" 
              size="sm" 
              className="bg-[#0a1e42] hover:bg-[#263e69] text-xs sm:text-sm"
              onClick={saveActiveNote}
              disabled={isSaving}
            >
              {isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Save
                </>
              )}
            </Button>
          )}
        </div>
        
        {/* Layout that switches from vertical (mobile) to horizontal (desktop) */}
        <div className="flex flex-col md:flex-row gap-4 flex-1 overflow-hidden">
          {/* Note list - full width on mobile, 1/3 on desktop */}
          <div className="md:w-1/3 w-full overflow-y-auto border rounded-md h-[200px] md:h-auto">
            {notes.length > 0 ? (
              notes.map(note => (
                <div 
                  key={note.id} 
                  className={`p-2 border-b cursor-pointer flex items-center justify-between ${activeNoteId === note.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  onClick={() => selectNote(note.id)}
                >
                  <div className="truncate flex-1">
                    <div className="font-medium text-sm">
                      {note.content.substring(0, 20) || "Empty note..."}
                      {note.content.length > 20 && "..."}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(note.lastModified).toLocaleDateString()}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0" 
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNote(note.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No notes yet. Create one to get started!
              </div>
            )}
          </div>
          
          {/* Note content - full width on mobile, 2/3 on desktop */}
          <div className="md:w-2/3 w-full flex-1 flex flex-col">
            <Textarea
              placeholder="Start typing your note here..."
              value={activeNoteContent}
              onChange={(e) => setActiveNoteContent(e.target.value)}
              className="flex-1 min-h-[200px] md:min-h-0 text-sm resize-none"
              disabled={activeNoteId === null}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
