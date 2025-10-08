import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/ForestIssue.css";

// 🌲 单棵树组件（带随机变化）
const Tree = ({ username, title, x, y, onClick }) => {
  // 随机性保持不变
  const height = 40 + Math.random() * 20;
  const crownRadius = 18 + Math.random() * 10;
  const greenShades = ["#2E8B57", "#228B22", "#32CD32", "#006400"];
  const color = greenShades[Math.floor(Math.random() * greenShades.length)];

  return (
    // 添加 group 元素以包裹 SVG 元素和文本，便于定位和点击
    <g onClick={onClick} className="tree">
      {/* Framer Motion 动画放在内部 g 标签，使文本不摇晃，更自然 */}
      <motion.g
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -2, 2, 0] }}
        transition={{ repeat: Infinity, duration: 4 + Math.random() * 2, ease: "easeInOut" }}
        style={{ transformOrigin: `${x + 22}px ${y + 50 + height}px` }} // 设置旋转中心在树底
      >
        {/* 树干 */}
        <rect x={x + 18} y={y + 50} width={8} height={height} fill="#8B5A2B" />
        {/* 树冠 */}
        <circle cx={x + 22} cy={y + 40} r={crownRadius} fill={color} />
      </motion.g>

      {/* 标题 - 调整到树正上方，使用深绿色，以匹配图片效果 */}
      <text
        x={x + 22} // X 轴居中
        y={y + 15} // Y 轴向上移动，给标题留出空间
        fontSize="12"
        fill="#006400" // 深绿色
        textAnchor="middle" // 居中对齐
        className="font-semibold" // 加粗
      >
        {title}
      </text>

      {/* 用户名 - 保持在标题下方，更小字体 */}
      <text
        x={x + 22} // X 轴居中
        y={y + 30} // 位于标题下方
        fontSize="10"
        fill="#228B22" // 浅绿色
        textAnchor="middle" // 居中对齐
      >
        {username}
      </text>
    </g>
  );
};

// 🌳 森林主面板
export default function ForestPanel() {
  const [selected, setSelected] = useState(null);

  const questions = [
    { id: 1, username: "Alice", title: "如何优化模型性能？" },
    { id: 2, username: "Bob", title: "数据清洗策略有哪些？" },
    { id: 3, username: "Cindy", title: "过拟合的解决方案？" },
    { id: 4, username: "David", title: "如何设计可复用组件？" },
  ];

  // 计算树的位置，使其水平排列在页面左上角，且间距固定
  const getTreePosition = (index) => {
    // 假设每棵树占 150px 宽度
    const x = index * 150 + 50; // 水平排列，起始 x 轴偏移 50
    const y = 50; // Y 轴固定在顶部 50
    return { x, y };
  };

  return (
    <div className="forest-container">
      
      <div className={`forest-bg ${selected ? 'blurred' : ''}`}></div>

      {/* SVG 森林容器 - 调整宽度以适应内容 */}
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

      {/* 弹出详情框 - 点击后展示，符合 Framer Motion 动效要求 */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="detail-modal"
        >
          <motion.h3 layoutId={`title-${selected.id}`} className="detail-title">
            {selected.title}
          </motion.h3>
          <p className="detail-user">来自：{selected.username}</p>
          <button
            onClick={() => setSelected(null)}
            className="detail-close"
          >
            关闭详情
          </button>
        </motion.div>
      )}
    </div>
  );
}