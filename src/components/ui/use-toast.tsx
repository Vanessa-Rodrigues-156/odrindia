'use client'
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type ToastVariant = 'default' | 'destructive' | 'success';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (props: { title: string; description?: string; variant?: ToastVariant }) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Define dismissToast with useCallback to prevent unnecessary re-renders
  const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  // Define toast function with useCallback to prevent unnecessary re-renders
  const toast = useCallback(({ title, description, variant = 'default' }: { title: string; description?: string; variant?: ToastVariant }) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Update toasts state with the new toast
    setToasts((prevToasts) => [...prevToasts, { id, title, description, variant }]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 5000);
    
    return id; // Return id so callers can dismiss manually if needed
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismissToast }}>
      {children}
      {/* Render toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-lg shadow-lg p-4 min-w-[300px] animate-in slide-in-from-right-5 ${
              t.variant === 'destructive' ? 'bg-red-100 border-l-4 border-red-500' :
              t.variant === 'success' ? 'bg-green-100 border-l-4 border-green-500' :
              'bg-white border-l-4 border-sky-500'
            }`}
          >
            <div className="flex justify-between">
              <h3 className={`font-medium ${t.variant === 'destructive' ? 'text-red-800' : t.variant === 'success' ? 'text-green-800' : 'text-[#0a1e42]'}`}>
                {t.title}
              </h3>
              <button onClick={() => dismissToast(t.id)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            {t.description && (
              <p className="mt-1 text-sm text-gray-600">{t.description}</p>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
