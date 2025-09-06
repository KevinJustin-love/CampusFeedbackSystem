import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Home from "../components/Home"; // 导入 Home 组件
import HomeIssuesNavbar from "../components/HomeIssueNavbar.jsx"; 
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination"
import IssueGrid from "../components/IssueGrid";


const StudentDashboard = ({ user, issues, onSubmitIssue, onDetail, id }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all"); // 状态管理
  const [sortBy, setSortBy] = useState("time"); // 排序状态
  const [category, setCategory] = useState("all"); // 分类状态
  const [currentPage, setCurrentPage] = useState(1); // 当前页码状态
  const [itemsPerPage] = useState(5); // 每页显示5条数据

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
        // 假设有popularity字段，没有则用评论数等代替
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
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, category, sortBy]);

  return (
    <div className="dashboard-container">
      {/* 使用 Home 组件替代原有的标题栏 */}
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

        {/* 导航栏 */}
        <HomeIssuesNavbar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 筛选栏 */}
        <FilterBar
          sortBy={sortBy}
          onSortChange={setSortBy}
          category={category}
          onCategoryChange={setCategory}
        />

        {/* 问题展示 */}
        <IssueGrid />

        {/* 分页组件 */}
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