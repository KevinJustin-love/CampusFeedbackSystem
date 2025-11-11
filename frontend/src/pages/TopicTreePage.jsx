import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import SingleIssueTree from "../components/SingleIssueTree";
import { fetchIssues } from "../components/functions/FetchIssues";

import "../styles/TopicTreePage.css";

/**
 * TopicTreePage - 专题树展示页面
 * 用于展示特定主题的问题，以单树多分支的形式
 * 路由: /topic-tree/:topic
 */
const TopicTreePage = ({ user }) => {
  const { topic } = useParams(); // 从路由获取主题
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef(null);

  const issuesPerPage = 5; // 每棵树显示5个问题

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchIssues(setLoading, setIssues, setError, {
          params: { topic: topic || "all", sortBy: "time" },
        });
      } catch (err) {
        console.error("获取问题失败:", err);
      }
    };
    fetchData();
  }, [topic]);

  // 计算总页数
  const totalPages = Math.ceil(issues.length / issuesPerPage);
  const startIdx = currentPage * issuesPerPage;
  const currentIssues = issues.slice(startIdx, startIdx + issuesPerPage);

  // 主题名称映射
  const topicNames = {
    学业: "学业问题树",
    生活: "生活问题树",
    情感: "情感问题树",
    管理: "管理问题树",
    其他: "其他问题树",
    all: "全部问题树",
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  // 切换页面函数
  const changePage = (newPage) => {
    if (isAnimating || newPage === currentPage || newPage < 0 || newPage >= totalPages) {
      return;
    }
    
    setIsAnimating(true);
    setCurrentPage(newPage);
    
    // 动画结束后重置状态
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="topic-tree-page">
      <Hero user={user} onSearch={() => {}} />

      <div className="topic-tree-header">
        <button className="back-btn" onClick={handleBackToHome}>
          ← 返回主页
        </button>
        <h1 className="topic-title">{topicNames[topic] || "问题树"}</h1>
        <div className="topic-stats">共 {issues.length} 个问题</div>
      </div>

      <div className="tree-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>正在加载问题...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>😢 加载失败: {error}</p>
            <button onClick={() => window.location.reload()}>重试</button>
          </div>
        ) : issues.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🌱</div>
            <p>这里还没有问题，快来提交第一个吧！</p>
          </div>
        ) : (
          <>
            {/* 滑动树容器 */}
            <div className="slider-container">
              <div 
                ref={containerRef}
                className={`tree-slider ${isAnimating ? 'animating' : ''}`}
                style={{ transform: `translateX(-${currentPage * 100}%)` }}
              >
                {Array.from({ length: totalPages }).map((_, pageIndex) => (
                  <div key={pageIndex} className="tree-slide">
                    <SingleIssueTree 
                      issues={issues.slice(pageIndex * issuesPerPage, (pageIndex + 1) * issuesPerPage)} 
                      pageSize={issuesPerPage} 
                    />
                  </div>
                ))}
              </div>
            </div>

            {totalPages > 1 && (
              <div className="tree-pagination">
                <button
                  className="page-btn prev-btn"
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 0 || isAnimating}
                >
                  ← 上一棵树
                </button>
                <div className="page-indicator">
                  <span className="current-page">{currentPage + 1}</span>
                  <span className="separator">/</span>
                  <span className="total-pages">{totalPages}</span>
                  <span className="page-label">棵树</span>
                </div>
                <button
                  className="page-btn next-btn"
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages - 1 || isAnimating}
                >
                  下一棵树 →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* 底部提示 */}
      {!loading && !error && issues.length > 0 && (
        <div className="tree-footer">
          <p className="tip-text">💡 点击树冠或分支查看问题详情</p>
        </div>
      )}
    </div>
  );
};

export default TopicTreePage;
