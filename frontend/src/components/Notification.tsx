// Notification component for displaying toast messages
import { useEffect, useState } from "react";
import { Notification as NotificationTypeInterface, NotificationType } from "../types";
import { useNotifications } from "../contexts/NotificationContext";

interface NotificationProps {
  notification: NotificationTypeInterface;
  onDismiss: (id: string) => void;
}

interface NotificationContainerProps {
  // Using context now, so these props are optional
  notifications?: NotificationTypeInterface[];
  onDismiss?: (id: string) => void;
}

const notificationColors: Record<NotificationType, string> = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  warning: "bg-yellow-500",
};

const notificationIcons: Record<NotificationType, string> = {
  success: "✅",
  error: "❌",
  info: "\u2139\ufe0f",
  warning: "⚠️",
};

const NotificationComponent = ({ notification, onDismiss }: NotificationProps) => {
  const [isExiting, setIsExiting] = useState(false);

  // Auto-dismiss after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onDismiss(notification.id);
      }, 300); // Wait for exit animation
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [notification.id, notification.duration, onDismiss]);

  // Handle manual dismiss
  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 300);
  };

  if (isExiting) return null;

  return (
    <div
      className={`fixed p-4 rounded-lg text-white shadow-lg transform transition-all duration-300 ${
        notificationColors[notification.type]
      } ${isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}
      style={{ zIndex: 1000, right: 24, bottom: 24 + (notification.id ? parseInt(notification.id) % 10 : 0) * 80 }}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{notificationIcons[notification.type]}</span>
        <span>{notification.message}</span>
        <button
          onClick={handleDismiss}
          className="ml-auto text-white hover:text-gray-200"
          aria-label="Cerrar"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Notification container component that uses context
export const NotificationContainer = ({
  notifications: _notifications,
  onDismiss: _onDismiss,
}: NotificationContainerProps) => {
  const { notifications, dismissNotification } = useNotifications();
  
  // Use context notifications if available, otherwise fall back to props
  const displayNotifications = _notifications || notifications || [];
  const handleDismiss = _onDismiss || dismissNotification;

  return (
    <>
      {displayNotifications.map((notification) => (
        <NotificationComponent
          key={notification.id}
          notification={notification}
          onDismiss={handleDismiss}
        />
      ))}
    </>
  );
};

export const Notification = NotificationComponent;
export default NotificationComponent;
