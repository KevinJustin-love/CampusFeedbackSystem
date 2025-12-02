import React, { useState, useEffect } from 'react';
import './GuideAnimation.css';

const GuideAnimation = ({ targetSelector, onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [targetElement, setTargetElement] = useState(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    // 查找目标元素
    const element = document.querySelector(targetSelector);
    if (element) {
      setTargetElement(element);
      
      // 计算目标元素的位置，让箭头指向岛屿上方
      const rect = element.getBoundingClientRect();
      setPosition({
        top: rect.top + 10, // 更靠近目标元素顶部
        left: rect.left + rect.width / 2
      });
    }

    // 5秒后自动隐藏
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [targetSelector, onComplete]);

  const handleClose = () => {
    setVisible(false);
    onComplete?.();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!visible || !targetElement) {
    return null;
  }

  return (
    <div className="guide-overlay" onClick={handleOverlayClick}>
      <div 
        className="guide-content"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`
        }}
      >
        <div className="guide-arrow">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <path 
              d="M30 10 L50 30 L40 30 L40 50 L20 50 L20 30 L10 30 Z" 
              fill="rgba(255, 255, 255, 0.9)"
              stroke="rgba(74, 144, 226, 0.8)"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="guide-text">
          <p>点击岛屿即可查看对应领域问题</p>
        </div>
        <button className="guide-close-btn" onClick={handleClose}>
          知道了
        </button>
      </div>
    </div>
  );
};

export default GuideAnimation;