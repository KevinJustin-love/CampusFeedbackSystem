// IssueCard.jsx (修改后)

import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
// 从 api.js 导入 axios 实例
import api from "../api"; 

import "../styles/IssueCard.css";

function IssueCard({ issue }) {
    const navigate = useNavigate();
    const updatedDateString = issue?.updated;

    const [likes, setLikes] = useState(issue.likes || 0);
    const [views, setViews] = useState(issue.views || 0);

    let formattedDate = 'N/A';
    if (updatedDateString) {
        const dateObject = new Date(updatedDateString);
        formattedDate = dateObject.toLocaleString();
    }

    // 处理点赞点击事件
    const handleLikeClick = async (e) => {
        e.stopPropagation();
        
        try {
            // 使用 api 实例，并修改请求路径
            const response = await api.post(`/feedback/issues/${issue.id}/like/`);
            
            if (response.data.likes) {
                setLikes(response.data.likes);
            } else {
                setLikes(prevLikes => prevLikes + 1);
            }
        } catch (error) {
            console.error('点赞失败:', error);
        }
    };

    // 处理查看详情点击事件
    const handleViewClick = async () => {
        try {
            // 使用 api 实例，并修改请求路径
            const response = await api.post(`/feedback/issues/${issue.id}/view/`);
            
            if (response.data.views) {
                setViews(response.data.views);
            } else {
                setViews(prevViews => prevViews + 1);
            }
        } catch (error) {
            console.error('浏览量更新失败:', error);
        }
        
        navigate(`/detail/${issue.id}`);
    };

    return (
        <div className="issue-card">
            <h3 className="issue-title">{issue.title}</h3>
            <p className="issue-info">分类：{issue.topic}</p>
            <p className="issue-info">状态：{issue.status}</p>
            <p className="issue-date">更新时间:{formattedDate}</p>

            <div className="card-footer">
                <button
                    className="btn-link"
                    onClick={handleViewClick}
                >
                    查看详情
                </button>
                
                <div className="card-stats">
                    <p className="issue-popularity">热度：{issue.popularity || 0}</p>
                    <div className="issue-interactions">
                        <button 
                            className="interaction-button"
                            onClick={handleLikeClick}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                                <path d="M14 9V5a3 3 0 0 0-6 0v4H4v10h10l2-6h4V9z"/>
                            </svg>
                            <span>{likes}</span>
                        </button>
                        <span className="interaction-views">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                            <span>{views}</span>
                        </span>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
}

export default IssueCard;