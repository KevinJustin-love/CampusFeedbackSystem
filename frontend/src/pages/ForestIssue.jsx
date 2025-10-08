import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/ForestIssue.css";

// 🌲 精致的单棵树组件（带更多随机变化和分层结构）
const Tree = ({ username, title, x, y, onClick }) => {
  // 随机性增强：为每棵树生成独一无二的尺寸和颜色
  const treeHeight = (50 + Math.random() * 30) * 2; // 树干高度加倍
  const trunkWidth = (6 + Math.random() * 4) * 2;   // 树干宽度加倍
  const crownScale = (0.8 + Math.random() * 0.4) * 2; // 树冠整体大小加倍

  // 树冠颜色深度变化
  const greenShades = ["#1E8449", "#28B463", "#2ECC71", "#58D68D"];
  const baseColor = greenShades[Math.floor(Math.random() * greenShades.length)];
  
  // 用于错开树的 Y 轴位置，制造高低错落感
  const yOffset = -20 + Math.random() * 40; 
  const finalY = y + yOffset; 
  
  // 计算树冠的层级参数
  const layers = [
    { radius: 25 * crownScale, offset: 0, color: baseColor }, // 底部最大层
    { radius: 20 * crownScale, offset: -10, color: baseColor }, // 中间层
    { radius: 15 * crownScale, offset: -20, color: baseColor }, // 顶部最小层
  ];

  return (
    // 使用 g 标签包裹，方便点击和定位
    <g onClick={onClick} className="tree">
      
      {/* 摇晃动效 - 设置旋转中心在树底，更像自然摇曳 */}
      <motion.g
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -1.5, 1.5, 0] }}
        transition={{ repeat: Infinity, duration: 5 + Math.random() * 3, ease: "easeInOut" }}
        // 旋转中心在树底
        style={{ transformOrigin: `${x + 22}px ${finalY + 50 + treeHeight}px` }}
      >
        {/* 树干 - 调整宽度和高度 */}
        <rect 
          x={x + 22 - trunkWidth / 2} 
          y={finalY + 50} 
          width={trunkWidth} 
          height={treeHeight} 
          fill="#8B5A2B" 
          rx="2" 
        />
        
        {/* 树冠分层 - 使用多个圆形堆叠模拟自然树冠 */}
        {layers.map((layer, index) => (
          <circle
            key={index}
            cx={x + 22}
            cy={finalY + 40 + layer.offset} // 向上堆叠
            r={layer.radius}
            fill={layer.color}
            // 样式留给 CSS 处理，但这里为了快速实现阴影先用 style
            className={index === 0 ? 'tree-crown-base' : 'tree-crown'}
          />
        ))}
        
      </motion.g>

      {/* 标题 - 使用 layoutId 方便 Framer Motion 动画过渡 */}
      <motion.text
        layoutId={`title-${title}`} // 使用 title 作为唯一的 layoutId
        x={x + 22}
        y={finalY + 15}
        fontSize="12"
        fill="#004d40" // 深色的文字
        textAnchor="middle"
        className="tree-title"
      >
        {title}
      </motion.text>

      {/* 用户名 */}
      <text
        x={x + 22}
        y={finalY + 30}
        fontSize="10"
        fill="#388e3c"
        textAnchor="middle"
        className="tree-username"
      >
        {username}
      </text>
    </g>
  );
};

// 🌳 森林主面板
export default function ForestPanel({ issues = [] }) {
  const [selected, setSelected] = useState(null);

  const questions = issues.map((issue) => ({
    id: issue.id,
    username: issue.host || "匿名",
    title: issue.title,
    topic: issue.topic,
    status: issue.status,
  }));
  
  // 网格布局参数
  const treesPerRow = 4;
  const colSpacing = 220; 
  const rowSpacing = 260; 

  // 计算树的位置，采用网格布局并保留随机错落空间
  const getTreePosition = (index) => {
    const row = Math.floor(index / treesPerRow);
    const col = index % treesPerRow;
    // 增加一个轻微的随机 X 轴偏移，让排列更不规则
    const x = col * colSpacing + 50 + Math.random() * 20 - 10; 
    const y = row * rowSpacing + 80; // 从页面顶部 80px 开始
    return { x, y };
  };

  return (
    <div className="forest-container">
      
      {/* 使用 CSS 类进行背景和模糊控制 */}
      <div className={`forest-bg ${selected ? 'blurred' : ''}`}></div>

      {/* SVG 森林容器 */}
      <svg className="svg-forest">
        {questions.map((q, i) => {
          const { x, y } = getTreePosition(i);
          return (
            <Tree
              key={q.id}
              {...q}
              x={x}
              y={y}
              onClick={() => setSelected(q)}
            />
          );
        })}
      </svg>

      {/* 弹出详情框 - 使用 AnimatePresence 确保退出动画执行 */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.7, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }} // 更流畅的弹簧动效
            className="detail-modal"
          >
            {/* 标题 - 使用 layoutId 继承树上的标题动画 */}
            <motion.h3 layoutId={`title-${selected.title}`} className="detail-title">
              {selected.title}
            </motion.h3>
            <p className="detail-user">来自：{selected.username}</p>
            <p className="detail-info">分类：{selected.topic} · 状态：{selected.status}</p>
            <button
              onClick={() => setSelected(null)}
              className="detail-close"
            >
              关闭
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}