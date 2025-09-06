import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Home from "../components/Home";
import IssuesNavbar from "../components/IssuesNavbar";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import IssueGrid from "../components/IssueGrid";
import SubmitIssuePage from "../pages/SubmitIssuePage";
import { feedbackAPI } from "../api";

const StudentDashboard = ({ user, id }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("time");
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  // 在 useEffect 中从 API 获取问题列表
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const res = await feedbackAPI.getIssueList();
        setIssues(res.data);
        setError(null);
      } catch (err) {
        console.error("获取问题列表失败：", err);
        setError("加载问题列表失败。请稍后重试。");
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const handleSwitchToAdmin = () => {
    navigate("/admin");
  };

  //综合过滤和排序逻辑
  const filteredIssues = issues
    .filter((issue) => activeTab === "all" || issue.author === user.username)
    .filter((issue) => category === "all" || issue.category === category)
    .sort((a, b) => {
      if (sortBy === "time") {
        return new Date(b.updated_at) - new Date(a.updated_at);
      } else {
        // 定义权重，你可以根据实际需求调整这些值
        const LIKE_WEIGHT = 2; // 点赞的权重
        const VIEW_WEIGHT = 1;  // 浏览量的权重

        // 计算每个问题的 popularity 得分
        const scoreA = (a.likes || 0) * LIKE_WEIGHT + (a.views || 0) * VIEW_WEIGHT;
        const scoreB = (b.likes || 0) * LIKE_WEIGHT + (b.views || 0) * VIEW_WEIGHT;

        // 按照得分降序排列
        return scoreB - scoreA;
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
  }, [activeTab, category, sortBy]);

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
      <Home user={user} />
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