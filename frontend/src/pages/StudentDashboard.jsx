import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../components/Home";
import IssuesNavbar from "../components/IssuesNavbar";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import IssueGrid from "../components/IssueGrid";
import SubmitIssuePage from "../pages/SubmitIssuePage";


import "../styles/admin&dash.css";
import "../styles/StudentDashboard.css";

import { fetchIssues } from "../components/functions/FetchIssues";

const StudentDashboard = ({ user }) => {
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  const navigate = useNavigate();
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

  // 在 useEffect 中从 API 获取问题列表
  useEffect(() => {
    fetchIssues(setLoading, setIssues, setError, { params: { topic: category, sortBy: sortBy } });
  }, [category, sortBy]);


  //综合过滤和排序逻辑
  const filteredIssues = issues
    .filter((issue) => activeTab === "all" || issue.author === user.username)
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
    setIssues(prevIssues => [newIssue, ...prevIssues]);
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
    
    return (
      <>
        <IssuesNavbar activeTab={activeTab} onTabChange={setActiveTab} />
        <FilterBar
          sortBy={sortBy}
          onSortChange={setSortBy}
          category={category}
          onCategoryChange={setCategory}
        />
        {searchQuery && (
          <div style={{ margin: '10px 0', fontSize: '14px', color: '#666' }}>
            搜索结果: "{searchQuery}"
          </div>
        )}
        <IssueGrid
          issues={currentItems}
          loading={loading}
          error={error}
        />
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

  return (
    <div className="dashboard-container">
      <Home user={user} onSearch={handleSearch} />
      <div className="content-wrapper">
        {!showSubmitForm && (
          <button
            onClick={() => setShowSubmitForm(true)}
            className="btn-primary"
            style={{ marginRight: "10px" }}
          >
            提交新问题
          </button>
        )}
        {user && user.role.includes("admin") && (
          <button
            onClick={() => navigate("/admin")}
            className="btn-primary"
            style={{ marginRight: "20px" }}
          >
            切换
          </button>
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default StudentDashboard;