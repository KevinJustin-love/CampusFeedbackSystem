import React from "react";

import "../../styles/CommentMessage.css";

function CommentMessage({ message, sender, timestamp }) {
  const formattedTime = new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="comment-message-container">
      <div className="comment-message-header">
        <span className="comment-sender">
          {sender}
        </span>
        <span className="comment-message-time">
          {formattedTime}
        </span>
      </div>
      <p className="comment-message-text">
        {message}
      </p>
    </div>
  );
}

export default CommentMessage;