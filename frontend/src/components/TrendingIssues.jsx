import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/TrendingIssues.css";

const TrendingIssues = () => {
  const [trendingIssues, setTrendingIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingIssues = async () => {
      try {
        setLoading(true);
        const response = await api.get("/feedback/issues/", {
          params: {
            sortBy: "popularity",
          },
        });

        // 取热度最高的前5个问题
        const topIssues = response.data.slice(0, 5);
        setTrendingIssues(topIssues);
      } catch (error) {
        console.error("获取热门问题失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingIssues();
  }, []);

  const handleIssueClick = (issueId) => {
    navigate(`/detail/${issueId}`);
  };

  return (
    <div className="trending-issues-sidebar">
      <div className="trending-header">
        <h3 className="trending-title">🔥 热门top5</h3>
      </div>

      <div className="trending-content">
        {loading ? (
          <div className="trending-loading">加载中...</div>
        ) : trendingIssues.length === 0 ? (
          <div className="trending-empty">暂无热门问题</div>
        ) : (
          <ul className="trending-list">
            {trendingIssues.map((issue, index) => (
              <li
                key={issue.id}
                className="trending-item"
                onClick={() => handleIssueClick(issue.id)}
              >
                <div className="trending-item-rank">#{index + 1}</div>
                <div className="trending-item-content">
                  <div className="trending-item-title">{issue.title}</div>
                  <div className="trending-item-meta">
                    <span className="trending-item-popularity">
                      🔥 {issue.popularity || 0}
                    </span>
                    <span className="trending-item-topic">{issue.topic}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TrendingIssues;
