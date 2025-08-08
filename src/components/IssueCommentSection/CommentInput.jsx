// CommentInput.jsx（更新：支持向上传递新评论）

import React, { useState } from "react";

function CommentInput({ onAddComment }) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim() === "") return;

    const newMessage = {
      id: Date.now(),
      message: inputValue,
      sender: "user", // 可替换为登录用户
      timestamp: new Date().toISOString(),
    };

    if (typeof onAddComment === 'function') {
      onAddComment(newMessage);
    }

    setInputValue("");
  };

  return (
    <div className="comment-input-container">
      <input
        className="comment-input"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="留下你想说的话..."
      />
      <button className="comment-button" onClick={handleSend}>发送</button>
    </div>
  );
}

export default CommentInput;