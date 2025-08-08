import React from "react";
import IssueDetail from "../components/IssueDetail";
import HandlingProcess from "../components/IssueHandlingProcess";
import CommentSection from "../components/IssueCommentSection/CommentSection";

function IssueDetailPage({ issue, commentMessages, setCommentMessages }) {
  return (
    <div className="issue-detail-page">
      <IssueDetail issue={issue} />
      <HandlingProcess issue={issue} />
      <CommentSection
        commentMessages={commentMessages}
        setCommentMessages={setCommentMessages}
      />
    </div>
  );
}

export default IssueDetailPage;