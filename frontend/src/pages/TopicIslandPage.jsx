import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import SingleIssueTree from "../components/SingleIssueTree";
import "../styles/TopicIslandPage.css";
import ForestOnIsland from "../components/ForestOnIsland";
import { feedbackAPI } from "../api";

const TopicIslandPage = ({ user }) => {
  const { topic } = useParams(); // 从路由获取主题
  const navigate = useNavigate();
  // 主题名称映射
  const topicNames = {
    学业: "学业小岛",
    生活: "生活小岛",
    管理: "管理小岛",
    情感: "情感小岛",
    其他: "其他小岛",
  };
  // 真实后端数据：每次加载时获取该topic的问题数量
  const [issueCount, setIssueCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    feedbackAPI
      .getIssueList({ params: { topic } })
      .then((res) => {
        if (isMounted) {
          setIssueCount(
            Array.isArray(res.data)
              ? res.data.length
              : res.data?.results?.length || 0
          );
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError("获取问题数量失败");
          setIssueCount(0);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [topic]);
  function getForestMode(issueCount) {
    if (issueCount < 5) return 0; // 稀疏
    if (issueCount < 15) return 1; // 较茂盛
    if (issueCount < 30) return 2; // 茂盛
    return 3; // 非常茂盛
  }
  // 开发测试用mode切换
  const [devMode, setDevMode] = useState(null); // null=自动, 0-3=手动

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="container topic-island">
      <Hero user={user} onSearch={() => {}} />

      <div className="island-header">
        <h1 className="island-title">
          {topicNames[topic] || "未知小岛"}
          {loading ? (
            <span style={{ fontSize: 18, color: "#888", marginLeft: 16 }}>
              (加载中...)
            </span>
          ) : (
            <span style={{ fontSize: 18, color: "#388e3c", marginLeft: 16 }}>
              共 {issueCount} 个问题
            </span>
          )}
        </h1>
        {error && <div style={{ color: "red", fontSize: 14 }}>{error}</div>}
      </div>

      {/* 开发测试：森林模式切换按钮 */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 14, marginRight: 8 }}>开发模式：</span>
        {[0, 1, 2, 3].map((m) => (
          <button
            key={m}
            style={{
              margin: "0 4px",
              padding: "2px 10px",
              background: devMode === m ? "#388e3c" : "#e0e0e0",
              color: devMode === m ? "#fff" : "#333",
              border: "1px solid #bbb",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: devMode === m ? 700 : 400,
            }}
            onClick={() => setDevMode(m)}
          >
            {m}
          </button>
        ))}
        <button
          style={{
            margin: "0 4px",
            padding: "2px 10px",
            background: devMode === null ? "#1976d2" : "#e0e0e0",
            color: devMode === null ? "#fff" : "#333",
            border: "1px solid #bbb",
            borderRadius: 6,
            cursor: "pointer",
            fontWeight: devMode === null ? 700 : 400,
          }}
          onClick={() => setDevMode(null)}
        >
          自动
        </button>
      </div>

      <div className="island-image-wrapper" style={{ position: "relative" }}>
        {/* 森林 SVG 叠加在小岛上，zIndex更高 */}
        <ForestOnIsland
          mode={devMode !== null ? devMode : getForestMode(issueCount)}
        />
        <IslandImageWithHover />
      </div>

      <button className="island-back-btn" onClick={handleBackToHome}>
        ← 返回主页
      </button>
    </div>
  );
};

// 浮动动画+发光效果组件
function IslandImageWithHover() {
  const [hovered, setHovered] = React.useState(false);
  const { topic } = useParams();
  const navigate = useNavigate();
  return (
    <img
      src="/assets/island.png"
      alt="小岛背景"
      className="island-image"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/topic-tree/${topic}`)}
      draggable={false}
      style={{
        transition: "transform 0.5s cubic-bezier(.4,2,.6,1)",
        transform: hovered ? "scale(1.06)" : "scale(1)",
        zIndex: 2,
        position: "relative",
        cursor: "pointer",
        pointerEvents: "auto",
      }}
    />
  );
}

export default TopicIslandPage;
