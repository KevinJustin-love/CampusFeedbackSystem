import React,{ useState, useEffect } from "react"; 
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import IssueDetail from "../components/IssueDetail";
import CommentSection from "../components/IssueCommentSection/CommentSection";
import HandlingReply from "../components/IssueReply";
import { feedbackAPI, historyAPI } from "../api"

import "../styles/IssueDetailPage.css";

function IssueDetailPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [issue, setIssue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFromTopicTree, setIsFromTopicTree] = useState(false)

  useEffect(() => {
    // 检测来源页面
    const fromPage = location.state?.from;
    // 只有从/topic-tree（问题树页面）进入时使用绿色主题，其他情况（包括dashboard）使用棕色主题
    setIsFromTopicTree(fromPage === '/topic-tree');
    
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
    <div className={`issue-detail-page ${isFromTopicTree ? 'tree-theme' : ''}`}>
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