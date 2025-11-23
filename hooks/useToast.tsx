import React, { useState, useCallback } from 'react';
import { Toast, ToastContainer } from '../components/Toast';

interface ToastData {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <>
      {children}
      {toasts.length > 0 && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
          {toasts.map((toast, index) => (
            <div
              key={toast.id}
              className="animate-slide-down"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => removeToast(toast.id)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );

  return { showToast, removeToast, ToastProvider };
};

