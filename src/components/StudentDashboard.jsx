import React, { useState } from "react";

const StudentDashboard = ({ user, issues, onSubmitIssue, setPage }) => {
  const handleSwitchToAdmin = () => {
    setPage("admin");
  };

  return (
    <div className="dashboard-container">
      <div className="content-wrapper">
        <h1 className="dashboard-title">欢迎，{user.username}</h1>
        <button onClick={onSubmitIssue} className="btn-primary">提交新问题</button>
        <div className="header-actions">
          {user.role.includes("管理员") && (
            <button className="btn-switch" onClick={handleSwitchToAdmin}>
              切换
            </button>
          )}
        </div>
        <div className="issues-grid">
          {issues.map((issue) => (
            <div key={issue.id} className="issue-card">
              <h3 className="issue-title">{issue.title}</h3>
              <p className="issue-info">分类：{issue.category}</p>
              <p className="issue-info">状态：{issue.status}</p>
              <p className="issue-info issue-date">更新时间：{issue.updated_at}</p>
              <button className="btn-link">查看详情</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;