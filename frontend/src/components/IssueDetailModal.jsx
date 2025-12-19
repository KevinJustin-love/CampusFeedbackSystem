import React, { useState, useEffect } from "react";
import { feedbackAPI, historyAPI } from "../api";
import "../styles/IssueDetailModal.css";

function IssueDetailModal({ issueId, isOpen, onClose }) {
  const [issue, setIssue] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 确认结案相关状态
  const [canConfirm, setCanConfirm] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 未解决相关状态
  const [showUnresolvedDialog, setShowUnresolvedDialog] = useState(false);
  const [unresolvedReason, setUnresolvedReason] = useState("");
  const [unresolvedLoading, setUnresolvedLoading] = useState(false);

  useEffect(() => {
    if (isOpen && issueId) {
      fetchIssueDetail();
      checkConfirmPermission();
    }
  }, [isOpen, issueId]);

  const fetchIssueDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await feedbackAPI.getIssueDetail(issueId);
      console.log("Issue detail response:", response.data); // 调试信息
      setIssue(response.data);

      // 记录浏览历史
      try {
        await historyAPI.recordView(issueId);
      } catch (historyError) {
        console.error("记录浏览历史失败:", historyError);
        // 不阻止页面加载，只是记录错误
      }

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

  // 检查用户是否有确认结案的权限
  const checkConfirmPermission = async () => {
    try {
      const response = await feedbackAPI.checkConfirmPermission(issueId);
      setCanConfirm(response.data.can_confirm);
    } catch (error) {
      console.error("检查确认权限失败:", error);
      setCanConfirm(false);
    }
  };

  // 提交确认结案
  const handleConfirmResolved = async () => {
    try {
      setConfirmLoading(true);
      await feedbackAPI.confirmResolved(issueId, {
        rating: rating,
        feedback: feedback,
      });

      // 更新本地状态
      setIssue((prev) => ({ ...prev, status: "已解决" }));
      setCanConfirm(false);
      setShowConfirmDialog(false);
      setRating(0);
      setFeedback("");

      alert("已确认问题解决！感谢您的反馈！");
    } catch (error) {
      console.error("确认结案失败:", error);
      alert(error.response?.data?.error || "确认结案失败，请重试");
    } finally {
      setConfirmLoading(false);
    }
  };

  // 提交未解决
  const handleMarkUnresolved = async () => {
    try {
      setUnresolvedLoading(true);
      await feedbackAPI.markUnresolved(issueId, {
        reason: unresolvedReason,
      });

      // 更新本地状态
      setIssue((prev) => ({ ...prev, status: "已提交，等待审核" }));
      setCanConfirm(false);
      setShowUnresolvedDialog(false);
      setUnresolvedReason("");

      alert("已标记问题未解决，管理员将重新处理您的问题。");
    } catch (error) {
      console.error("标记未解决失败:", error);
      alert(error.response?.data?.error || "操作失败，请重试");
    } finally {
      setUnresolvedLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "已处理":
        return "#28a745";
      case "处理中":
        return "#ffc107";
      case "已解决":
        return "#17a2b8";
      default:
        return "#6c757d";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content issue-detail-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>问题详情</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
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
                <span>
                  <strong>分类:</strong> {issue.topic}
                </span>
                <span>
                  <strong>提交时间:</strong> {formatDate(issue.created)}
                </span>
                <span>
                  <strong>发生时间:</strong> {issue.date}
                </span>
                <span>
                  <strong>提交人:</strong> {issue.host || "匿名用户"}
                </span>
              </div>

              <div className="issue-description">
                <h4>问题描述:</h4>
                <p>{issue.description}</p>
              </div>

              {issue.attachment && (
                <div className="issue-attachment">
                  <h4>附件:</h4>
                  <a
                    href={issue.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📎 查看附件
                  </a>
                </div>
              )}

              <div className="issue-stats">
                <span>👀 浏览量: {issue.views || 0}</span>
                <span>👍 点赞数: {issue.likes || 0}</span>
              </div>
            </div>

            {/* 用户评论 */}
            {messages.length > 0 && (
              <div className="messages-section">
                <h4>用户评论 ({messages.length})</h4>
                <div className="messages-list">
                  {messages.map((message) => (
                    <div key={message.id} className="message-item">
                      <div className="message-header">
                        <span className="message-author">
                          {message.user_name}
                        </span>
                        <span className="message-date">
                          {formatDate(message.created)}
                        </span>
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
                        <span className="reply-author">
                          🛡️ {reply.administrator_name}
                        </span>
                        <span className="reply-date">
                          {formatDate(reply.created)}
                        </span>
                      </div>
                      <div className="reply-content">{reply.content}</div>
                      {reply.attachment && (
                        <div className="reply-attachment">
                          <a
                            href={reply.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            📎 查看回复附件
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 确认结案按钮 - 只有问题提交者且状态为"已处理"时显示 */}
            {canConfirm && (
              <div className="confirm-resolved-section">
                <div className="confirm-prompt">
                  <p>📋 管理员已处理您的问题，请确认是否已解决：</p>
                  <div className="confirm-buttons-group">
                    <button
                      className="btn-confirm-resolved"
                      onClick={() => setShowConfirmDialog(true)}
                    >
                      ✅ 确认已解决
                    </button>
                    <button
                      className="btn-mark-unresolved"
                      onClick={() => setShowUnresolvedDialog(true)}
                    >
                      ❌ 未解决
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 确认结案对话框 */}
        {showConfirmDialog && (
          <div
            className="confirm-dialog-overlay"
            onClick={() => setShowConfirmDialog(false)}
          >
            <div
              className="confirm-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>确认问题已解决</h3>
              <p>感谢您的反馈！请为本次处理结果评分：</p>

              {/* 星级评分 */}
              <div className="rating-section">
                <label>满意度评分：</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${rating >= star ? "active" : ""}`}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="rating-text">
                  {rating === 0
                    ? "点击选择评分"
                    : rating === 1
                    ? "非常不满意"
                    : rating === 2
                    ? "不满意"
                    : rating === 3
                    ? "一般"
                    : rating === 4
                    ? "满意"
                    : "非常满意"}
                </span>
              </div>

              {/* 反馈文本 */}
              <div className="feedback-section">
                <label>其他反馈（可选）：</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="请输入您对本次处理的意见或建议..."
                  maxLength={500}
                />
              </div>

              <div className="confirm-dialog-buttons">
                <button
                  className="btn-cancel"
                  onClick={() => setShowConfirmDialog(false)}
                  disabled={confirmLoading}
                >
                  取消
                </button>
                <button
                  className="btn-submit"
                  onClick={handleConfirmResolved}
                  disabled={confirmLoading}
                >
                  {confirmLoading ? "提交中..." : "确认结案"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 未解决对话框 */}
        {showUnresolvedDialog && (
          <div
            className="confirm-dialog-overlay"
            onClick={() => setShowUnresolvedDialog(false)}
          >
            <div
              className="confirm-dialog unresolved-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>问题未解决</h3>
              <p>请告诉我们问题未解决的原因，以便管理员重新处理：</p>

              {/* 反馈原因 */}
              <div className="feedback-section">
                <label>未解决原因：</label>
                <textarea
                  value={unresolvedReason}
                  onChange={(e) => setUnresolvedReason(e.target.value)}
                  placeholder="请描述问题未解决的原因，例如：回复未能解决我的问题、需要进一步的帮助等..."
                  maxLength={500}
                />
              </div>

              <div className="confirm-dialog-buttons">
                <button
                  className="btn-cancel"
                  onClick={() => setShowUnresolvedDialog(false)}
                  disabled={unresolvedLoading}
                >
                  取消
                </button>
                <button
                  className="btn-unresolved-submit"
                  onClick={handleMarkUnresolved}
                  disabled={unresolvedLoading}
                >
                  {unresolvedLoading ? "提交中..." : "提交"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

export default IssueDetailModal;
