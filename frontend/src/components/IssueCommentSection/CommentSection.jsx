<<<<<<< HEAD
import { useState, useEffect, useRef }  from "react";
import { feedbackAPI } from "../../api";
import CommentInput from "./CommentInput";
import CommentMessage from "./CommentMessage";

function CommentSection({ issueId }) {
  const commentMessagesReff = useRef(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(issueId){
      fetchMessages();
    }  
  }, [issueId]);

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const res = await feedbackAPI.getIssueDetail(issueId);
      setMessages(res.data.messages || []);
    }catch (error) {
      console.error("获取留言失败", error);
    }finally {
      setLoading(false);
    }
  }

  const handlePublish = async (newComment) => {
    try {
      const res = await feedbackAPI.createIssue({
         body: newComment
        });
      console.log('评论发送成功', res.data);

      const updatedMessages = [...messages, res.data];
      setMessages(updatedMessages);
    }catch (error) {
      console.error("发送评论失败:", error);
    }

  };

  useEffect(() => {
=======
// ✅ CommentSection.jsx（更新：支持 onAddComment 向上传评论）

import React from "react";
import CommentInput from "./CommentInput";
import CommentMessage from "./CommentMessage";

function CommentSection({ commentMessages, setCommentMessages, onAddComment }) {
  const commentMessagesReff = React.useRef(null);

  React.useEffect(() => {
>>>>>>> feature/user-profile
    const containerElem = commentMessagesReff.current;
    if (containerElem) {
      containerElem.scrollTop = containerElem.scrollHeight;
    }
<<<<<<< HEAD
  }, [messages]);

  if (loading) {
    return <div className="loading-container">加载中...</div>;
  }
=======
  }, [commentMessages]);
>>>>>>> feature/user-profile

  return (
    <div className="comment-section-container">
      <h2 className="comment-title">评论区</h2>
      <div className="comment-section" ref={commentMessagesReff}>
<<<<<<< HEAD
        {messages.map((msg) => (
          <CommentMessage
            message={msg.body}
            sender={msg.user.name}
            timestamp={msg.created}
=======
        {commentMessages.map((msg) => (
          <CommentMessage
            key={msg.id}
            message={msg.message}
            sender={msg.sender}
            timestamp={msg.timestamp}
>>>>>>> feature/user-profile
          />
        ))}
      </div>
      <CommentInput
<<<<<<< HEAD
        onAddComment={handlePublish}
=======
        onAddComment={(newComment) => {
          const updated = [...commentMessages, newComment];
          setCommentMessages(updated);
          if (typeof onAddComment === 'function') {
            onAddComment(newComment);
          }
        }}
>>>>>>> feature/user-profile
      />
    </div>
  );
}

export default CommentSection;