import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../components/Home";
import IssuesNavbar from "../components/IssuesNavbar";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import IssueCard from "../components/IssueCard";

const StudentDashboard = ({ user, issues, onSubmitIssue, id }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("time");
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const handleSwitchToAdmin = () => {
    navigate("/admin");
  };

  // 综合过滤和排序逻辑
  const filteredIssues = issues
    .filter((issue) => activeTab === "all" || issue.author === user.username)
    .filter((issue) => category === "all" || issue.category === category)
    .sort((a, b) => {
      if (sortBy === "time") {
        return new Date(b.updated_at) - new Date(a.updated_at);
      } else {
        return (b.popularity || 0) - (a.popularity || 0);
      }
    });

  // 计算分页数据
  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const currentItems = filteredIssues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 重置页码当过滤条件变化时
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, category, sortBy]);

  return (
    <div className="dashboard-container">
      <Home user={user} />

      <div className="content-wrapper">
        <button
          onClick={onSubmitIssue}
          className="btn-primary"
          style={{ marginRight: "10px" }}
        >
          提交新问题
        </button>
        {user && user.role.includes("admin") && (
          <button
            onClick={handleSwitchToAdmin}
            className="btn-primary"
            style={{ marginRight: "20px" }}
          >
            切换
          </button>
        )}

        <IssuesNavbar activeTab={activeTab} onTabChange={setActiveTab} />

        <FilterBar
          sortBy={sortBy}
          onSortChange={setSortBy}
          category={category}
          onCategoryChange={setCategory}
        />

        <div className="issues-grid">
          {currentItems.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;