import React, { useState, useCallback } from "react";

function CommentInput({ commentMessages, setCommentMessages }) {
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim() === "") return;
    const newMessage = {
      id: Date.now(),
      message: inputValue,
      sender: "user",
      timestamp: new Date().toISOString(), // 记录时间
    };
    setCommentMessages([...commentMessages, newMessage]);
    setInputValue("");
  };

  return (
    <div className="comment-input-container ">
      <input
        className="comment-input"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="留下你想说的话..."
      />
      <button  className="comment-button "onClick={handleSend}>发送</button>
    </div>
  );
}

export default CommentInput;