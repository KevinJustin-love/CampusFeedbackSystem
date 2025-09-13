import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../components/Home";
import AdminIssueCard from "../components/AdminIssueCard";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";
import { feedbackAPI } from "../api";

import "../styles/admin&dash.css";
import "../styles/AdminDashboard.css";

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
  const isAdmin = userRoles.includes("super_admin") || userRoles.some(role => role.endsWith("_admin"));

  useEffect(() => {
    // 权限检查：如果不是管理员，重定向到学生页面
    if (!isAdmin) {
      navigate("/dashboard");
    } else {
      fetchAdminIssues();
    }
  }, [isAdmin, navigate]);

  const fetchAdminIssues = async () => {
    try {
      setLoading(true);
      const response = await feedbackAPI.getAdminIssues();
      setIssues(response.data);
      setError(null);
    } catch (error) {
      console.error('获取管理员问题列表失败:', error);
      setError('获取问题列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleReplySuccess = () => {
    // 回复成功后重新获取问题列表
    fetchAdminIssues();
  };

  // 后端已经按照管理员权限过滤过了，这里直接使用

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
      </div>

      <div className="content-wrapper">
        {loading && <div className="loading-container">加载中...</div>}
        {error && <div className="error-container">{error}</div>}
        {!loading && !error && (
          <div className="admin-issues-container">
            <h2 className="admin-issues-title">问题管理 ({issues.length} 个问题)</h2>
            {issues.length === 0 ? (
              <div className="no-issues">暂无问题</div>
            ) : (
              issues.map(issue => (
                <AdminIssueCard
                  key={issue.id}
                  issue={issue}
                  onReplySuccess={handleReplySuccess}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;