import React, { useState } from "react";
import HistoryModal from "../pages/HistoryModal";
import FavoritesModal from "../pages/FavoritesModal";
import NotificationModal from "./NotificationModal";
import { useNotifications } from "../hooks/useNotifications";

import "../styles/Navbar.css";

export default function Navbar({ onSearch }) {
  const { unreadCount } = useNotifications();
  //消息栏图标
  function MessageBar() {
    return (
      <span
        className="message-bar"
        style={{ cursor: "pointer" }}
      >
        <svg
          className="envelope-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        {/* 显示未读消息数量的小红点 */}
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </span>
    );
  }

  //历史记录图标
  function ClockIcon({ size = 24, stroke = "currentColor", className = "", onClick }) {
    return (
      <span
        className="clock-icon-container"
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          className={`clock-icon ${className}`} // 合并类名
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </span>
    );
  }

  //收藏夹图标
  function StarIcon({ filled = false, color = "gold", size = 24, onClick }) {
    return (
      <span
        className="star-icon-container"
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={filled ? color : "none"}
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="star-icon"
        >
          {/* 五角星路径 */}
          <path d="M12 2L14.47 8.53L21 9.27L16.24 14.25L17.47 21L12 17.77L6.53 21L7.76 14.25L3 9.27L9.53 8.53L12 2Z" />
        </svg>
      </span>
    );
  }

  //搜索栏
  function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
      if (searchQuery.trim()) {
        // 调用父组件的搜索处理函数
        if (onSearch) {
          onSearch(searchQuery);
        }
      }
    };

    const handleClearSearch = () => {
      setSearchQuery('');
      // 清除搜索，回到显示全部问题状态
      if (onSearch) {
        onSearch('');
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    };

    return (
      <div className="search-container">
        <input
          type="text"
          placeholder="输入关键词..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {searchQuery && (
          <button 
            className="clear-button" 
            onClick={handleClearSearch}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              marginRight: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              right: '40px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
        <button className="search-button" onClick={handleSearch}>
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" />
          </svg>
        </button>
      </div>
    );
  }

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  const handleClockIconClick = () => {
    setIsHistoryModalOpen(true);
  };

  const handleCloseHistoryModal = () => {
    setIsHistoryModalOpen(false);
  };

  const handleStarIconClick = () => {
    setIsFavoritesModalOpen(true);
  };

  const handleCloseFavoritesModal = () => {
    setIsFavoritesModalOpen(false);
  };

  const handleMessageBarClick = () => {
    setIsNotificationModalOpen(true);
    // 移除对原有 onMessageBarClick 的调用，避免冲突
  };

  const handleCloseNotificationModal = () => {
    setIsNotificationModalOpen(false);
  };

  return (
    <div className="navbar-container">
      <ClockIcon onClick={handleClockIconClick} />
      <div onClick={handleMessageBarClick}>
        <MessageBar />
      </div>
      <StarIcon onClick={handleStarIconClick} />
      <SearchBar />
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={handleCloseHistoryModal}
      />
      <FavoritesModal
        isOpen={isFavoritesModalOpen}
        onClose={handleCloseFavoritesModal}
      />
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={handleCloseNotificationModal}
      />
    </div>
  );
}
