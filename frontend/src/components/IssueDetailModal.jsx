import React, { useState, useEffect } from "react";
import { feedbackAPI } from "../api";
import "../styles/IssueDetailModal.css";

function IssueDetailModal({ issueId, isOpen, onClose }) {
  const [issue, setIssue] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && issueId) {
      fetchIssueDetail();
    }
  }, [isOpen, issueId]);

  const fetchIssueDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await feedbackAPI.getIssueDetail(issueId);
      console.log("Issue detail response:", response.data); // 调试信息
      setIssue(response.data);
      
      // 获取评论
      const messagesResponse = await feedbackAPI.getMessages(issueId);
      setMessages(messagesResponse.data);
      
      // 设置管理员回复（通过issue数据中的replies字段）
      if (response.data.replies && response.data.replies.length > 0) {
        console.log("Found replies:", response.data.replies); // 调试信息
        setReplies(response.data.replies);
      } else {
        console.log("No replies found"); // 调试信息
        setReplies([]);
      }
      
    } catch (error) {
      console.error("获取问题详情失败:", error);
      setError("获取问题详情失败，请重试");
    } finally {
      setLoading(false);
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content issue-detail-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>问题详情</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {loading && <div className="loading">加载中...</div>}
        {error && <div className="error">{error}</div>}

        {issue && (
          <div className="modal-body">
            {/* 问题基本信息 */}
            <div className="issue-info">
              <div className="issue-header">
                <h3>{issue.title}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(issue.status) }}
                >
                  {issue.status}
                </span>
              </div>
              
              <div className="issue-meta">
                <span><strong>分类:</strong> {issue.topic}</span>
                <span><strong>提交时间:</strong> {formatDate(issue.created)}</span>
                <span><strong>发生时间:</strong> {issue.date}</span>
                <span><strong>提交人:</strong> {issue.host || '匿名用户'}</span>
              </div>

              <div className="issue-description">
                <h4>问题描述:</h4>
                <p>{issue.description}</p>
              </div>

              {issue.attachment && (
                <div className="issue-attachment">
                  <h4>附件:</h4>
                  <a href={issue.attachment} target="_blank" rel="noopener noreferrer">
                    📎 查看附件
                  </a>
                </div>
              )}

              <div className="issue-stats">
                <span>👀 浏览量: {issue.views || 0}</span>
                <span>👍 点赞数: {issue.likes || 0}</span>
                <span>🔥 热度: {(issue.popularity || 0).toFixed(1)}</span>
              </div>
            </div>

            {/* 用户评论 */}
            {messages.length > 0 && (
              <div className="messages-section">
                <h4>用户评论 ({messages.length})</h4>
                <div className="messages-list">
                  {messages.map(message => (
                    <div key={message.id} className="message-item">
                      <div className="message-header">
                        <span className="message-author">{message.user_name}</span>
                        <span className="message-date">{formatDate(message.created)}</span>
                      </div>
                      <div className="message-body">{message.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 管理员回复 */}
            {replies.length > 0 && (
              <div className="replies-section">
                <h4>管理员回复</h4>
                <div className="replies-list">
                  {replies.map((reply, index) => (
                    <div key={reply.id || index} className="reply-item">
                      <div className="reply-header">
                        <span className="reply-author">🛡️ {reply.administrator_name}</span>
                        <span className="reply-date">{formatDate(reply.created)}</span>
                      </div>
                      <div className="reply-content">{reply.content}</div>
                      {reply.attachment && (
                        <div className="reply-attachment">
                          <a href={reply.attachment} target="_blank" rel="noopener noreferrer">
                            📎 查看回复附件
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  );
}

export default IssueDetailModal;