import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { Bell, CheckCheck, Wrench, CheckCircle2, UserCheck, Star } from 'lucide-react';

export const OfficerNotificationsPage = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const loadNotifications = async () => {
    if (currentUser) {
      const data = await notificationService.getNotifications(currentUser);
      setNotifications(data);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [currentUser]);

  const handleMarkAsRead = async (id) => {
    await notificationService.markAsRead(id);
    loadNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead(currentUser);
    loadNotifications();
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Dispatch Dispatch Alerts
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Work order assignments, priority escalations, and citizen resolution feedback.
          </p>
        </div>

        {notifications.length > 0 && (
          <Button variant="outline" size="sm" icon={CheckCheck} onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          title="No officer notifications"
          description="You currently have no unread task alerts or dispatch notices."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => (
            <Card
              key={item.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors border-slate-200 ${
                item.isRead ? 'bg-white opacity-80' : 'bg-white shadow-xs border-l-4 border-l-blue-600'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Wrench className="w-4 h-4" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                  <p className="text-[11px] text-slate-400">
                    {new Date(item.createdAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {!item.isRead && (
                <button
                  type="button"
                  onClick={() => handleMarkAsRead(item.id)}
                  className="text-xs text-slate-400 hover:text-blue-600 shrink-0 font-medium"
                >
                  Mark read
                </button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OfficerNotificationsPage;
