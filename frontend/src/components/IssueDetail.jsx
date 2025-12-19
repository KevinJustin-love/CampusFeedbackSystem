import React, { useState, useEffect } from "react";
import { feedbackAPI, favoriteAPI } from "../api";
import "../styles/IssueDetail.css";

// 格式化日期时间的辅助函数
const formatDateTime = (dateString) => {
  if (!dateString) return "未知时间";

  try {
    const date = new Date(dateString);
    // 检查日期是否有效
    if (isNaN(date.getTime())) return "无效日期";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error("日期格式化错误:", error);
    return "日期格式错误";
  }
};

function IssueDetail({ issue }) {
  // 点赞相关状态
  const [likes, setLikes] = useState(issue.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);

  // 收藏相关状态
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // 确认结案相关状态
  const [canConfirm, setCanConfirm] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(issue.status);

  // 未解决相关状态
  const [showUnresolvedDialog, setShowUnresolvedDialog] = useState(false);
  const [unresolvedReason, setUnresolvedReason] = useState("");
  const [unresolvedLoading, setUnresolvedLoading] = useState(false);

  // 检查收藏状态
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const response = await favoriteAPI.checkFavoriteStatus(issue.id);
        setIsFavorited(response.data.favorited);
      } catch (error) {
        console.error("检查收藏状态失败:", error);
      }
    };

    if (issue?.id) {
      checkFavoriteStatus();
    }
  }, [issue?.id]);

  // 检查用户是否有确认结案的权限
  useEffect(() => {
    const checkConfirmPermission = async () => {
      try {
        const response = await feedbackAPI.checkConfirmPermission(issue.id);
        setCanConfirm(response.data.can_confirm);
      } catch (error) {
        console.error("检查确认权限失败:", error);
        setCanConfirm(false);
      }
    };

    if (issue?.id) {
      checkConfirmPermission();
    }
  }, [issue?.id, currentStatus]);

  // 点赞处理
  const handleLike = async () => {
    try {
      await feedbackAPI.likeIssue(issue.id);
      setLikes((prev) => (hasLiked ? prev - 1 : prev + 1));
      setHasLiked(!hasLiked);
    } catch (error) {
      console.error("点赞失败:", error);
    }
  };

  // 切换收藏状态
  const handleToggleFavorite = async () => {
    if (favoriteLoading) return;

    setFavoriteLoading(true);
    try {
      const response = await favoriteAPI.toggleFavorite(issue.id);
      setIsFavorited(response.data.favorited);
    } catch (error) {
      console.error("切换收藏状态失败:", error);
      if (error.response?.status === 401) {
        alert("请先登录后再进行收藏操作");
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  // 提交确认结案
  const handleConfirmResolved = async () => {
    try {
      setConfirmLoading(true);
      await feedbackAPI.confirmResolved(issue.id, {
        rating: rating,
        feedback: feedback,
      });

      // 更新本地状态
      setCurrentStatus("已解决");
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
      await feedbackAPI.markUnresolved(issue.id, {
        reason: unresolvedReason,
      });

      // 更新本地状态
      setCurrentStatus("已提交，等待审核");
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

  return (
    <>
      <div className="detail-container">
        <h2 className="detail-title">{issue.title}</h2>
        <div className="detail-meta">
          <p className="detail-info">
            <span>分类：</span>
            {issue.topic}
          </p>
          <p className="detail-info">
            <span>状态：</span>
            {currentStatus}
          </p>
          <p className="detail-info">
            <span>提交时间：</span>
            {formatDateTime(issue.created)}
          </p>
          <div className="detail-actions">
            <button
              className={`favorite-btn ${isFavorited ? "favorited" : ""}`}
              onClick={handleToggleFavorite}
              disabled={favoriteLoading}
            >
              {favoriteLoading ? (
                "处理中..."
              ) : (
                <>
                  {isFavorited ? "★" : "☆"} {isFavorited ? "已收藏" : "收藏"}
                </>
              )}
            </button>
            <button
              onClick={handleLike}
              className={`like-button ${hasLiked ? "liked" : ""}`}
              aria-label="点赞"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={hasLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
              <span className="like-count">{likes}</span>
            </button>
          </div>
        </div>
        <p className="detail-description">
          <span className="label">问题描述：</span>
          {issue.description}
        </p>
        {issue.attachment && (
          <div className="detail-file">
            <h3>附件：</h3>
            <a
              href={issue.attachment}
              target="_blank"
              rel="noopener noreferrer"
            >
              点击下载
            </a>
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

      {/* 确认结案对话框 */}
      {showConfirmDialog && (
        <div
          className="confirm-dialog-overlay"
          onClick={() => setShowConfirmDialog(false)}
        >
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
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
    </>
  );
}

export default IssueDetail;
