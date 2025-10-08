// IssueCard.jsx (信件风格改造)
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import api from "../api"; 

import "../styles/IssueCard.css";

function IssueCard({ issue, renderMode }) {
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

    useEffect(() => {
        const checkPermissions = async () => {
            try {
                const likeResponse = await api.get(`/feedback/issues/${issue.id}/like-status/`);
                setIsLiked(likeResponse.data.liked);

                const deleteResponse = await api.get(`/feedback/issues/${issue.id}/delete-permission/`);
                setCanDelete(deleteResponse.data.can_delete);
            } catch (error) {
                console.error('检查权限失败:', error);
            }
        };
        checkPermissions();
    }, [issue.id]);

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

    const handleViewClick = async () => {
        try {
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

    const handleDeleteClick = async (e) => {
        e.stopPropagation();
        if (!window.confirm('确定要删除这个问题吗？此操作不可撤销。')) return;

        try {
            await api.delete(`/feedback/issues/${issue.id}/delete/`);
            alert('问题删除成功');
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

    if (renderMode === 'forest') {
        return (
            <div className="issue-tree" onClick={handleViewClick}>
                <div className="tree-crown">
                    <span className="tree-title">{issue.title}</span>
                </div>
                <div className="tree-trunk">
                    <span className="tree-meta">{issue.topic} · {issue.status}</span>
                </div>
                <div className="tree-ground">
                    <button className={`interaction-button ${isLiked ? 'liked' : ''}`} onClick={handleLikeClick}>❤️ {likes}</button>
                    <span className="interaction-views">👁 {views}</span>
                    {canDelete && (
                        <button className="btn-delete" onClick={handleDeleteClick}>删除</button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="issue-card">
            <div className="issue-stamp">📮</div>
            <div className="issue-body">
                <h3 className="issue-title">{issue.title}</h3>
                <p className="issue-info">分类：{issue.topic}</p>
                <p className="issue-info">状态：{issue.status}</p>
            </div>
            <div className="card-footer">
                <div className="card-actions">
                    <button className="btn-link" onClick={handleViewClick}>查看详情</button>
                    {canDelete && (<button className="btn-delete" onClick={handleDeleteClick}>删除</button>)}
                </div>
                <div className="card-stats">
                    <div className="issue-interactions">
                        <button className={`interaction-button ${isLiked ? 'liked' : ''}`} onClick={handleLikeClick}>❤️ <span>{likes}</span></button>
                        <span className="interaction-views">👁 <span>{views}</span></span>
                    </div>
                </div>
            </div>
            <div className="issue-date">更新时间：{formattedDate}</div>
        </div>
    );
}

export default IssueCard;
