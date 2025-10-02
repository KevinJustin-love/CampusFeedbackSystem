import React from "react";
import Hero from "../components/Hero";
import "../styles/HomePage.css"; 

export default function HomePage({ user, onSearch }) {
  return (
    <div className="homeContainer">
      
      {/* 1. 半透明覆盖层 */}
      <div className="overlay" />
      
      {/* 2. 英雄组件内容容器 */}
      <div className="heroContent">
          <Hero user={user} onSearch={onSearch} />
      </div>
      
    </div>
  );
}