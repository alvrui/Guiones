// Notification context for global notification management
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Notification as NotificationType } from "../types";

interface NotificationContextType {
  notifications: NotificationType[];
  addNotification: (type: NotificationType["type"], message: string, duration?: number) => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  // Add a new notification
  const addNotification = useCallback((
    type: NotificationType["type"],
    message: string,
    duration?: number
  ) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, type, message, duration }]);
  }, []);

  // Dismiss a notification by ID
  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        dismissNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export default NotificationContext;
