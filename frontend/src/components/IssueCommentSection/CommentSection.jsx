import React, { useState, useEffect, useRef }  from "react";
import { feedbackAPI } from "../../api";
import { useNotifications } from "../../hooks/useNotifications";
import CommentInput from "./CommentInput";
import CommentMessage from "./CommentMessage";

import "../../styles/CommentSection.css";

function CommentSection({ issueId }) {
  const commentMessagesReff = useRef(null);
  const { fetchUnreadCount } = useNotifications();

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
      const res = await feedbackAPI.getMessages(issueId);
      setMessages(res.data || []);
    }catch (error) {
      console.error("获取留言失败", error);
    }finally {
      setLoading(false);
    }
  }

  const handlePublish = async (newComment) => {
    try {
      const res = await feedbackAPI.createMessage(issueId, {
         body: newComment
        });
      console.log('评论发送成功', res.data);

      // 重新获取所有评论以确保数据同步
      await fetchMessages();
      
      // 刷新通知数量（延迟一点以确保后端处理完成）
      setTimeout(() => {
        fetchUnreadCount();
      }, 1000);
    }catch (error) {
      console.error("发送评论失败:", error);
      alert("发送评论失败，请重试");
    }
  };

  useEffect(() => {
    const containerElem = commentMessagesReff.current;
    if (containerElem) {
      containerElem.scrollTop = containerElem.scrollHeight;
    }
  }, [messages]);

  if (loading) {
    return <div className="loading-container">加载中...</div>;
  }

  return (
    <div className="comment-section-container">
      <h2 className="comment-title">评论区</h2>
      <div className="comment-section" ref={commentMessagesReff}>
        {messages.map((msg) => (
          <CommentMessage
            key={msg.id}
            message={msg.body}
            sender={msg.user_name}
            timestamp={msg.created}
          />
        ))}
      </div>
      <CommentInput
        onAddComment={handlePublish}
      />
    </div>
  );
}

export default CommentSection;