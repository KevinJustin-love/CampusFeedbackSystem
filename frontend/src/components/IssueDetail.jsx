import React, { useState, useEffect } from "react";
import { feedbackAPI, favoriteAPI } from "../api";
import "../styles/IssueDetail.css";

function IssueDetail({ issue }) {
  // 点赞相关状态
  const [likes, setLikes] = useState(issue.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);

  // 收藏相关状态
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

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

  // 点赞处理
  const handleLike = async () => {
    try {
      await feedbackAPI.likeIssue(issue.id);
      setLikes(prev => hasLiked ? prev - 1 : prev + 1);
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

  return (
    <>
      <div className="detail-container">
        <h2 className="detail-title">{issue.title}</h2>
        <div className="detail-meta">
          <p className="detail-info"><span>分类：</span>{issue.topic}</p>
          <p className="detail-info"><span>状态：</span>{issue.status}</p>
          <p className="detail-info"><span>提交时间：</span>{issue.created}</p>
          <div className="detail-actions">
            <button 
              className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
              onClick={handleToggleFavorite}
              disabled={favoriteLoading}
            >
              {favoriteLoading ? '处理中...' : (
                <>{isFavorited ? '★' : '☆'} {isFavorited ? '已收藏' : '收藏'}</>
              )}
            </button>
            <button 
              onClick={handleLike}
              className={`like-button ${hasLiked ? 'liked' : ''}`}
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
        <p className="detail-description"><span className="label">问题描述：</span>{issue.description}</p>
        {issue.attachment && (
          <div className="detail-file">
            <h3>附件：</h3>
            <a href={issue.attachment} target="_blank" rel="noopener noreferrer">
              点击下载
            </a>
          </div>
        )}
      </div>
    </>
  );
}

export default IssueDetail;