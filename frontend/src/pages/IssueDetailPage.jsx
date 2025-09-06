import { useState, useEffect } from "react"; 
import { useParams } from "react-router-dom";
import IssueDetail from "../components/IssueDetail";
import CommentSection from "../components/IssueCommentSection/CommentSection";
import HandlingReply from "../components/IssueReply";
import { feedbackAPI } from "../api"

function IssueDetailPage() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchIssue() {
      try {
        const response = await feedbackAPI.getIssueDetail(id);
        setIssue(response.data);
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

  if (!issue) {
    return <div style={{ padding: 20 }}>未找到对应的问题（ID: {id}）</div>;
  }

<<<<<<< HEAD
=======
  const handleAddComment = (newComment) => {
    const updatedComments = [...commentMessages, newComment];
    setCommentMessages(updatedComments);

    // 同步到 issues 中对应问题的 comments
    const updatedIssues = [...issues];
    updatedIssues[issueIndex] = {
      ...issue,
      comments: updatedComments,
    };
    setIssues(updatedIssues);
  };

>>>>>>> feature/user-profile
  return (
    <div className="issue-detail-page">

      <IssueDetail issue={issue} />
<<<<<<< HEAD
      <HandlingReply issueId={id} />
      <CommentSection issueId={id}/>
=======
      <HandlingProcess issue={issue} />
      <CommentSection
        commentMessages={commentMessages}
        setCommentMessages={setCommentMessages}
        onAddComment={handleAddComment}
      />
>>>>>>> feature/user-profile
    </div>
  );
};

export default IssueDetailPage;