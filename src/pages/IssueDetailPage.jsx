import React, { useState } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import IssueDetail from "../components/IssueDetail";
import HandlingProcess from "../components/IssueHandlingProcess";
import CommentSection from "../components/IssueCommentSection/CommentSection";

function IssueDetailPage({ issues,setIssues}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const issueIndex = issues.findIndex(
    (issue) => issue.id === parseInt(id));
  const issue = issues[issueIndex];

  const [commentMessages, setCommentMessages] = 
    useState(issue?.comments || []);
  
  if (!issue) {
    return <div style={{ padding: 20 }}>未找到对应的问题（ID: {id}）</div>;
  }

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

  return (
    <div className="issue-detail-page">

      <IssueDetail issue={issue} />
      <HandlingProcess issue={issue} />
      <CommentSection
        commentMessages={commentMessages}
        setCommentMessages={setCommentMessages}
        onAddComment={handleAddComment}
      />
    </div>
  );
};

export default IssueDetailPage;