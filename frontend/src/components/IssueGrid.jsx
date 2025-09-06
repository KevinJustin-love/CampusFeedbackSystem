import React, { useEffect, useState } from 'react';
import IssueCard from "./IssueCard"
import {feedbackAPI} from "../api"

export default function IssueGrid({ issues, loading, error }){
    if(loading) return <div>加载中...</div>;

    if (error) return <div>加载失败: {error}</div>;

    return(
          <div className="issues-grid">
            {issues.length === 0 ? (
              <div>暂无问题</div>
            ) : (
              issues.map((issue) => (
                <IssueCard 
                  key={issue.id}  // 添加key属性
                  issue={issue} 
                />
              ))
            )}
          </div>
    );   
}
