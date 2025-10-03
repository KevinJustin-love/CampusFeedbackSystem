import React from "react";
import Hero from "../components/Hero";
import "../styles/HomePage.css"; 

export default function HomePage({ user, onSearch }) {
  return (
    <div className="homeContainer">
      <div className="overlay" />
      <div className="heroContent">
          <Hero user={user} onSearch={onSearch} />
      </div>
      <div className="islandHotspots">
        <a className="islandHotspot" href="/dashboard?topic=生活" style={{ left: "15%", top: "12%", width: "20%" }}>
          <span className="hotspotLabel">生活</span>
        </a>
        <a className="islandHotspot" href="/dashboard?topic=管理" style={{ left: "50%", top: "20%", width: "10%" }}>
          <span className="hotspotLabel">管理</span>
        </a>
        <a className="islandHotspot" href="/dashboard?topic=学业" style={{ left: "35%", top: "45%", width: "15%" }}>
          <span className="hotspotLabel">学业</span>
        </a>
        <a className="islandHotspot" href="/dashboard?topic=情感" style={{ left: "85%", top: "20%", width: "20%" }}>
          <span className="hotspotLabel">情感</span>
        </a>
        <a className="islandHotspot" href="/dashboard?topic=其他" style={{ left: "65%", top: "65%", width: "35%" }}>
          <span className="hotspotLabel">其他</span>
        </a>
      </div>
    </div>
  );
}