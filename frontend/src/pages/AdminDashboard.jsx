import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../components/Home";
import AdminIssueCard from "../components/AdminIssueCard";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN } from "../constants";
import { feedbackAPI } from "../api";
import { useNotifications } from "../hooks/useNotifications";

import "../styles/admin&dash.css";
import "../styles/AdminDashboard.css";

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // 添加搜索查询状态
  
  // 使用管理员过滤的通知Hook
  const { unreadCount, fetchUnreadCount } = useNotifications(true);

  // 获取并解码JWT令牌以获取用户角色和主题
  const token = localStorage.getItem(ACCESS_TOKEN);
  let userRoles = [];
  let userTopics = [];
  if (token) {
    const decodedToken = jwtDecode(token);
    userRoles = decodedToken.roles || [];
    userTopics = decodedToken.topics || [];
  }
  const isAdmin =
    userRoles.includes("super_admin") ||
    userRoles.some((role) => role.endsWith("_admin"));

  useEffect(() => {
    // 权限检查：如果不是管理员，重定向到学生页面
    if (!isAdmin) {
      navigate("/dashboard");
    } else {
      fetchAdminIssues();
      // 获取管理员相关的未读通知数量
      fetchUnreadCount();
    }
  }, [isAdmin, navigate, fetchUnreadCount]);

  const fetchAdminIssues = async () => {
    try {
      setLoading(true);
      const response = await feedbackAPI.getAdminIssues();
      setIssues(response.data);
      setError(null);
    } catch (error) {
      console.error("获取管理员问题列表失败:", error);
      setError("获取问题列表失败");
    } finally {
      setLoading(false);
    }
  };

  const handleReplySuccess = () => {
    // 回复成功后重新获取问题列表
    fetchAdminIssues();
  };

  // 添加搜索处理函数
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // 过滤问题列表（根据搜索查询）
  const filteredIssues = issues.filter((issue) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      (issue.title || "").toLowerCase().includes(query) ||
      (issue.description || "").toLowerCase().includes(query) ||
      (issue.author || "").toLowerCase().includes(query) // 管理员还可以按作者搜索
    );
  });

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
      <Home user={user} onSearch={handleSearch} adminUnreadCount={unreadCount} adminFilter={true} />
      <div className="button-container">
        <button className="btn-switch" onClick={handleSwitchToStudent}>
          切换
        </button>
      </div>

      <div className="content-wrapper">
        {loading && <div className="loading-container">加载中...</div>}
        {error && <div className="error-container">{error}</div>}
        {!loading && !error && (
          <div className="admin-issues-container">
            <h2 className="admin-issues-title">
              问题管理 ({filteredIssues.length} 个问题)
            </h2>
            {searchQuery && (
              <div
                style={{ margin: "10px 0", fontSize: "14px", color: "#666" }}
              >
                搜索结果: "{searchQuery}"
              </div>
            )}
            {filteredIssues.length === 0 ? (
              <div className="no-issues">
                {searchQuery ? "未找到匹配的问题" : "暂无问题"}
              </div>
            ) : (
              filteredIssues.map((issue) => (
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
