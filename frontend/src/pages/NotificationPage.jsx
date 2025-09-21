import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import '../styles/NotificationPage.css';

const NotificationPage = () => {
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const isReadFilter = filter === 'all' ? null : filter === 'read';
    fetchNotifications(isReadFilter);
  }, [filter, fetchNotifications]);

  const handleNotificationClick = async (notification) => {
    // 先标记为已读
    if (!notification.is_read) {
      await markAsRead([notification.id]);
    }
    
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

  const getNotificationTypeText = (type) => {
    switch (type) {
      case 'status_update':
        return '状态更新';
      case 'admin_reply':
        return '管理员回复';
      case 'new_comment':
        return '新评论';
      case 'issue_liked':
        return '问题点赞';
      case 'system':
        return '系统通知';
      default:
        return '通知';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="notification-page">
      <div className="notification-page-header">
        <h1>通知中心</h1>
        <div className="notification-page-controls">
          <div className="filter-buttons">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              全部通知
            </button>
            <button 
              className={filter === 'unread' ? 'active' : ''}
              onClick={() => setFilter('unread')}
            >
              未读通知
            </button>
            <button 
              className={filter === 'read' ? 'active' : ''}
              onClick={() => setFilter('read')}
            >
              已读通知
            </button>
          </div>
          
          {notifications.some(n => !n.is_read) && (
            <button className="mark-all-read-btn" onClick={handleMarkAllRead}>
              全部标为已读
            </button>
          )}
        </div>
      </div>

      <div className="notification-page-content">
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span>加载中...</span>
          </div>
        )}

        {error && (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
            <button onClick={() => fetchNotifications()}>重试</button>
          </div>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div className="empty-container">
            <div className="empty-icon">📭</div>
            <h3>暂无通知</h3>
            <p>
              {filter === 'unread' ? '您没有未读通知' : 
               filter === 'read' ? '您没有已读通知' : 
               '您还没有收到任何通知'}
            </p>
          </div>
        )}

        {!loading && !error && notifications.length > 0 && (
          <div className="notification-page-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-page-item ${!notification.is_read ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-page-icon">
                  {getNotificationIcon(notification.notification_type)}
                </div>
                
                <div className="notification-page-content-body">
                  <div className="notification-page-header-row">
                    <span className="notification-page-type">
                      {getNotificationTypeText(notification.notification_type)}
                    </span>
                    <span className="notification-page-time">
                      {formatTime(notification.created)}
                    </span>
                  </div>
                  
                  <h4 className="notification-page-title">
                    {notification.title}
                  </h4>
                  
                  <p className="notification-page-message">
                    {notification.message}
                  </p>
                  
                  <div className="notification-page-meta">
                    {notification.sender_name && notification.sender_name !== '系统' && (
                      <span className="notification-page-sender">
                        来自: {notification.sender_name}
                      </span>
                    )}
                    {notification.issue_title && (
                      <span className="notification-page-issue">
                        相关问题: {notification.issue_title}
                      </span>
                    )}
                  </div>
                </div>

                {!notification.is_read && (
                  <div className="notification-page-unread-indicator"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;