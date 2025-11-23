import React from 'react';
import { Package, Inbox, Search, AlertCircle, Bell, MessageSquare, CreditCard, MapPin } from 'lucide-react';
import { Button } from './UI';

interface EmptyStateProps {
  icon?: 'package' | 'inbox' | 'search' | 'alert' | 'bell' | 'message' | 'card' | 'location';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  customIcon?: React.ReactNode;
}

const iconMap = {
  package: Package,
  inbox: Inbox,
  search: Search,
  alert: AlertCircle,
  bell: Bell,
  message: MessageSquare,
  card: CreditCard,
  location: MapPin,
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  message,
  actionLabel,
  onAction,
  customIcon,
}) => {
  const Icon = iconMap[icon];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        {customIcon || <Icon className="w-10 h-10 text-gray-400" />}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-sm mb-6">{message}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          size="md"
          fullWidth={false}
          className="mx-auto"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

