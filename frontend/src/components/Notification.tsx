// Notification component for displaying toast messages
import { useEffect, useState } from "react";
import { Notification, NotificationType } from "../types";

interface NotificationProps {
  notification: Notification;
  onDismiss: (id: string) => void;
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
  info: "ℹ️",
  warning: "⚠️",
};

export const Notification = ({ notification, onDismiss }: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);
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

  if (!isVisible && !isExiting) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg text-white shadow-lg transform transition-all duration-300 ${
        notificationColors[notification.type]
      } ${isExiting ? "translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}
      style={{ zIndex: 1000 }}
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

// Notification container component
interface NotificationContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export const NotificationContainer = ({
  notifications,
  onDismiss,
}: NotificationContainerProps) => {
  return (
    <>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onDismiss={onDismiss}
        />
      ))}
    </>
  );
};

export default Notification;
