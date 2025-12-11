import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HistoryModal from "../pages/HistoryModal";
import FavoritesModal from "../pages/FavoritesModal";
import NotificationModal from "./NotificationModal";
import UserProfile from "./Profile";
import { useNotifications } from "../hooks/useNotifications";

import "../styles/NavbarGreen.css";

export default function NavbarGreen({
  onSearch,
  adminUnreadCount,
  adminFilter = false,
  isSearching = false,
  user,
  onUserUpdate,
}) {
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  // 如果传入了管理员未读数量，优先使用管理员的过滤结果
  const displayUnreadCount =
    adminUnreadCount !== undefined ? adminUnreadCount : unreadCount;

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);

  //消息栏图标
  function MessageBar() {
    return (
      <span className="message-bar" style={{ cursor: "pointer" }}>
        <svg
          className="envelope-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        <span className="icon-label">通知</span>
        {/* 显示未读消息数量的小红点 */}
        {displayUnreadCount > 0 && (
          <span className="notification-badge">
            {displayUnreadCount > 99 ? "99+" : displayUnreadCount}
          </span>
        )}
      </span>
    );
  }

  //历史记录图标
  function ClockIcon({
    size = 24,
    stroke = "currentColor",
    className = "",
    onClick,
  }) {
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
          className={`clock-icon ${className}`}
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="icon-label">历史</span>
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
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill={filled ? color : "none"}
          stroke={color}
          strokeWidth="1.5"
          strokeLinejoin="round"
          className="star-icon"
        >
          <path d="M12 2L14.47 8.53L21 9.27L16.24 14.25L17.47 21L12 17.77L6.53 21L7.76 14.25L3 9.27L9.53 8.53L12 2Z" />
        </svg>
        <span className="icon-label">收藏</span>
      </span>
    );
  }

  //回到主页图标
  function HomeIcon({ size = 24, onClick, stroke = "rgba(216, 213, 213, 1)" }) {
    return (
      <span
        className="home-icon-container"
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
          strokeLinecap="round"
          strokeLinejoin="round"
          className="home-icon"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span className="icon-label">主页</span>
      </span>
    );
  }

  //回到小岛图标
  function IslandIcon({
    size = 24,
    onClick,
    stroke = "rgba(216, 213, 213, 1)",
  }) {
    return (
      <span
        className="island-icon-container"
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
          strokeLinecap="round"
          strokeLinejoin="round"
          className="island-icon"
        >
          <ellipse cx="12" cy="17" rx="8" ry="4"></ellipse>
          <path d="M12 13c-2.2 0-4 1.8-4 4h8c0-2.2-1.8-4-4-4z"></path>
          <path d="M12 3v6M9 6l3-3 3 3"></path>
        </svg>
        <span className="icon-label">小岛</span>
      </span>
    );
  }

  //搜索栏
  function SearchBar() {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
      if (searchQuery.trim()) {
        if (onSearch) {
          onSearch(searchQuery);
        }
      }
    };

    const handleClearSearch = () => {
      setSearchQuery("");
      if (onSearch) {
        onSearch("");
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    };

    return (
      <div
        className="search-container"
        style={{ display: "flex", alignItems: "center" }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flex: 1,
            minWidth: "200px",
          }}
        >
          <input
            type="text"
            placeholder="在小岛中搜索..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ width: "100%" }}
          />

          {searchQuery && (
            <button
              className="clear-button"
              onClick={handleClearSearch}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                right: "40px",
                top: "50%",
                transform: "translateY(-50%)",
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
      </div>
    );
  }

  const handleClockIconClick = () => {
    console.log("点击历史记录图标");
    setIsHistoryModalOpen(true);
  };

  const handleCloseHistoryModal = () => {
    setIsHistoryModalOpen(false);
  };

  const handleStarIconClick = () => {
    console.log("点击收藏夹图标");
    setIsFavoritesModalOpen(true);
  };

  const handleCloseFavoritesModal = () => {
    setIsFavoritesModalOpen(false);
  };

  const handleMessageBarClick = () => {
    console.log("点击消息图标");
    setIsNotificationModalOpen(true);
  };

  const handleCloseNotificationModal = () => {
    setIsNotificationModalOpen(false);
  };

  const handleLogout = () => {
    navigate("/logout");
  };

  const handleHomeIconClick = () => {
    navigate("/dashboard"); // 跳转到dashboard页面
  };

  const handleIslandIconClick = () => {
    navigate("/", { state: { from: 'navbar' } }); // 跳转到homepage页面，标识来源为navbar
  };

  return (
    <div className="navbar-green-container">
      {/* 左侧区域：主页 + 小岛 */}
      <div className="navbar-green-left">
        <div
          className="navbar-green-nav-btn navbar-green-home-btn"
          onClick={handleHomeIconClick}
          title="主页"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className="navbar-green-nav-label">主页</span>
        </div>
        <div
          className="navbar-green-nav-btn navbar-green-island-btn"
          onClick={handleIslandIconClick}
          title="小岛"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <ellipse cx="12" cy="17" rx="8" ry="4"></ellipse>
            <path d="M12 13c-2.2 0-4 1.8-4 4h8c0-2.2-1.8-4-4-4z"></path>
            <path d="M12 3v6M9 6l3-3 3 3"></path>
          </svg>
          <span className="navbar-green-nav-label">小岛</span>
        </div>
      </div>

      {/* 中间区域：搜索栏 */}
      <div className="navbar-green-center">
        <SearchBar />
      </div>

      {/* 右侧区域：功能图标 + 头像 */}
      <div className="navbar-green-right">
        {/* 发布问题按钮 */}
        <div 
          className="navbar-green-submit-btn"
          onClick={() => navigate("/submit", { state: { from: "/" } })}
          title="发布新问题"
        >
          <span className="navbar-green-pigeon-icon">🕊️</span>
          <span className="navbar-green-submit-label">发布问题</span>
        </div>

        {/* 历史记录 */}
        <div
          className="navbar-green-icon-btn"
          onClick={handleClockIconClick}
          title="历史记录"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>

        {/* 收藏夹 */}
        <div
          className="navbar-green-icon-btn"
          onClick={handleStarIconClick}
          title="收藏"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L14.47 8.53L21 9.27L16.24 14.25L17.47 21L12 17.77L6.53 21L7.76 14.25L3 9.27L9.53 8.53L12 2Z" />
          </svg>
        </div>

        {/* 通知 */}
        <div
          className="navbar-green-icon-btn navbar-green-notification-btn"
          onClick={handleMessageBarClick}
          title="通知"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 16a2 2 0 0 0 1.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 0 0 8 16ZM3 5a5 5 0 0 1 10 0v2.947c0 .05.015.098.042.139l1.703 2.555A1.519 1.519 0 0 1 13.482 13H2.518a1.516 1.516 0 0 1-1.263-2.36l1.703-2.554A.255.255 0 0 0 3 7.947Zm5-3.5A3.5 3.5 0 0 0 4.5 5v2.947c0 .346-.102.683-.294.97l-1.703 2.556a.017.017 0 0 0-.003.01l.001.006c0 .002.002.004.004.006l.006.004.007.001h10.964l.007-.001.006-.004.004-.006.001-.007a.017.017 0 0 0-.003-.01l-1.703-2.554a1.745 1.745 0 0 1-.294-.97V5A3.5 3.5 0 0 0 8 1.5Z" />
          </svg>
          {displayUnreadCount > 0 && (
            <span className="navbar-green-notification-badge">
              {displayUnreadCount > 99 ? "99+" : displayUnreadCount}
            </span>
          )}
        </div>

        {/* 头像下拉 */}
        <div
          className="navbar-green-avatar-wrapper"
          onMouseLeave={() => setIsAvatarMenuOpen(false)}
        >
          <div
            className="navbar-green-avatar-container"
            onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
            title="个人资料"
          >
            <img
              src={user?.avatar || "../../pictures/OIP-C.jpg"}
              alt="头像"
              className="navbar-green-avatar"
            />
            <svg
              className={`navbar-green-avatar-dropdown ${
                isAvatarMenuOpen ? "open" : ""
              }`}
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z" />
            </svg>
          </div>
          {/* 下拉菜单 */}
          {isAvatarMenuOpen && (
            <div className="navbar-green-avatar-menu">
              <div
                className="navbar-green-avatar-menu-item"
                onClick={() => {
                  setIsProfileModalOpen(true);
                  setIsAvatarMenuOpen(false);
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>个人资料</span>
              </div>
              <div className="navbar-green-avatar-menu-divider"></div>
              <div
                className="navbar-green-avatar-menu-item navbar-green-avatar-menu-logout"
                onClick={() => {
                  setIsAvatarMenuOpen(false);
                  handleLogout();
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
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>退出登录</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 模态框 */}
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
        adminFilter={adminFilter}
      />
      {isProfileModalOpen && (
        <UserProfile
          user={user}
          onClose={() => setIsProfileModalOpen(false)}
          onUpdate={onUserUpdate}
        />
      )}
    </div>
  );
}