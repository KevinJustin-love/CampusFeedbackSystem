// ✅ CommentSection.jsx（更新：支持 onAddComment 向上传评论）

import React from "react";
import CommentInput from "./CommentInput";
import CommentMessage from "./CommentMessage";

function CommentSection({ commentMessages, setCommentMessages, onAddComment }) {
  const commentMessagesReff = React.useRef(null);

  React.useEffect(() => {
    const containerElem = commentMessagesReff.current;
    if (containerElem) {
      containerElem.scrollTop = containerElem.scrollHeight;
    }
  }, [commentMessages]);

  return (
    <div className="comment-section-container">
      <h2 className="comment-title">评论区</h2>
      <div className="comment-section" ref={commentMessagesReff}>
        {commentMessages.map((msg) => (
          <CommentMessage
            key={msg.id}
            message={msg.message}
            sender={msg.sender}
            timestamp={msg.timestamp}
          />
        ))}
      </div>
      <CommentInput
        onAddComment={(newComment) => {
          const updated = [...commentMessages, newComment];
          setCommentMessages(updated);
          if (typeof onAddComment === 'function') {
            onAddComment(newComment);
          }
        }}
      />
    </div>
  );
}

export default CommentSection;