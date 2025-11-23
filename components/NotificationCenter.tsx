import React, { useState, useEffect } from 'react';
import { Sheet, Badge, Button, Card } from './UI';
import { Bell, X, CheckCircle2, AlertCircle, Info, Package, MapPin, DollarSign, Star, Sparkles } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'order' | 'payment' | 'system' | 'promotion';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order Delivered!',
    message: 'Your delivery from Garden City to UNILUS has been completed.',
    timestamp: Date.now() - 300000,
    read: false,
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Received',
    message: 'K45 has been added to your wallet.',
    timestamp: Date.now() - 3600000,
    read: false,
  },
  {
    id: '3',
    type: 'promotion',
    title: 'Special Offer',
    message: 'Get 20% off on your next delivery. Use code PUSH20.',
    timestamp: Date.now() - 7200000,
    read: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'App Update',
    message: 'New features available! Update now.',
    timestamp: Date.now() - 86400000,
    read: true,
  },
];

export const NotificationCenter = ({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    if ('vibrate' in navigator) navigator.vibrate(10);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if ('vibrate' in navigator) navigator.vibrate(20);
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if ('vibrate' in navigator) navigator.vibrate(15);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <Package className="text-pushr-blue" size={20} />;
      case 'payment':
        return <DollarSign className="text-pushr-success" size={20} />;
      case 'promotion':
        return <Sparkles className="text-pushr-accent" size={20} />;
      default:
        return <Info className="text-gray-600" size={20} />;
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications"
      size="lg"
    >
      <div className="space-y-4">
        {/* Header Actions */}
        {unreadCount > 0 && (
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <p className="text-sm text-gray-600">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
            <Button
              variant="ghost"
              size="sm"
              fullWidth={false}
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          </div>
        )}

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                variant={notification.read ? 'default' : 'elevated'}
                className={`!p-4 relative touch-feedback active:scale-98 ${
                  !notification.read ? 'border-l-4 border-l-pushr-blue' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    !notification.read 
                      ? 'bg-pushr-blue/10' 
                      : 'bg-gray-100'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className={`font-bold text-sm sm:text-base ${
                        !notification.read ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-pushr-blue rounded-full flex-shrink-0 mt-1.5 ml-2"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {formatTime(notification.timestamp)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors touch-feedback active:scale-95"
                      >
                        <X size={14} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card variant="outlined" className="!p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No notifications</p>
            <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
          </Card>
        )}
      </div>
    </Sheet>
  );
};

export const NotificationBell = ({ 
  onClick, 
  unreadCount 
}: { 
  onClick: () => void; 
  unreadCount: number;
}) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-full hover:bg-gray-100 transition-colors touch-feedback active:scale-95"
    >
      <Bell size={22} className="text-gray-700" />
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-pushr-danger rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <span className="text-white text-[10px] font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        </div>
      )}
    </button>
  );
};

