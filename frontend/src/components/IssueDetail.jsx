import React, { useState, useEffect } from "react";
import { favoriteAPI } from "../api";

import "../styles/IssueDetail.css";

function IssueDetail({ issue }) {
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
            <p className="detail-info"><span >分类：</span>{issue.topic}</p>
            <p className="detail-info"><span >状态：</span>{issue.status}</p>
            <p className="detail-info"><span >提交时间：</span>{issue.created}</p>
            <div className="detail-actions">
              <button 
                className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
                onClick={handleToggleFavorite}
                disabled={favoriteLoading}
              >
                {favoriteLoading ? (
                  '处理中...'
                ) : (
                  <>
                    {isFavorited ? '★' : '☆'} {isFavorited ? '已收藏' : '收藏'}
                  </>
                )}
              </button>
            </div>
        </div>
        <p className="detail-description"><span className = "label">问题描述：</span>{issue.description}</p>
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
      </div>
    </>
  );
}

export default IssueDetail;