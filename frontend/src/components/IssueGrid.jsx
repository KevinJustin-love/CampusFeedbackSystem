import React from 'react';

export default function IssueGrid(){
    <div className="issues-grid">
        {currentItems.map((issue) => (
            <div key={issue.id} className="issue-card">
              <h3 className="issue-title">{issue.title}</h3>
              <p className="issue-info">分类：{issue.category}</p>
              <p className="issue-info">状态：{issue.status}</p>
              <p className="issue-info issue-date">
                更新时间：{issue.updated_at}
              </p>
              <p className="issue-popularity">热度：{issue.popularity || 0}</p>
              <button
                className="btn-link"
                onClick={() => navigate(`/detail/${issue.id}`)}
              >
                查看详情
              </button>
              <hr />
            </div>
          ))}
    </div>
}
