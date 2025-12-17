import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import IssuesNavbar from "../components/IssuesNavbar";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import IssueGrid from "../components/IssueGrid";
import UserIssuesSidebar from "../components/UserIssuesSidebar";
import TrendingIssues from "../components/TrendingIssues";

import "../styles/StudentDashboard.css";

import { fetchIssues } from "../components/functions/FetchIssues";

const StudentDashboard = ({ user }) => {
  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(!!query.trim());
  };
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("time");
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("topic");
    if (t) setCategory(t);
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchIssues(setLoading, setIssues, setError, {
          params: { topic: category, sortBy: sortBy },
        });
        console.log("API返回数据:", data);
        console.log("处理前的问题数据:", issues);
        console.log("用户对象:", user);

        if (data && data.length > 0) {
          console.log("第一个问题的完整数据:", data[0]);
          console.log("host字段类型:", typeof data[0].host);
        }
      } catch (error) {
        console.error("数据获取失败:", error);
      }
    };
    fetchData();
  }, [category, sortBy, user]);

  //综合过滤和排序逻辑
  const filteredIssues = issues
    .filter((issue) => {
      if (activeTab === "all") return true;
      if (!user?.id) {
        console.error("用户ID缺失，无法过滤'我的'问题", user);
        return false;
      }
      console.log("比较host:", issue.host, "用户ID:", user.id);
      const hostId =
        issue.host && typeof issue.host === "object"
          ? issue.host.id ?? issue.host.user_id ?? issue.host.userId
          : issue.host;
      if (hostId == null) {
        console.warn("无法识别问题所属用户", issue);
        return false;
      }
      return String(hostId) === String(user.id);
    })
    .filter((issue) => category === "all" || issue.topic === category)
    .filter((issue) => {
      if (!searchQuery.trim()) return true;

      const searchText = searchQuery.toLowerCase().trim();
      const title = issue.title.toLowerCase();
      const description = issue.description.toLowerCase();

      // 1. 完全匹配（保留原有功能）
      if (title.includes(searchText) || description.includes(searchText)) {
        return true;
      }

      // 2. 中文分词模糊匹配 - 专门解决"食堂菜"搜索"食堂饭菜"的问题
      if (searchText.length >= 2) {
        // 方法1：检查搜索词是否被包含在标题或描述中
        if (title.includes(searchText) || description.includes(searchText)) {
          return true;
        }

        // 方法2：检查搜索词是否包含在标题或描述的某个部分中
        const titleWords = title.split(/\s+/);
        const descWords = description.split(/\s+/);

        const titleContainsSearch = titleWords.some((word) =>
          word.includes(searchText)
        );
        const descContainsSearch = descWords.some((word) =>
          word.includes(searchText)
        );

        if (titleContainsSearch || descContainsSearch) {
          return true;
        }

        // 方法3：检查标题或描述是否包含搜索词的某个部分
        for (let i = 0; i < searchText.length - 1; i++) {
          for (let j = i + 2; j <= searchText.length; j++) {
            const part = searchText.substring(i, j);
            if (
              part.length >= 2 &&
              (title.includes(part) || description.includes(part))
            ) {
              return true;
            }
          }
        }
      }

      return false;
    })
    .sort((a, b) => {
      if (sortBy === "time") {
        return new Date(b.updated) - new Date(a.updated);
      } else {
        // 直接使用后端返回的 popularity 值进行排序
        return (b.popularity || 0) - (a.popularity || 0);
      }
    });

  //计算分页数据
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const currentItems = filteredIssues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 重置页码当过滤条件变化时
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, category, sortBy, searchQuery]);

  return (
    <div className="dashboard-container">
      <div style={{ position: "relative", zIndex: 1000 }}>
        <Hero user={user} onSearch={handleSearch} isSearching={isSearching} />
      </div>
      <div className="dashboard-main-layout">
        <UserIssuesSidebar user={user} />
        <div
          className="content-wrapper"
          style={{ position: "relative", zIndex: 100 }}
        >
          <div className="dashboard-controls-header">
            <IssuesNavbar activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="top-buttons-container">
              {user && user.username && user.username.includes("admin") && (
                <button
                  onClick={() => navigate("/admin")}
                  className="btn-primary"
                >
                  切换
                </button>
              )}
              <button
                onClick={() => navigate("/submit")}
                className="btn-primary submit-issue-btn"
              >
                提交新问题 <span className="icon-pigeon">🕊️</span>
              </button>
            </div>
          </div>

          {activeTab === "mine" && (!user || !user.username) && (
            <div
              className="error-message"
              style={{ color: "red", margin: "10px 0" }}
            >
              无法显示"我的"问题：用户信息缺失
            </div>
          )}

          <FilterBar
            sortBy={sortBy}
            onSortChange={setSortBy}
            category={category}
            onCategoryChange={setCategory}
          />
          {searchQuery && (
            <div
              className="search-result-note"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                margin: "10px 0",
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
          <IssueGrid issues={currentItems} loading={loading} error={error} />
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
        <TrendingIssues />
      </div>
    </div>
  );
};

export default StudentDashboard;
