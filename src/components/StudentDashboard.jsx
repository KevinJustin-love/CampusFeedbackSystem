import React, { useState } from "react";

const StudentDashboard = ({ user, issues, onSubmitIssue, onDetail }) => {
  return (
    <div className="dashboard-container">
      <div className="content-wrapper">
        <h1 className="dashboard-title">欢迎，{user.username}</h1>
        <button onClick={onSubmitIssue} className="btn-primary">提交新问题</button>
        <div className="issues-grid">
          {issues.map((issue) => (
            <div key={issue.id} className="issue-card">
              <h3 className="issue-title">{issue.title}</h3>
              <p className="issue-info">分类：{issue.category}</p>
              <p className="issue-info">状态：{issue.status}</p>
              <p className="issue-info issue-date">更新时间：{issue.updated_at}</p>
              <button className="btn-link"  onClick={() => onDetail(issue)}>查看详情</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;