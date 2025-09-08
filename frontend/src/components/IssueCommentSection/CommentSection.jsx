import React, { useState, useEffect, useRef }  from "react";
import { feedbackAPI } from "../../api";
import CommentInput from "./CommentInput";
import CommentMessage from "./CommentMessage";

import "/frontend/src/styles/CommentSection.css";

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
            message={msg.body}
            sender={msg.user.name}
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