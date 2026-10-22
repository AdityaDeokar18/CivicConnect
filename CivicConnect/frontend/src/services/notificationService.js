import api from './api';

export const notificationService = {
  getNotifications: async (recipient = null) => {
    try {
      const data = await api.get('/notifications');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Error fetching notifications:', err);
      return [];
    }
  },

  getNotificationsForRole: async (role = 'ROLE_ADMIN') => {
    try {
      const data = await api.get('/notifications');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Error fetching role notifications:', err);
      return [];
    }
  },

  markAsRead: async (id) => {
    try {
      return await api.put(`/notifications/${id}/read`);
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return null;
    }
  },

  markAllAsRead: async (recipient = null) => {
    try {
      return await api.put('/notifications/read-all');
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return null;
    }
  },

  // Client-side helper kept for compatibility if called
  createNotification: (notification) => {
    return notification;
  }
};

export default notificationService;
