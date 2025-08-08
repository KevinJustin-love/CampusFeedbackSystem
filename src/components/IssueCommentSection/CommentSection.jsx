import React from "react";
import CommentInput from "./CommentInput";
import CommentMessage from "./CommentMessage";

function CommentSection({ commentMessages, setCommentMessages }) {
  const commentMessagesReff = React.useRef(null);

  React.useEffect(() => {
    const cotainerElem = commentMessagesReff.current;
      if (cotainerElem) {
        cotainerElem.scrollTop = cotainerElem.scrollHeight;
      }
    },[commentMessages]);

  return (
    <div className="comment-section-container">
      <h2 className = "comment-title">评论区</h2>
      <div 
        className="comment-section"
        ref={commentMessagesReff}>
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
        commentMessages={commentMessages}
        setCommentMessages={setCommentMessages}
      />
    </div>
  );
}

export default CommentSection;