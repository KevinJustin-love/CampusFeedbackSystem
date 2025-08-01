import React, { useState } from "react";

const IssueDetailPage = ({ issue }) => {
  return (
    <div className="detail-container">
      <div className="detail-card">
        <h2 className="detail-title">{issue.title}</h2>
        <p className="detail-info">分类：{issue.category}</p>
        <p className="detail-info">状态：{issue.status}</p>
        <p className="detail-info">提交时间：{issue.created_at}</p>
        <p className="detail-description">{issue.description}</p>
        <h3 className="section-title">状态更新</h3>
        <div className="updates-list">
          {issue.updates.map((update, index) => (
            <div key={index} className="timeline-item">
              <p className="update-text">{update.text}</p>
              <p className="update-date">{update.timestamp}</p>
            </div>
          ))}
        </div>
        <h3 className="section-title">评论</h3>
        <div className="comments-list">
          {issue.comments.map((comment, index) => (
            <div key={index} className="comment-item">
              <p className="comment-text">{comment.text}</p>
              <p className="comment-meta">由 {comment.user} 在 {comment.timestamp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IssueDetailPage;