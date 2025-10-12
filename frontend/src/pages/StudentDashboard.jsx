import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import IssuesNavbar from "../components/IssuesNavbar";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import IssueGrid from "../components/IssueGrid";
import SubmitIssuePage from "../pages/SubmitIssuePage";
import SingleIssueTree from "../components/SingleIssueTree";

import "../styles/StudentDashboard.css";
import "../styles/ForestIssue.css";

import { fetchIssues } from "../components/functions/FetchIssues";

const StudentDashboard = ({ user }) => {
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("time");
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);

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
      return Number(issue.host) === Number(user.id);
    })
    .filter((issue) => category === "all" || issue.topic === category)
    .filter((issue) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        issue.title.toLowerCase().includes(query) ||
        issue.description.toLowerCase().includes(query)
      );
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

  const handleIssueSubmitted = (newIssue) => {
    // 将新问题添加到列表最前面
    setIssues((prevIssues) => [newIssue, ...prevIssues]);
    // 提交成功后隐藏表单，并返回主视图
    setShowSubmitForm(false);
  };

  const renderContent = () => {
    if (showSubmitForm) {
      return (
        <SubmitIssuePage
          onIssueSubmitted={handleIssueSubmitted}
          onCancel={() => setShowSubmitForm(false)}
        />
      );
    }

    // 单树模式：当选择了具体分类时使用
    const isTreeMode = category !== "all";

    if (isTreeMode) {
      return (
        <>
          <FilterBar
            sortBy={sortBy}
            onSortChange={setSortBy}
            category={category}
            onCategoryChange={setCategory}
          />
          {searchQuery && (
            <div className="search-result-note">搜索结果: "{searchQuery}"</div>
          )}
          {loading ? (
            <div className="loading-message">加载中...</div>
          ) : error ? (
            <div className="error-message">加载失败: {error}</div>
          ) : (
            <div className="tree-display-container">
              <SingleIssueTree issues={filteredIssues} pageSize={5} />
            </div>
          )}
        </>
      );
    }

    // 默认列表模式
    return (
      <>
        <FilterBar
          sortBy={sortBy}
          onSortChange={setSortBy}
          category={category}
          onCategoryChange={setCategory}
        />
        {searchQuery && (
          <div className="search-result-note">搜索结果: "{searchQuery}"</div>
        )}
        <IssueGrid issues={currentItems} loading={loading} error={error} />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </>
    );
  };

  const isForest = category !== "all";

  return (
    <div
      className={
        isForest
          ? "dashboard-container forest-container"
          : "dashboard-container"
      }
    >
      {isForest && (
        <div className={`forest-bg ${false ? "blurred" : ""}`}></div>
      )}
      <Hero user={user} onSearch={handleSearch} />
      <div
        className={
          isForest ? "content-wrapper forest-content" : "content-wrapper"
        }
      >
        <div
          className={
            isForest
              ? "dashboard-controls-header forest-controls"
              : "dashboard-controls-header"
          }
        >
          <IssuesNavbar activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="top-buttons-container">
            {user && user.username && user.username.includes("admin") && (
              <button
                onClick={() => navigate("/admin")}
                className={isForest ? "btn-primary forest-btn" : "btn-primary"}
              >
                切换
              </button>
            )}
            {!showSubmitForm && (
              <button
                onClick={() => setShowSubmitForm(true)}
                className={
                  isForest
                    ? "btn-primary submit-issue-btn forest-btn"
                    : "btn-primary submit-issue-btn"
                }
              >
                提交新问题 <span className="icon-pigeon">🕊️</span>
              </button>
            )}
          </div>
        </div>

        {activeTab === "mine" && (!user || !user.username) && (
          <div
            className="error-message"
            style={{ color: isForest ? "#2d6a4f" : "red", margin: "10px 0" }}
          >
            无法显示"我的"问题：用户信息缺失
          </div>
        )}

        {renderContent()}
      </div>
    </div>
  );
};

export default StudentDashboard;
