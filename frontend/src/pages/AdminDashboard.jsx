import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../components/Hero";
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
  const [isSearching, setIsSearching] = useState(false); // 添加搜索状态
  
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
    setIsSearching(!!query.trim());
  };

  // 优化的搜索函数 - 支持更智能的中文模糊匹配
  const searchIssues = (issue, query) => {
    if (!query.trim()) return true;
    
    const searchText = query.toLowerCase().trim();
    const title = (issue.title || "").toLowerCase();
    const description = (issue.description || "").toLowerCase();
    const author = (issue.author || "").toLowerCase();
    
    // 1. 完全匹配（保留原有功能）
    if (title.includes(searchText) || 
        description.includes(searchText) || 
        author.includes(searchText)) {
      return true;
    }
    
    // 2. 中文分词模糊匹配 - 专门解决"食堂菜"搜索"食堂饭菜"的问题
    // 将搜索词拆分为可能的组合，检查是否在标题或描述中
    if (searchText.length >= 2) {
      // 方法1：检查搜索词是否被包含在标题或描述中
      if (title.includes(searchText) || description.includes(searchText)) {
        return true;
      }
      
      // 方法2：检查搜索词是否包含在标题或描述的某个部分中
      // 例如："食堂菜"包含在"食堂饭菜"中
      const titleWords = title.split(/\s+/);
      const descWords = description.split(/\s+/);
      
      const titleContainsSearch = titleWords.some(word => word.includes(searchText));
      const descContainsSearch = descWords.some(word => word.includes(searchText));
      
      if (titleContainsSearch || descContainsSearch) {
        return true;
      }
      
      // 方法3：检查标题或描述是否包含搜索词的某个部分
      // 例如："食堂饭菜"包含"食堂"和"饭菜"，搜索"食堂菜"时应该匹配
      for (let i = 0; i < searchText.length - 1; i++) {
        for (let j = i + 2; j <= searchText.length; j++) {
          const part = searchText.substring(i, j);
          if (part.length >= 2 && (title.includes(part) || description.includes(part))) {
            return true;
          }
        }
      }
    }
    
    return false;
  };

  // 过滤问题列表（根据搜索查询）
  const filteredIssues = issues.filter((issue) => {
    if (!searchQuery.trim()) return true;
    return searchIssues(issue, searchQuery);
  });

  // 后端已经按照管理员权限过滤过了，这里直接使用

  const handleSwitchToStudent = () => {
    navigate("/dashboard");
  };

  const handleRestoreClick = () => {
    // 导航到管理员恢复页面
    navigate("/admin/restore");
  };

  console.log('Rendering AdminDashboard - isAdmin:', isAdmin);
  return (
    <div className="admin-container" style={{ padding: 0, position: 'relative' }}>
      <Home user={user} onSearch={handleSearch} adminUnreadCount={unreadCount} adminFilter={true} isSearching={isSearching} />
      {isAdmin && (
        <div 
          style={{
            position: 'fixed',
            top: '80px',
            right: '45px',
            zIndex: 1001,
            display: 'flex',
            gap: '10px',
            opacity: '1 !important',
            visibility: 'visible !important',
            pointerEvents: 'auto !important'
          }}
        >
          <button 
            style={{
              width: '100px',
              height: '40px',
              backgroundColor: '#667eea',
              color: 'white',
              border: '2px solid white',
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onClick={handleSwitchToStudent}
          >
            切换
          </button>
        </div>
      )}

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
                style={{ 
                  margin: "10px 0", 
                  fontSize: "14px", 
                  color: "#666",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                <span>搜索结果: "{searchQuery}"</span>
                <button
                  onClick={() => handleSearch("")}
                  style={{
                    background: "#667eea",
                    border: "1px solid #5a67d8",
                    borderRadius: "4px",
                    cursor: "pointer",
                    padding: "4px 10px",
                    fontSize: "11px",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "500",
                    boxShadow: "0 1px 2px rgba(102, 126, 234, 0.3)",
                    transition: "all 0.2s ease-in-out",
                    height: "24px",
                    lineHeight: "1",
                    minWidth: "80px",
                    whiteSpace: "nowrap",
                    letterSpacing: "-0.3px",
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ marginRight: "4px" }}
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  返回全部
                </button>
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
