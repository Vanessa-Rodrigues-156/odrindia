"use client"

import { useState, useEffect } from "react"
import { CheckSquare, Plus, Trash2, Square, CheckSquareIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: Date
}

interface TodoListProps {
  ideaId?: string;
}

export function TodoList({ ideaId }: TodoListProps) {
  const [todos, setTodos] = useState<TodoItem[]>([
    { 
      id: "1",
      text: "Research ideas for implementation",
      completed: false,
      createdAt: new Date()
    },
    { 
      id: "2",
      text: "Set up initial meeting with stakeholders",
      completed: true,
      createdAt: new Date(Date.now() - 86400000) // 1 day ago
    }
  ])
  
  const [newTodo, setNewTodo] = useState("")
  const [isSaving, setIsSaving] = useState(false);
  
  // Load todos when component mounts
  useEffect(() => {
    if (ideaId) {
      fetch(`/api/ideas/${ideaId}/workplace`)
        .then(res => res.json())
        .then(data => {
          if (data.workplaceData && data.workplaceData.todos) {
            setTodos(data.workplaceData.todos);
          }
        })
        .catch(error => console.error("Failed to load todos:", error));
    }
  }, [ideaId]);
  
  // Save todos to the server
  const saveTodos = async (updatedTodos: TodoItem[]) => {
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
            todos: updatedTodos,
          }
        }),
      });
    } catch (error) {
      console.error("Error saving todos:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const addTodo = () => {
    if (newTodo.trim() === "") return
    
    const todo: TodoItem = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      createdAt: new Date()
    }
    
    const updatedTodos = [todo, ...todos];
    setTodos(updatedTodos)
    setNewTodo("")
    
    // Save to server
    saveTodos(updatedTodos);
  }
  
  const toggleTodo = (id: string) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    
    // Save to server
    saveTodos(updatedTodos);
  }
  
  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    
    // Save to server
    saveTodos(updatedTodos);
  }

  return (
    <Card className="h-full flex flex-col shadow-sm">
      <CardHeader className="bg-gradient-to-r from-[#0a1e42] to-[#263e69] text-white rounded-t-lg pb-4 pt-5">
        <CardTitle className="flex items-center">
          <CheckSquare className="mr-2 h-5 w-5" /> 
          Task Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-5">
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            placeholder="Add a new task..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1e42] focus:border-transparent transition-all"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') addTodo()
            }}
            aria-label="New task input"
          />
          <button 
            className={`px-4 py-3 bg-[#0a1e42] text-white rounded-md text-sm font-medium hover:bg-[#263e69] flex items-center justify-center min-w-[80px] transition-all ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
            onClick={addTodo}
            disabled={isSaving}
            aria-label="Add task"
          >
            {isSaving ? 'Saving...' : (
              <>
                <Plus className="h-4 w-4 mr-1" /> Add
              </>
            )}
          </button>
        </div>
        
        <div className="flex flex-col overflow-y-auto flex-1 pr-1">
          {todos.length > 0 ? (
            <>
              {/* Pending todos section */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <h3 className="text-sm font-semibold text-gray-700">PENDING TASKS</h3>
                </div>
                <div className="space-y-2">
                  {todos
                    .filter(todo => !todo.completed)
                    .map(todo => (
                      <div 
                        key={todo.id} 
                        className="flex items-center justify-between py-3 px-4 border border-gray-200 hover:bg-gray-50 rounded-md transition-colors shadow-sm"
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <button
                            onClick={() => toggleTodo(todo.id)}
                            className="h-5 w-5 rounded-sm border flex-shrink-0 flex items-center justify-center hover:bg-gray-100 transition-colors mt-0.5"
                            disabled={isSaving}
                            aria-label={`Mark "${todo.text}" as completed`}
                          >
                            <Square className="h-4 w-4 text-gray-400" />
                          </button>
                          <div>
                            <span className="text-sm font-medium text-gray-800">{todo.text}</span>
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(todo.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteTodo(todo.id)}
                          disabled={isSaving}
                          className="flex-shrink-0 ml-2 p-1 hover:bg-red-50 rounded-md transition-all"
                          aria-label={`Delete task "${todo.text}"`}
                        >
                          <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    ))}
                </div>
                {todos.filter(todo => !todo.completed).length === 0 && (
                  <div className="text-center py-6 text-gray-500 border border-dashed rounded-md text-sm mt-1 bg-gray-50">
                    <p>All tasks completed! Great job.</p>
                  </div>
                )}
              </div>
              
              {/* Completed todos section */}
              <div>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <h3 className="text-sm font-semibold text-gray-700">COMPLETED TASKS</h3>
                </div>
                <div className="space-y-2">
                  {todos
                    .filter(todo => todo.completed)
                    .map(todo => (
                      <div 
                        key={todo.id} 
                        className="flex items-center justify-between py-3 px-4 border border-gray-200 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors shadow-sm opacity-90"
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <button
                            onClick={() => toggleTodo(todo.id)}
                            className="h-5 w-5 rounded-sm flex-shrink-0 flex items-center justify-center bg-[#0a1e42] border-[#0a1e42] mt-0.5"
                            disabled={isSaving}
                            aria-label={`Mark "${todo.text}" as pending`}
                          >
                            <CheckSquareIcon className="h-4 w-4 text-white" />
                          </button>
                          <div>
                            <span className="text-sm line-through text-gray-500">{todo.text}</span>
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(todo.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteTodo(todo.id)}
                          disabled={isSaving}
                          className="flex-shrink-0 ml-2 p-1 hover:bg-red-50 rounded-md transition-all"
                          aria-label={`Delete task "${todo.text}"`}
                        >
                          <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    ))}
                </div>
                {todos.filter(todo => todo.completed).length === 0 && (
                  <div className="text-center py-6 text-gray-500 border border-dashed rounded-md text-sm bg-gray-50">
                    <p>No completed tasks yet.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center py-10 px-4 text-gray-500 border-2 border-dashed rounded-lg w-full bg-gray-50">
                <CheckSquare className="h-10 w-10 text-gray-300 mb-3 mx-auto" />
                <p className="mb-2 font-medium">No tasks yet</p>
                <p className="text-xs text-gray-400">Add some tasks to start tracking your progress</p>
              </div>
            </div>
          )}
        </div>
        
        {isSaving && (
          <div className="text-xs text-center text-gray-500 mt-3 italic">
            Syncing changes...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
