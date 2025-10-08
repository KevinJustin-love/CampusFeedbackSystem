import React, { useEffect, useState } from 'react';
import IssueCard from "./IssueCard"
import { feedbackAPI } from "../api"

import "../styles/IssueGrid.css"

export default function IssueGrid({ issues, loading, error, renderMode }){
    if(loading) return <div>加载中...</div>;

    if (error) return <div>加载失败: {error}</div>;

    return(
      <div className="issues-grid">
        {issues.length === 0 ? (
          <div>暂无问题</div>
        ) : (
          issues.map((issue) => (
            <IssueCard 
              key={issue.id}
              issue={issue}
              renderMode={renderMode}
            />
          ))
        )}
      </div>
    );   
}
