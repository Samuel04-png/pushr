import React from 'react';
import { Skeleton } from './UI';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  type?: 'skeleton' | 'spinner' | 'pulse';
  message?: string;
  fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'spinner',
  message,
  fullScreen = false,
}) => {
  if (type === 'skeleton') {
    return (
      <div className={fullScreen ? 'min-h-screen p-4 sm:p-6 space-y-4' : 'space-y-4'}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton width="60%" height="20px" />
            <Skeleton width="100%" height="60px" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-12'}`}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-pushr-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
          {message && <p className="text-gray-600 font-medium">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-12'}`}>
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 text-pushr-blue animate-spin mx-auto" />
        {message && <p className="text-gray-600 font-medium animate-pulse">{message}</p>}
      </div>
    </div>
  );
};

// Loading Card Component
export const LoadingCard: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-5 border border-gray-200 space-y-3 animate-pulse"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="h-3 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
};

