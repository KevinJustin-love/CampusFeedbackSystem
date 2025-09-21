import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import '../styles/NotificationModal.css';

const NotificationModal = ({ isOpen, onClose, adminFilter = false }) => {
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  } = useNotifications(adminFilter);

  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  useEffect(() => {
    if (isOpen) {
      const isReadFilter = filter === 'all' ? null : filter === 'read';
      fetchNotifications(isReadFilter);
    }
  }, [isOpen, filter, fetchNotifications]);

  const handleNotificationClick = async (notification) => {
    // 先标记为已读
    if (!notification.is_read) {
      await markAsRead([notification.id]);
    }
    
    // 关闭通知弹窗
    onClose();
    
    // 如果通知关联了问题，跳转到问题详情页
    if (notification.issue) {
      navigate(`/detail/${notification.issue}`);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    // 重新获取通知列表
    const isReadFilter = filter === 'all' ? null : filter === 'read';
    fetchNotifications(isReadFilter);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'status_update':
        return '📋';
      case 'admin_reply':
        return '💬';
      case 'new_comment':
        return '💭';
      case 'issue_liked':
        return '👍';
      case 'system':
        return '🔔';
      default:
        return '📢';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}分钟前`;
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}天前`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="notification-modal-overlay" onClick={onClose}>
      <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
        <div className="notification-header">
          <h3>通知中心</h3>
          <button className="close-button" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="notification-controls">
          <div className="filter-buttons">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              全部
            </button>
            <button 
              className={filter === 'unread' ? 'active' : ''}
              onClick={() => setFilter('unread')}
            >
              未读
            </button>
            <button 
              className={filter === 'read' ? 'active' : ''}
              onClick={() => setFilter('read')}
            >
              已读
            </button>
          </div>
          
          {notifications.some(n => !n.is_read) && (
            <button className="mark-all-read-button" onClick={handleMarkAllRead}>
              全部标为已读
            </button>
          )}
        </div>

        <div className="notification-content">
          {loading && (
            <div className="loading">
              <div className="loading-spinner"></div>
              <span>加载中...</span>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {!loading && !error && notifications.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>暂无通知</p>
            </div>
          )}

          {!loading && !error && notifications.length > 0 && (
            <div className="notification-list">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.notification_type)}
                  </div>
                  
                  <div className="notification-body">
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-meta">
                      <span className="notification-time">
                        {formatTime(notification.created)}
                      </span>
                      {notification.sender_name && notification.sender_name !== '系统' && (
                        <span className="notification-sender">
                          来自: {notification.sender_name}
                        </span>
                      )}
                    </div>
                  </div>

                  {!notification.is_read && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;