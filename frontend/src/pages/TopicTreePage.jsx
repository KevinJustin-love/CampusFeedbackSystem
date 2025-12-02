// TopicTreePage.jsx - 沉浸式动漫风格页面
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SingleIssueTree from "../components/SingleIssueTree";
import { fetchIssues } from "../components/functions/FetchIssues"; 
import { motion, AnimatePresence } from "framer-motion";

// 引入一个漂亮的动漫风格风景图 (使用指定图片源)
const ANIME_BG_URL =
  "https://bpic.588ku.com/back_pic/05/60/82/115b446747546b6.jpg";
// 备选: 蓝天草地风格

const TopicTreePage = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // 用于动画方向

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

  const topicMap = {
    学业: { title: "知识之森", color: "#4CAF50", icon: "📚" },
    生活: { title: "日常原野", color: "#FF9800", icon: "☕" },
    管理: { title: "秩序高塔", color: "#2196F3", icon: "⚖️" },
    情感: { title: "心之花园", color: "#E91E63", icon: "💌" },
    all: { title: "世界树", color: "#9C27B0", icon: "🌳" },
  };

  const theme = topicMap[topic] || topicMap["all"];

  return (
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
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {/* 返回按钮 (木牌风格) */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          style={{
            background: "#8D6E63",
            color: "#FFF",
            border: "3px solid #5D4037",
            padding: "10px 20px",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: "0 4px 0 #3E2723",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span>↩️</span> 返回小岛
        </motion.button>

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
          <span style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
            共发现 {issues.length} 个遗落的问题
          </span>
        </div>

        {/* 占位，保持平衡 */}
        <div style={{ width: "100px" }} />
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
  );
};

export default TopicTreePage;
