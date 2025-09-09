import React from 'react';

import "../styles/IssueNavbar.css";

//状态导航栏
export default function IssuesNavbar({ activeTab, onTabChange }) {
  return (
    <div className="issues-navbar">
      <button
        className={`nav-button ${activeTab === "all" ? "active" : ""}`}
        onClick={() => onTabChange("all")}
      >
        全部
      </button>
      <button
        className={`nav-button ${activeTab === "mine" ? "active" : ""}`}
        onClick={() => onTabChange("mine")}
      >
        我的
      </button>
    </div>
  );
}