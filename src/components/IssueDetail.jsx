import React from "react";

function IssueDetail({ issue }) {
  return (
    <>
      <div className="detail-container">
        <h2 className="detail-title">{issue.title}</h2>
        <div className="detail-meta">
            <p className="detail-info"><span >分类：</span>{issue.category}</p>
            <p className="detail-info"><span >状态：</span>{issue.status}</p>
            <p className="detail-info"><span >提交时间：</span>{issue.created_at}</p>
        </div>
        <p className="detail-description"><span className = "label">问题描述：</span>{issue.description}</p>
        {issue.file && (
          <div className="detail-file">
            <h3>附件：</h3>
            <a
              href={issue.file}
              target="_blank"
              rel="noopener noreferrer"
            >
              点击下载
            </a>
          </div>
        )}
      </div>
    </>
  );
}

export default IssueDetail;