import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import "../styles/HomePage.css";

export default function HomePage({ user, onSearch }) {
  const navigate = useNavigate();
  const [hoveredTopic, setHoveredTopic] = useState(null);

  // 信鸽拖拽相关状态
  const [pigeonPosition, setPigeonPosition] = useState({ x: 35, y: 10 }); // 使用百分比
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false); // 标记是否发生了拖拽

  const handleHotspotEnter = (topic) => {
    setHoveredTopic(topic);
  };

  const handleHotspotLeave = () => {
    setHoveredTopic(null);
  };

  // 信鸽拖拽处理函数
  const handlePigeonMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setHasDragged(false); // 重置拖拽标记

    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    setHasDragged(true); // 标记发生了拖拽

    const container = document.querySelector(".homeContainer");
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    // 计算新位置（百分比）
    const newX =
      ((e.clientX - containerRect.left - dragOffset.x) / containerRect.width) *
      100;
    const newY =
      ((containerRect.bottom - e.clientY - dragOffset.y) /
        containerRect.height) *
      100;

    // 限制在容器范围内
    const clampedX = Math.max(0, Math.min(95, newX));
    const clampedY = Math.max(0, Math.min(95, newY));

    setPigeonPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 添加全局鼠标事件监听
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div className="homeContainer">
      <div className="overlay" />
      <div className="heroContent">
        <Hero user={user} onSearch={onSearch} />
      </div>
      <div className="islandHotspots">
        <a
          className="islandHotspot"
          href="/topic-tree/其他"
          style={{ left: "7%", top: "18%", width: "20%" }}
          onMouseEnter={() => handleHotspotEnter("其他")}
          onMouseLeave={handleHotspotLeave}
        >
          <span
            className={`hotspotLabel ${
              hoveredTopic === "其他" ? "hotspotLabel--hovered" : ""
            }`}
          >
            其他
          </span>
          <img
            src="../../public/assets/other.png"
            alt="Other Island"
            className="islandHotspotImage-other"
            style={{
              width: "250px",
              top: "75%",
              left: "40%",
              transformOrigin: "left center",
              transform:
                hoveredTopic === "其他"
                  ? "translateY(-50%) scale(1.25)"
                  : "translateY(-50%)",
            }}
          />
        </a>
        <a
          className="islandHotspot"
          href="/topic-tree/管理"
          style={{ left: "55%", top: "27%", width: "12%" }}
          onMouseEnter={() => handleHotspotEnter("管理")}
          onMouseLeave={handleHotspotLeave}
        >
          <span
            className={`hotspotLabel ${
              hoveredTopic === "管理" ? "hotspotLabel--hovered" : ""
            }`}
          >
            管理
          </span>
          <img
            src="../../public/assets/manage.png"
            alt="Manage Island"
            className="islandHotspotImage-manage"
            style={{
              width: "250px",
              top: "75%",
              left: "50%",
              transformOrigin: "center",
              transform:
                hoveredTopic === "管理"
                  ? "translate(-50%, -50%) scale(1.2)"
                  : "translate(-50%, -50%)",
            }}
          />
        </a>
        <a
          className="islandHotspot"
          href="/topic-tree/学业"
          style={{ left: "33%", top: "46%", width: "16%" }}
          onMouseEnter={() => handleHotspotEnter("学业")}
          onMouseLeave={handleHotspotLeave}
        >
          <span
            className={`hotspotLabel ${
              hoveredTopic === "学业" ? "hotspotLabel--hovered" : ""
            }`}
          >
            学业
          </span>
          <img
            src="../../public/assets/study.png"
            alt="Study Island"
            className="islandHotspotImage-study"
            style={{
              width: "230px",
              top: "60%",
              left: "50%",
              transformOrigin: "center",
              transform:
                hoveredTopic === "学业"
                  ? "translate(-50%, -50%) scale(1.2)"
                  : "translate(-50%, -50%)",
            }}
          />
        </a>
        <a
          className="islandHotspot islandHotspot--emotion"
          href="/topic-tree/情感"
          style={{
            right: 0,
            top: "17%",
            width: "18%",
            transform: "translateY(-50%)", // 只在纵向居中
          }}
          onMouseEnter={() => handleHotspotEnter("情感")}
          onMouseLeave={handleHotspotLeave}
        >
          <span
            className={`hotspotLabel ${
              hoveredTopic === "情感" ? "hotspotLabel--hovered" : ""
            }`}
          >
            情感
          </span>
          <img
            src="../../public/assets/emotion.png"
            alt="Emotion Island"
            className="islandHotspotImage-emotion"
            style={{
              width: "320px",
              top: "80%",
              right: 0, // 贴紧父元素右边
              left: "auto",
              transformOrigin: "right center", // 缩放时保持右边缘不动
              transform:
                hoveredTopic === "情感"
                  ? "translateY(-50%) scale(1.2)"
                  : "translateY(-50%)",
            }}
          />
        </a>
        <a
          className="islandHotspot islandHotspot--life"
          href="/topic-tree/生活"
          style={{
            right: "0%",
            top: "71%",
            width: "30%",
            transform: "translateY(-50%)",
          }}
          onMouseEnter={() => handleHotspotEnter("生活")}
          onMouseLeave={handleHotspotLeave}
        >
          <span
            className={`hotspotLabel ${
              hoveredTopic === "生活" ? "hotspotLabel--hovered" : ""
            }`}
          >
            生活
          </span>
          <img
            src="../../public/assets/life.png"
            alt="Life Island"
            className="islandHotspotImage-life"
            style={{
              width: "560px",
              top: "68%",
              right: 0,
              left: "auto",
              transformOrigin: "right center",
              transform:
                hoveredTopic === "生活"
                  ? "translateY(-50%) scale(1.2)"
                  : "translateY(-50%)",
            }}
          />
        </a>
      </div>

      {/* 邮箱图标 - 链接到 Dashboard */}
      <a
        href="/dashboard"
        className="mailbox-icon"
        style={{
          position: "absolute",
          left: "18%", // 调整左右位置：增大值向右移动
          bottom: "11%", // 调整上下位置：增大值向上移动
          textDecoration: "none",
          zIndex: 10,
          cursor: "pointer",
          transition: "transform 0.3s ease, filter 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.15)";
          e.currentTarget.querySelector("img").style.filter =
            "brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.3))";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.querySelector("img").style.filter =
            "drop-shadow(0 2px 4px rgba(0,0,0,0.2))";
        }}
      >
        <img
          src="../../public/assets/mailRed.png"
          alt="Mailbox"
          style={{
            width: "80px", // 调整邮箱图片宽度
            height: "auto", // 自动高度保持比例
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            transition: "filter 0.3s ease",
          }}
        />
      </a>

      {/* 信鸽图标 - 可拖拽，点击链接到提交问题页面 */}
      <div
        className="pigeon-icon"
        style={{
          position: "absolute",
          left: `${pigeonPosition.x}%`,
          bottom: `${pigeonPosition.y}%`,
          fontSize: "70px",
          zIndex: 1000,
          cursor: isDragging ? "grabbing" : "grab",
          transition: isDragging ? "none" : "transform 0.3s ease",
          transform: isDragging ? "scale(1.1)" : "scale(1)",
          userSelect: "none",
        }}
        onMouseDown={handlePigeonMouseDown}
        onClick={(e) => {
          // 只有在没有拖拽时才触发导航
          if (!hasDragged) {
            navigate("/submit", { state: { from: "/" } });
          }
        }}
        title="拖拽移动 | 点击提交新问题"
      >
        🕊️
      </div>
    </div>
  );
}
