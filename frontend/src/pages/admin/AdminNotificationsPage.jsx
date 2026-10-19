import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { notificationService } from '../../services/notificationService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { Bell, CheckCheck, Clock, ArrowRight, AlertTriangle } from 'lucide-react';

export const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState(
    notificationService.getNotificationsForRole('ROLE_ADMIN')
  );

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead('ROLE_ADMIN');
    setNotifications(notificationService.getNotificationsForRole('ROLE_ADMIN'));
  };

  const handleMarkRead = (id) => {
    notificationService.markAsRead(id);
    setNotifications(notificationService.getNotificationsForRole('ROLE_ADMIN'));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
            System Alerts
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Admin Notifications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time event logs, officer assignment alerts, and grievance workflow updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} icon={CheckCheck}>
            Mark All as Read ({unreadCount})
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="p-12">
          <EmptyState
            icon={Bell}
            title="No Notifications"
            description="System notifications will appear here in real-time when citizens file issues, officers upload proof, or tickets are closed."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={`p-4 transition-colors ${
                !n.isRead
                  ? 'bg-purple-50/40 border-purple-200'
                  : 'bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 ${
                    !n.isRead
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-800">{n.title}</h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-purple-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600">{n.message}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(n.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {n.complaintId && (
                    <Link to={`/admin/complaints/${n.complaintId}`}>
                      <Button variant="ghost" size="sm" className="text-purple-700 text-xs">
                        View Grievance <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  )}
                  {!n.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkRead(n.id)}
                      className="text-xs text-slate-400 hover:text-slate-600 p-1 rounded"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNotificationsPage;
