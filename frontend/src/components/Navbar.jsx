import React from "react";

import "../styles/Navbar.css";

export default function Navbar(){
    //消息栏图标
  function MessageBar() {
      return (
        <span className="message-bar">
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
        </span>
      );
    }
    
    //历史记录图标
    function ClockIcon({ size = 24, stroke = "currentColor", className = "" }) {
      return (
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
      );
    }
    
    //收藏夹图标
    function StarIcon({ filled = false, color = "gold", size = 24 }) {
      return (
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
      );
    }
    
    //搜索栏
    function SearchBar() {
      return (
        <div className="search-container">
          <input type="text" placeholder="输入关键词..." className="search-input" />
          <button className="search-button">
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

    return (
      <>
          <ClockIcon />
          <MessageBar />
          <StarIcon />
          <SearchBar />
      </>
    )
  }