import React from "react";

function CommentMessage({ message, sender,timestamp }) {
  const formattedTime = new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      className="comment-message-container solid">
        <p 
          className="comment-message-text"
          role = "text">
            <span 
              className="comment-sender">
                {sender}:
            </span> 
            {message}
        </p>
        <p className="comment-message-time">
          {formattedTime}
        </p>
    </div>
  );
}

export default CommentMessage;