import React, { useState } from "react";
import { feedbackAPI } from "../api";
import "../styles/IssueDetail.css";

function IssueDetail({ issue }) {
  const [likes, setLikes] = useState(issue.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = async () => {
    try {
      await feedbackAPI.likeIssue(issue.id);
      setLikes(prev => hasLiked ? prev - 1 : prev + 1);
      setHasLiked(!hasLiked);
    } catch (error) {
      console.error("点赞失败:", error);
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
        <div className="like-section">
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
    </>
  );
}

export default IssueDetail;