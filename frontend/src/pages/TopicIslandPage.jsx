import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import SingleIssueTree from "../components/SingleIssueTree";
import "../styles/TopicIslandPage.css";

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

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="container">
      <Hero user={user} onSearch={() => {}} />

      

      <div className="topic-tree-header">
        <h1 className="topic-title">{topicNames[topic] || "未知小岛"}</h1>
      </div>

      <div className="island-image-wrapper">
        <img
          src="/assets/island.png"
          alt="小岛背景"
          className="island-image"
        />
        {/* 嵌入式单树组件，缩小并定位在小岛上 */}
        <div className="embedded-tree">
          <SingleIssueTree issues={[]} pageSize={3} compact={true} />
        </div>
      </div>

      <button className="back-btn" onClick={handleBackToHome}>
          ← 返回主页
      </button>
    </div>
  );
}

export default TopicIslandPage;
