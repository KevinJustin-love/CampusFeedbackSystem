import React, { useState, useEffect } from "react";
import "../styles/IssueReply.css"
import { feedbackAPI } from "../api";

function HandlingReply({ issueId }) {

  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if(issueId){
        fetchReplies();
      }  
  }, [issueId]);
  
  const fetchReplies = async () => {
      try {
        setLoading(true)
        const res = await feedbackAPI.getIssueDetail(issueId);
        // 获取所有回复
        const repliesData = res.data.replies || [];
        setReplies(repliesData);
      }catch (error) {
        console.error("获取结果失败", error);
      }finally {
        setLoading(false);
      }
    }

  if (loading) {
    return (
      <div className="reply-container">
        <h1 className="reply-title">处理结果</h1>
        <p className="loading">正在加载处理结果...</p>
      </div>
    );
  }

  return (
    <div className="reply-container">
      <h1 className="reply-title">处理结果</h1>
      {replies && replies.length > 0 ? (
        <div className="replies-list">
          {replies.map((reply, index) => (
            <div key={reply.id || index} className="reply">
              <p className="reply-text">{reply.content}</p>
              {reply.created && (
                <p className="reply-date">
                  {new Date(reply.created).toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
              {reply.attachment && (
                <div className="reply-file">
                  <h3>相关文件</h3>
                  <a
                    href={reply.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    点击下载
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-reply">
          该问题暂未处理，请耐心等待管理员回复
        </div>
      )}
    </div>
  );
}

export default HandlingReply;