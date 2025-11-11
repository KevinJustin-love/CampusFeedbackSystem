import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import SingleIssueTree from "../components/SingleIssueTree";
import "../styles/TopicIslandPage.css";
import ForestOnIsland from "../components/ForestOnIsland";

const TopicIslandPage = ({ user }) => {

  const { topic } = useParams(); // 从路由获取主题
  const navigate = useNavigate();
  // 主题名称映射
  const topicNames = {
    学业: "学业小岛",
    生活: "生活小岛",
    情感: "情感小岛",
    管理: "管理小岛",
    其他: "未知小岛",
  };
  // TODO: 替换为真实后端数据
  // 假设每个 topic 问题数量如下
  const topicIssueCount = {
    "学业": 3,
    "生活": 8,
    "情感": 18,
    "管理": 28,
    "其他": 40,
  };
  const issueCount = topicIssueCount[topic] || 0;
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
        <h1 className="island-title">{topicNames[topic] || "未知小岛"}</h1>
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
        <img
          src="/assets/island.png"
          alt="小岛背景"
          className="island-image"
        />
        {/* 森林 SVG 叠加在小岛上 */}
        <ForestOnIsland mode={devMode !== null ? devMode : getForestMode(issueCount)} />
      </div>

      <button className="island-back-btn" onClick={handleBackToHome}>
        ← 返回主页
      </button>
    </div>
  );
}

export default TopicIslandPage;
