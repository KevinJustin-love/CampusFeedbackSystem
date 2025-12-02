import React, { useState, useEffect } from 'react';
import './GuideAnimation.css';

const GuideAnimation = ({ guides, onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElements, setTargetElements] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    // 查找所有目标元素
    const elements = guides.map(guide => document.querySelector(guide.targetSelector));
    const validElements = elements.filter(el => el !== null);
    
    if (validElements.length === 0) {
      setVisible(false);
      onComplete?.();
      return;
    }

    setTargetElements(validElements);

    // 计算所有目标元素的位置
    const calculatedPositions = validElements.map((element, index) => {
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top + (guides[index].offsetTop || 10),
        left: rect.left + rect.width / 2
      };
    });
    setPositions(calculatedPositions);

    // 5秒后自动进入下一步或完成
    const timer = setTimeout(() => {
      handleNext();
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentStep, guides, onComplete]);

  const handleNext = () => {
    if (currentStep < guides.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setVisible(false);
      onComplete?.();
    }
  };

  const handleClose = () => {
    setVisible(false);
    onComplete?.();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleNext();
    }
  };

  if (!visible || targetElements.length === 0 || currentStep >= guides.length) {
    return null;
  }

  const currentGuide = guides[currentStep];
  const currentPosition = positions[currentStep] || { top: 0, left: 0 };
  const currentTargetElement = targetElements[currentStep];

  return (
    <div className="guide-overlay" onClick={handleOverlayClick}>
      <div 
        className="guide-content"
        style={{
          top: `${currentPosition.top}px`,
          left: `${currentPosition.left}px`
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
          <p>{currentGuide.text}</p>
          <div className="guide-step-indicator">
            {currentStep + 1} / {guides.length}
          </div>
        </div>
        <button className="guide-close-btn" onClick={handleNext}>
          {currentStep < guides.length - 1 ? '下一步' : '知道了'}
        </button>
      </div>
    </div>
  );
};

export default GuideAnimation;