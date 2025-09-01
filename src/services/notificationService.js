import { buildApiUrl } from '../config/api';

export const getNotifications = async (userId) => {
  const res = await fetch(`${buildApiUrl('')}/notifications/${userId}`);
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
};

export const markNotificationAsRead = async (notificationId) => {
  const res = await fetch(`${buildApiUrl('')}/notifications/${notificationId}/read`, {
    method: 'PUT'
  });
  if (!res.ok) throw new Error('Failed to mark notification as read');
  return res.json();
};


