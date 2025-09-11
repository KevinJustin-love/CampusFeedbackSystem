import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Home from "../components/Home";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";

import "../styles/admin&dash.css";
import "../styles/issueCard&admin.css";
import "../styles/AdminDashboard.css";
import IssueGrid from "../components/IssueGrid";
import { fetchIssues } from "../components/functions/FetchIssues";

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取并解码JWT令牌以获取用户角色和主题
  const token = localStorage.getItem(ACCESS_TOKEN);
  let userRoles = [];
  let userTopics = [];
  if (token) {
    const decodedToken = jwtDecode(token);
    userRoles = decodedToken.roles || [];
    userTopics = decodedToken.topics || [];
  }
  const isAdmin = userRoles.includes("super_admin") || userRoles.includes("content_admin");

  useEffect(() => {
    // 权限检查：如果不是管理员，重定向到学生页面
    if (!isAdmin) {
      navigate("/dashboard");
    } else {
      fetchIssues(setLoading, setIssues, setError);
    }
  }, [isAdmin, navigate]);

  // 根据管理员负责的主题来过滤问题
  const filteredIssues = issues
    .filter((issue) => {
      // 如果是超级管理员，显示所有问题
      if (userRoles.includes("super_admin")) {
        return true;
      }
      // 对于内容管理员，只显示与其主题匹配的问题
      return userTopics.includes(issue.topic);
    })
    .sort((a, b) => {
      return new Date(b.updated) - new Date(a.updated);
    });

  const handleSwitchToStudent = () => {
    navigate("/dashboard");
  };

  const handleRestoreClick = () => {
    // 导航到管理员恢复页面
    navigate("/admin/restore");
  };

  return (
    <div className="admin-container" style={{ padding: 0 }}>
      <Home user={user} />
      <div className="button-container">
        <button
          className="btn-switch"
          onClick={handleSwitchToStudent}>
          切换
        </button>
        {isAdmin && (
          <button className="btn-primary" onClick={handleRestoreClick}>
            管理员恢复
          </button>
        )}
      </div>

      <div className="content-wrapper">
        <IssueGrid
          isssue={filteredIssues}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;