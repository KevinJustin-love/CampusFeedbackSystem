// TopicTreePage.jsx - 沉浸式动漫风格页面
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import SingleIssueTree from "../components/SingleIssueTree";
import GuideAnimation from "../components/GuideAnimation";
import { fetchIssues } from "../components/functions/FetchIssues"; 
import { motion, AnimatePresence } from "framer-motion";
import Hero from "../components/Hero";
import "../styles/TopicTreePage.css";

// 引入一个漂亮的动漫风格风景图 (使用指定图片源)
const ANIME_BG_URL =
  "/assets/forest-bg.png"; // 动漫风格森林背景
// 备选: 蓝天草地风格

const TopicTreePage = ({ user, onSearch }) => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // 用于动画方向
  const [showGuide, setShowGuide] = useState(false); // 初始为 false，数据加载后改为 true

  const issuesPerPage = 5;

  useEffect(() => {
    // 模拟数据获取，请替换回你的 fetchIssues 逻辑
    const loadData = async () => {
      setLoading(true);
      try {
        // 这里保留你的 fetchIssues 调用
        await fetchIssues(setLoading, setIssues, (err) => console.log(err), {
          params: { topic: topic || "all", sortBy: "time" },
        });
      } catch (e) {
        console.error(e);
      }
    };
    loadData();
  }, [topic]);

  // 数据加载完成后显示引导
  useEffect(() => {
    if (!loading && issues.length > 0) {
      // 延迟 100ms 确保 DOM 已准备好
      const timer = setTimeout(() => {
        setShowGuide(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, issues.length]);

  const totalPages = Math.ceil(issues.length / issuesPerPage);
  const currentIssueSlice = issues.slice(
    currentPage * issuesPerPage,
    (currentPage + 1) * issuesPerPage
  );

  const handlePageChange = (newDir) => {
    const newPage = currentPage + newDir;
    if (newPage >= 0 && newPage < totalPages) {
      setDirection(newDir);
      setCurrentPage(newPage);
    }
  };

  const handleGuideComplete = () => {
    setShowGuide(false);
  };

  const topicMap = {
    学业: { title: "知识之森", color: "#4CAF50", icon: "📚" },
    生活: { title: "日常原野", color: "#FF9800", icon: "☕" },
    管理: { title: "秩序高塔", color: "#2196F3", icon: "⚖️" },
    情感: { title: "心之花园", color: "#E91E63", icon: "💌" },
    all: { title: "世界树", color: "#9C27B0", icon: "🌳" },
  };

  const theme = topicMap[topic] || topicMap["all"];

  // 定义引导步骤
  const guideSteps = [
    {
      targetSelector: ".topic-tree-slider",
      text: "点击叶子可以查看问题详情",
      offsetTop: 150
    }
  ];

  return (
    <>
    <Hero user={user} onSearch={onSearch} />
    <div
      className="anime-page-wrapper"
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundImage: `url(${ANIME_BG_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
        position: "relative",
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
      }}
    >
      {/* 引导动画 */}
      {showGuide && <GuideAnimation guides={guideSteps} onComplete={handleGuideComplete} />}

      {/* 遮罩层，确保文字清晰 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 40%, rgba(0,0,0,0.1) 100%)",
        }}
      />

      {/* --- 顶部 HUD 导航 --- */}
      <header
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {/* 标题 (卷轴/牌匾风格) */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(5px)",
            padding: "10px 40px",
            borderRadius: "0 0 20px 20px",
            border: `3px solid ${theme.color}`,
            borderTop: "none",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: theme.color,
              fontSize: "28px",
              textShadow: "1px 1px 0 #FFF",
            }}
          >
            {theme.icon} {theme.title}
          </h1>
          <span style={{ fontSize: "18px", color: "#666", marginTop: "5px" }}>
            共 {issues.length} 个问题
          </span>
        </div>
      </header>

      {/* --- 核心内容区域 --- */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: "20px", // 树根距离底部的距离
        }}
      >
        {loading ? (
          <div
            style={{
              fontSize: "24px",
              color: "#FFF",
              fontWeight: "bold",
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            正在生成地形...
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              height: "85%",
              position: "relative",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            {/* 左翻页按钮 (悬浮) */}
            {totalPages > 1 && (
              <motion.button
                disabled={currentPage === 0}
                onClick={() => handlePageChange(-1)}
                whileHover={{ scale: 1.2, x: -5 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  position: "absolute",
                  left: "10%",
                  top: "50%",
                  zIndex: 20,
                  background: "rgba(255,255,255,0.6)",
                  border: "none",
                  borderRadius: "50%",
                  width: "60px",
                  height: "60px",
                  fontSize: "30px",
                  cursor: currentPage === 0 ? "not-allowed" : "pointer",
                  opacity: currentPage === 0 ? 0.3 : 1,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
              >
                ◀
              </motion.button>
            )}

            {/* 树的容器 (动画切换) */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentPage}
                custom={direction}
                initial={{
                  opacity: 0,
                  x: direction > 0 ? 200 : -200,
                  rotate: direction > 0 ? 5 : -5,
                }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                exit={{
                  opacity: 0,
                  x: direction > 0 ? -200 : 200,
                  transition: { duration: 0.2 },
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="topic-tree-slider"
                style={{
                  width: "100%",
                  maxWidth: "800px",
                  height: "100%",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                {/* 传递纯净的数据切片 */}
                <SingleIssueTree issues={currentIssueSlice} />
              </motion.div>
            </AnimatePresence>

            {/* 右翻页按钮 (悬浮) */}
            {totalPages > 1 && (
              <motion.button
                disabled={currentPage === totalPages - 1}
                onClick={() => handlePageChange(1)}
                whileHover={{ scale: 1.2, x: 5 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  position: "absolute",
                  right: "10%",
                  top: "50%",
                  zIndex: 20,
                  background: "rgba(255,255,255,0.6)",
                  border: "none",
                  borderRadius: "50%",
                  width: "60px",
                  height: "60px",
                  fontSize: "30px",
                  cursor:
                    currentPage === totalPages - 1 ? "not-allowed" : "pointer",
                  opacity: currentPage === totalPages - 1 ? 0.3 : 1,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                }}
              >
                ▶
              </motion.button>
            )}

            {/* 底部页码显示 (魔法阵风格) */}
            {totalPages > 1 && (
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0,0,0,0.6)",
                  color: "#FFF",
                  padding: "5px 20px",
                  borderRadius: "20px",
                  backdropFilter: "blur(4px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  fontSize: "14px",
                  fontWeight: "bold",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <span>区域 {currentPage + 1}</span>
                <span style={{ opacity: 0.5 }}>|</span>
                <span>共 {totalPages} 区域</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>);
};

export default TopicTreePage;
