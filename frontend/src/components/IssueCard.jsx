import React from 'react';
import { useNavigate } from "react-router-dom";

import "../styles/issueCard&admin.css";
import "../styles/IssueCard.css";

function IssueCard({ issue }) {
    const navigate = useNavigate();
    const updatedDateString = issue?.updated;

    // 格式化日期时间
    let formattedDate = 'N/A';
    if (updatedDateString) {
        const dateObject = new Date(updatedDateString);
        formattedDate = dateObject.toLocaleString();
    }

    return (
        <div className="issue-card">
            <h3 className="issue-title">{issue.title}</h3>
            <p className="issue-info">分类：{issue.topic}</p>
            <p className="issue-info">状态：{issue.status}</p>
            <p className="issue-info issue-date">更新时间:{formattedDate}</p>
            <p className="issue-popularity">热度：{issue.popularity || 0}</p>
            <button
                className="btn-link"
                onClick={() => navigate(`/detail/${issue.id}`)}
            >
                查看详情
            </button>
            <hr />
        </div>
    );
}

export default IssueCard;