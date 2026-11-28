
import { useCallback, useEffect, useState } from "react";
import "./AdminNotifications.css";

function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/notifications",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(
          response.status === 403
            ? "Admin access required."
            : "Unable to load notifications."
        );
      }

      const data = await response.json();
      setNotifications(data);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 15000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/notifications/${id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (!response.ok) {
        throw new Error("Unable to mark notification as read.");
      }

      await fetchNotifications();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <div className="notification-wrapper">

      <button
        type="button"
        className="notification-bell"
        onClick={() => setOpen((previous) => !previous)}
        aria-label="Notifications"
      >
        🔔

        {unreadCount > 0 && (
          <span className="notification-count">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-panel">

          <div className="notification-heading">
            <h3>Notifications</h3>

            <button
              type="button"
              onClick={fetchNotifications}
            >
              Refresh
            </button>
          </div>

          {message && (
            <p className="notification-error">
              {message}
            </p>
          )}

          {notifications.length === 0 ? (
            <p className="no-notifications">
              No notifications yet.
            </p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${
                  notification.read ? "read" : "unread"
                }`}
              >
                <p>{notification.message}</p>

                <small>
                  {notification.createdAt
                    ? new Date(
                        notification.createdAt
                      ).toLocaleString("en-IN")
                    : "Date unavailable"}
                </small>

                {!notification.read && (
                  <button
                    type="button"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as Read
                  </button>
                )}

                {notification.read && (
                  <span className="read-label">
                    Read
                  </span>
                )}
              </div>
            ))
          )}

        </div>
      )}
    </div>
  );
}

export default AdminNotifications;
