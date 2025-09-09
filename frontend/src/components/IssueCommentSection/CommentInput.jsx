import React, { useState } from "react";

import "../../styles/CommentInput.css";

function CommentInput({ onAddComment }) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue === "") return;

    if (typeof onAddComment === "function") {
      onAddComment(trimmedValue);
      setInputValue("");
    }
    setInputValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="comment-input-container">
      <input
        className="comment-input"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="留下你想说的话..."
      />
      <button className="comment-button" onClick={handleSend}>
        发送
      </button>
    </div>
  );
}

export default CommentInput;
