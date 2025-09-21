// IssueCard.jsx (修改后)

import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
// 从 api.js 导入 axios 实例
import api from "../api"; 

import "../styles/IssueCard.css";

function IssueCard({ issue }) {
    const navigate = useNavigate();
    const updatedDateString = issue?.updated;

    const [likes, setLikes] = useState(issue.likes || 0);
    const [views, setViews] = useState(issue.views || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [canDelete, setCanDelete] = useState(false);

    let formattedDate = 'N/A';
    if (updatedDateString) {
        const dateObject = new Date(updatedDateString);
        formattedDate = dateObject.toLocaleString();
    }

    // 检查用户是否已点赞和删除权限
    useEffect(() => {
        const checkPermissions = async () => {
            try {
                // 检查点赞状态
                const likeResponse = await api.get(`/feedback/issues/${issue.id}/like-status/`);
                setIsLiked(likeResponse.data.liked);
                
                // 检查删除权限
                const deleteResponse = await api.get(`/feedback/issues/${issue.id}/delete-permission/`);
                setCanDelete(deleteResponse.data.can_delete);
            } catch (error) {
                console.error('检查权限失败:', error);
            }
        };
        checkPermissions();
    }, [issue.id]);

    // 处理点赞点击事件
    const handleLikeClick = async (e) => {
        e.stopPropagation();
        
        try {
            const response = await api.post(`/feedback/issues/${issue.id}/like/`);
            
            if (response.data.likes !== undefined) {
                setLikes(response.data.likes);
                setIsLiked(response.data.liked);
            }
        } catch (error) {
            console.error('点赞失败:', error);
            if (error.response?.status === 401) {
                alert('请先登录后再点赞');
            }
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

    // 处理删除点击事件
    const handleDeleteClick = async (e) => {
        e.stopPropagation();
        
        if (!window.confirm('确定要删除这个问题吗？此操作不可撤销。')) {
            return;
        }
        
        try {
            await api.delete(`/feedback/issues/${issue.id}/delete/`);
            alert('问题删除成功');
            // 刷新页面或通知父组件更新列表
            window.location.reload();
        } catch (error) {
            console.error('删除失败:', error);
            if (error.response?.status === 403) {
                alert('您没有权限删除此问题');
            } else {
                alert('删除失败，请稍后重试');
            }
        }
    };

    return (
        <div className="issue-card">
            <h3 className="issue-title">{issue.title}</h3>
            <p className="issue-info">分类：{issue.topic}</p>
            <p className="issue-info">状态：{issue.status}</p>
            <p className="issue-date">更新时间:{formattedDate}</p>

            <div className="card-footer">
                <div className="card-actions">
                    <button
                        className="btn-link"
                        onClick={handleViewClick}
                    >
                        查看详情
                    </button>
                    {canDelete && (
                        <button
                            className="btn-delete"
                            onClick={handleDeleteClick}
                            title="删除问题"
                        >
                            删除
                        </button>
                    )}
                </div>
                
                <div className="card-stats">
                    <div className="issue-interactions">
                        <button 
                            className={`interaction-button ${isLiked ? 'liked' : ''}`}
                            onClick={handleLikeClick}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                            </svg>
                            <span>{likes}</span>
                        </button>
                        <span className="interaction-views">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="icon">
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