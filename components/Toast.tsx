import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = 'info', 
  duration = 3000,
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  };

  const Icon = icons[type];

  return (
    <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down ${colors[type]} border-2 rounded-2xl px-6 py-4 shadow-2xl flex items-center space-x-3 min-w-[280px] max-w-[90vw]`}>
      <Icon className={`${iconColors[type]} flex-shrink-0`} size={20} />
      <p className="font-semibold text-sm flex-1">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity touch-feedback active:scale-95"
      >
        <X size={16} className={iconColors[type]} />
      </button>
    </div>
  );
};

// Toast Container
interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type?: 'success' | 'error' | 'warning' | 'info' }>;
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
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
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

// Toast Hook
export const useToast = () => {
  const [toasts, setToasts] = React.useState<Array<{ id: string; message: string; type?: 'success' | 'error' | 'warning' | 'info' }>>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, showToast, removeToast };
};

