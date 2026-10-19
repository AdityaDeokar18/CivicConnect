import { mockNotifications } from '../data/mockNotifications';

const NOTIFICATIONS_KEY = 'civicconnect_notifications';

const initializeNotifications = () => {
  if (localStorage.getItem(NOTIFICATIONS_KEY) === null) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(mockNotifications || []));
  }
};

export const notificationService = {
  getNotifications: (recipient) => {
    initializeNotifications();
    const list = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
    if (!recipient) return [];

    return list.filter(n => {
      // Check recipient by user ID or user role or email
      if (n.recipientId && recipient.id && String(n.recipientId) === String(recipient.id)) return true;
      if (n.recipientEmail && recipient.email && n.recipientEmail.toLowerCase() === recipient.email.toLowerCase()) return true;
      if (n.recipientRole && recipient.role && n.recipientRole === recipient.role) return true;
      return false;
    });
  },

  markAsRead: (id) => {
    initializeNotifications();
    const list = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
    const index = list.findIndex(n => n.id === id);
    if (index !== -1) {
      list[index].isRead = true;
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
      return list[index];
    }
    return null;
  },

  markAllAsRead: (recipient) => {
    initializeNotifications();
    const list = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
    const updated = list.map(n => {
      const match =
        (n.recipientId && recipient?.id && String(n.recipientId) === String(recipient.id)) ||
        (n.recipientEmail && recipient?.email && n.recipientEmail.toLowerCase() === recipient.email.toLowerCase()) ||
        (n.recipientRole && recipient?.role && n.recipientRole === recipient.role);

      if (match) {
        return { ...n, isRead: true };
      }
      return n;
    });
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    return updated;
  },

  createNotification: (notification) => {
    initializeNotifications();
    const list = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
    const newNotif = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      recipientId: notification.recipientId || null,
      recipientEmail: notification.recipientEmail || null,
      recipientRole: notification.recipientRole || null,
      complaintId: notification.complaintId || null,
      complaintRefNo: notification.complaintRefNo || null,
      type: notification.type || 'INFO', // 'SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'OFFICER_REGISTRATION'
      title: notification.title,
      message: notification.message,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    list.unshift(newNotif);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(list));
    return newNotif;
  }
};

export default notificationService;
