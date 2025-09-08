import React, { useState, useEffect } from "react";
import "../styles/IssueReply.css"
import { feedbackAPI } from "../api";

function HandlingReply({ issueId }) {

  const [reply, setReply] = useState([]);
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
        setReply(res.data.reply || []);
      }catch (error) {
        console.error("获取结果失败", error);
      }finally {
        setLoading(false);
      }
    }

  return (
    <div className="reply-container">
      <h1 className="reply-title">处理结果</h1>
      <div className="reply">
        <p className="reply-text">{reply.content}</p>
              <p className="reply-date">{reply.created}</p>
                {reply.file && (
                  <div className="reply-file">
                    <h3>相关文件：</h3>
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
    </div>
  );
}

export default HandlingReply;