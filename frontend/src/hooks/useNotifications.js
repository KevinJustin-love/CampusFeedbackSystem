import { useState, useEffect, useCallback } from 'react';
import { notificationAPI } from '../api';
import { ACCESS_TOKEN } from '../constants';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 获取未读通知数量
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      setUnreadCount(response.data.unread_count);
    } catch (err) {
      console.error('获取未读通知数量失败:', err);
      setError('获取未读通知数量失败');
    }
  }, []);

  // 获取通知列表
  const fetchNotifications = useCallback(async (isRead = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationAPI.getNotifications(isRead);
      setNotifications(response.data);
    } catch (err) {
      console.error('获取通知列表失败:', err);
      setError('获取通知列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 标记通知为已读
  const markAsRead = useCallback(async (notificationIds) => {
    try {
      await notificationAPI.markAsRead(notificationIds);
      
      // 更新本地状态
      setNotifications(prev => 
        prev.map(notification => 
          notificationIds.includes(notification.id) 
            ? { ...notification, is_read: true }
            : notification
        )
      );
      
      // 更新未读数量
      await fetchUnreadCount();
    } catch (err) {
      console.error('标记通知已读失败:', err);
      setError('标记通知已读失败');
    }
  }, [fetchUnreadCount]);

  // 标记所有通知为已读
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationAPI.markAllAsRead();
      
      // 更新本地状态
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      
      setUnreadCount(0);
    } catch (err) {
      console.error('标记所有通知已读失败:', err);
      setError('标记所有通知已读失败');
    }
  }, []);

  // 初始化时获取未读数量
  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      fetchUnreadCount();
    }
  }, [fetchUnreadCount]);

  // 定期更新未读数量（可选）
  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // 每30秒更新一次

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications,
  };
};