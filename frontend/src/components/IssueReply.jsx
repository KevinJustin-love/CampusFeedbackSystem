import React, { useState, useEffect } from "react";
import "../styles/IssueReply.css"
import { feedbackAPI } from "../api";

function HandlingReply({ issueId }) {

  const [reply, setReply] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if(issueId){
        fetchReply();
      }  
  }, [issueId]);
  
  const fetchReply = async () => {
      try {
        setLoading(true)
        const res = await feedbackAPI.getIssueDetail(issueId);
        setReply(res.data.reply || null);
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
      {reply && reply.content ? (
        <div className="reply">
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
      ) : (
        <div className="no-reply">
          该问题暂未处理，请耐心等待管理员回复
        </div>
      )}
    </div>
  );
}

export default HandlingReply;