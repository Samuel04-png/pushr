import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Notification } from '../components/NotificationCenter';

interface NotificationContextType {
  showNotificationCenter: boolean;
  setShowNotificationCenter: (show: boolean) => void;
  unreadCount: number;
  notifications: Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [notifications] = useState<Notification[]>([]); // Would come from backend
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      showNotificationCenter,
      setShowNotificationCenter,
      unreadCount,
      notifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    return {
      showNotificationCenter: false,
      setShowNotificationCenter: () => {},
      unreadCount: 0,
      notifications: [],
    };
  }
  return context;
};

