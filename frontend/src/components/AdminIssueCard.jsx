import React, { useState } from "react";
import { feedbackAPI } from "../api";
import "../styles/AdminIssueCard.css";

// Fixed undefined toFixed() error - updated component

function AdminIssueCard({ issue, onReplySuccess }) {
  // Add safety check for issue object
  if (!issue) {
    return <div className="admin-issue-card">Invalid issue data</div>;
  }
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      alert("请输入回复内容");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', replyContent);
      if (attachment) {
        formData.append('attachment', attachment);
      }

      const response = await feedbackAPI.adminReplyIssue(issue.id, formData);
      
      alert("回复成功！");
      setShowReplyForm(false);
      setReplyContent("");
      setAttachment(null);
      
      if (onReplySuccess) {
        onReplySuccess();
      }
    } catch (error) {
      console.error("回复失败:", error);
      alert("回复失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '已处理':
        return '#28a745';
      case '处理中':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="admin-issue-card">
      <div className="admin-issue-header">
        <div className="admin-issue-title">
          <h3>{issue.title || '未知标题'}</h3>
          <span 
            className="admin-issue-status"
            style={{ backgroundColor: getStatusColor(issue.status) }}
          >
            {issue.status || '未知状态'}
          </span>
        </div>
        <div className="admin-issue-meta">
          <span className="admin-issue-topic">{issue.topic || '未分类'}</span>
          <span className="admin-issue-date">{issue.created ? formatDate(issue.created) : '未知时间'}</span>
        </div>
      </div>

      <div className="admin-issue-content">
        <p><strong>问题描述：</strong>{issue.description || '无描述'}</p>
        <p><strong>发生时间：</strong>{issue.date || '未知'}</p>
        {issue.attachment && (
          <p>
            <strong>附件：</strong>
            <a href={issue.attachment} target="_blank" rel="noopener noreferrer">
              查看附件
            </a>
          </p>
        )}
      </div>

      <div className="admin-issue-stats">
        <span>👀 {issue.views || 0}</span>
        <span>👍 {issue.likes || 0}</span>
        <span>🔥 {(issue.popularity || 0).toFixed(1)}</span>
      </div>

      <div className="admin-issue-actions">
        {issue.status !== '已处理' && (
          <button
            className="btn-reply"
            onClick={() => setShowReplyForm(!showReplyForm)}
            disabled={isSubmitting}
          >
            {showReplyForm ? '取消回复' : '回复问题'}
          </button>
        )}
      </div>

      {showReplyForm && (
        <div className="admin-reply-form">
          <form onSubmit={handleReplySubmit}>
            <div className="form-group">
              <label htmlFor="replyContent">回复内容：</label>
              <textarea
                id="replyContent"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="请输入处理结果和回复内容..."
                rows="4"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="attachment">附件（可选）：</label>
              <input
                id="attachment"
                type="file"
                onChange={(e) => setAttachment(e.target.files[0])}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
            </div>
            
            <div className="form-actions">
              <button
                type="submit"
                className="btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? '提交中...' : '提交回复'}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowReplyForm(false)}
                disabled={isSubmitting}
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminIssueCard;