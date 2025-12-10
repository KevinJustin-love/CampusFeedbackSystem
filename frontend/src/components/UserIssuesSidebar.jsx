import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/UserIssuesSidebar.css";

const UserIssuesSidebar = ({ user }) => {
  const [userIssues, setUserIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserIssues = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get("/feedback/issues/", {
          params: {
            host: user.id,
          },
        });

        // 获取所有问题，最多显示10个
        const issues = response.data.slice(0, 10);
        setUserIssues(issues);
      } catch (error) {
        console.error("获取用户问题失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserIssues();
  }, [user]);

  const handleIssueClick = (issueId) => {
    navigate(`/detail/${issueId}`);
  };

  if (!user || !user.id) {
    return null;
  }

  return (
    <div className="user-issues-sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">我的问题</h3>
      </div>

      <div className="sidebar-content">
        {loading ? (
          <div className="sidebar-loading">加载中...</div>
        ) : userIssues.length === 0 ? (
          <div className="sidebar-empty">暂无提交的问题</div>
        ) : (
          <div className="issues-scroll-container">
            <ul className="issues-list">
              {userIssues.map((issue) => (
                <li
                  key={issue.id}
                  className="issue-item"
                  onClick={() => handleIssueClick(issue.id)}
                >
                  <div className="issue-item-icon">📮</div>
                  <div className="issue-item-content">
                    <div className="issue-item-title">{issue.title}</div>
                    <div className="issue-item-meta">
                      <span className="issue-item-status">{issue.status}</span>
                      <span className="issue-item-topic">{issue.topic}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserIssuesSidebar;
