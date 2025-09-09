import React, { useState } from "react";
import {
  X,
  Clock,
  MessageCircle,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import "../styles/MessagePage.css";

const NotificationPanel = ({
  isOpen,
  onClose,
  notifications = [],
  onNotificationClick,
  onMarkAllAsRead,
}) => {
  const [activeTab, setActiveTab] = useState("all");

  if (!isOpen) return null;

  // 计算未读消息数量
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // 过滤消息 based on active tab
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.isRead;
    return notification.type === activeTab;
  });

  // 获取消息类型图标
  const getNotificationIcon = (type) => {
    switch (type) {
      case "status":
        return <Clock size={18} className="notification-type-icon status" />;
      case "reply":
        return (
          <MessageCircle size={18} className="notification-type-icon reply" />
        );
      case "system":
        return (
          <AlertCircle size={18} className="notification-type-icon system" />
        );
      default:
        return (
          <CheckCircle size={18} className="notification-type-icon default" />
        );
    }
  };

  // 处理单个消息点击
  const handleNotificationClick = (notification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    onClose();
  };

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div className="notification-panel" onClick={(e) => e.stopPropagation()}>
        <div className="notification-header">
          <h2>消息通知</h2>
          <div className="header-actions">
            {unreadCount > 0 && (
              <span className="unread-count">{unreadCount} 条未读</span>
            )}
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="notification-tabs">
          <button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            全部消息
          </button>
          <button
            className={activeTab === "unread" ? "active" : ""}
            onClick={() => setActiveTab("unread")}
          >
            未读消息
          </button>
          <button
            className={activeTab === "status" ? "active" : ""}
            onClick={() => setActiveTab("status")}
          >
            状态更新
          </button>
        </div>

        {unreadCount > 0 && (
          <div className="notification-actions">
            <button className="mark-all-read" onClick={onMarkAllAsRead}>
              标记所有为已读
            </button>
          </div>
        )}

        <div className="notification-list">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>没有{activeTab !== "all" ? "相关" : ""}消息</p>
              <span className="empty-subtext">
                当有新的消息时，会在这里显示
              </span>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${
                  notification.isRead ? "" : "unread"
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-title">
                    <span className="problem-title">
                      {notification.problemTitle}
                    </span>
                    {!notification.isRead && (
                      <span className="unread-badge">未读</span>
                    )}
                  </div>
                  <div className="notification-message">
                    {notification.content}
                  </div>
                  <div className="notification-meta">
                    <span className="notification-time">
                      {notification.time}
                    </span>
                    <span className="problem-id">
                      问题ID: {notification.problemId}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="notification-footer">
          <span className="footer-text">问题反馈系统 · 消息中心</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
