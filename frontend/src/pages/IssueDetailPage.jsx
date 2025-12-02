import React,{ useState, useEffect } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import IssueDetail from "../components/IssueDetail";
import CommentSection from "../components/IssueCommentSection/CommentSection";
import HandlingReply from "../components/IssueReply";
import { feedbackAPI, historyAPI } from "../api"

import "../styles/IssueDetailPage.css";

function IssueDetailPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    
    if (id === 'undefined' || id === undefined) {
      setError("Invalid issue ID");
      setLoading(false);
      return;
    }
    if (!id) {
      // 如果 ID 不存在，直接返回或处理错误
      setLoading(false);
      setError("问题 ID 不存在。");
      return;
    }


    async function fetchIssue() {
      try {
        const response = await feedbackAPI.getIssueDetail(id);
        setIssue(response.data);
        
        // 记录浏览历史
        try {
          await historyAPI.recordView(id);
        } catch (historyError) {
          console.error("记录浏览历史失败:", historyError);
          // 不阻止页面加载，只是记录错误
        }
      } catch (error) {
        console.error("获取问题详情失败:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchIssue();
    }
  }, [id]);
  if (loading) {
    return <div style={{ padding: 20 }}>正在加载...</div>;
  }
  if (error) {
    return <div style={{ padding: 20 }}>{error}</div>;
  }

  if (!issue) {
    return <div style={{ padding: 20 }}>未找到对应的问题（ID: {id}）</div>;
  }
 

  return (
    <div className="issue-detail-page">
      <Hero user={user} onSearch={() => {}} />
      <button className="back-button" onClick={() => navigate(-1)}>
        ← 返回上一页
      </button>
      <IssueDetail issue={issue} />
      <HandlingReply issueId={id} />
      <CommentSection issueId={id}/>
    </div>
  );
}

export default IssueDetailPage;