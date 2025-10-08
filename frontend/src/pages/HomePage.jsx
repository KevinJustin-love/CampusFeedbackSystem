import React, { useState } from "react";
import Hero from "../components/Hero";
import "../styles/HomePage.css";

export default function HomePage({ user, onSearch }) {
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
          href="/dashboard?topic=其他"
          style={{ left: "10%", top: "14%", width: "20%" }}
        >
          <span
            className={`hotspotLabel ${
              hoveredTopic === "其他" ? "hotspotLabel--hovered" : ""
            }`}
            onMouseEnter={() => handleHotspotEnter("其他")}
            onMouseLeave={handleHotspotLeave}
          >
            其他
          </span>
        </a>
        <a
          className="islandHotspot"
          href="/dashboard?topic=管理"
          style={{ left: "47%", top: "25%", width: "10%" }}
        >
          <span
            className={`hotspotLabel ${
              hoveredTopic === "管理" ? "hotspotLabel--hovered" : ""
            }`}
            onMouseEnter={() => handleHotspotEnter("管理")}
            onMouseLeave={handleHotspotLeave}
          >
            管理
          </span>
        </a>
        <a
          className="islandHotspot"
          href="/dashboard?topic=学业"
          style={{ left: "25%", top: "43%", width: "15%" }}
        >
          <span
            className={`hotspotLabel ${
              hoveredTopic === "学业" ? "hotspotLabel--hovered" : ""
            }`}
            onMouseEnter={() => handleHotspotEnter("学业")}
            onMouseLeave={handleHotspotLeave}
          >
            学业
          </span>
        </a>
        <a
          className="islandHotspot"
          href="/dashboard?topic=情感"
          style={{ left: "90%", top: "13%", width: "20%" }}
        >
          <span
            className={`hotspotLabel ${
              hoveredTopic === "情感" ? "hotspotLabel--hovered" : ""
            }`}
            onMouseEnter={() => handleHotspotEnter("情感")}
            onMouseLeave={handleHotspotLeave}
          >
            情感
          </span>
        </a>
        <a
          className="islandHotspot"
          href="/dashboard?topic=生活"
          style={{ left: "80%", top: "55%", width: "35%" }}
        >
          <span
            className={`hotspotLabel ${
              hoveredTopic === "生活" ? "hotspotLabel--hovered" : ""
            }`}
            onMouseEnter={() => handleHotspotEnter("生活")}
            onMouseLeave={handleHotspotLeave}
          >
            生活
          </span>
        </a>
      </div>
    </div>
  );
}
