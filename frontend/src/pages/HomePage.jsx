import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import "../styles/HomePage.css";

export default function HomePage({ user, onSearch }) {
  const navigate = useNavigate();
  const [hoveredTopic, setHoveredTopic] = useState(null);

  const handleHotspotEnter = (topic) => {
    setHoveredTopic(topic);
  };

  const handleHotspotLeave = () => {
    setHoveredTopic(null);
  };

  return (
    <div className="homeContainer">
      <div className="overlay" />
      <div className="heroContent">
        <Hero user={user} onSearch={onSearch} />
      </div>
      <div className="islandHotspots">
        <a
          className="islandHotspot"
          href="/topic-island/其他"
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
          href="/topic-island/管理"
          style={{ left: "55%", top: "27%", width: "12%" }}
          onMouseEnter={() => handleHotspotEnter("管理")}
          onMouseLeave={handleHotspotLeave}
        >
          <span
            className={`hotspotLabel hotspotLabel-manage ${
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
          href="/topic-island/学业"
          style={{ left: "33%", top: "46%", width: "16%" }}
          onMouseEnter={() => handleHotspotEnter("学业")}
          onMouseLeave={handleHotspotLeave}
        >
          <span
            className={`hotspotLabel hotspotLabel-study ${
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
          href="/topic-island/情感"
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
                  ? "translateY(-60%) scale(1.2)"
                  : "translateY(-60%)",
            }}
          />
        </a>
        <a
          className="islandHotspot islandHotspot--life"
          href="/topic-island/生活"
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
            className={`hotspotLabel hotspotLabel-life ${
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
                  ? "translateY(-60%) scale(1.2)"
                  : "translateY(-60%)",
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

      {/* 发布问题按钮和鸽子图标组合 - 固定在导航栏 */}
      <div 
        className="submit-question-container"
        onClick={() => navigate("/submit", { state: { from: "/" } })}
        title="发布新问题"
      >
        <div className="pigeon-icon-fixed">
          🕊️
        </div>
        <button
          className="submit-question-btn"
        >
          发布问题
        </button>
      </div>
    </div>
  );
}
