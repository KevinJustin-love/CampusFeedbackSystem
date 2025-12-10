// SingleIssueTree.jsx - 纯净版动漫树组件
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/SingleIssueTree.css";

// --- 🎨 定义部分 (保持原有的动漫质感) ---
const AnimeDefs = () => (
  <defs>
    <linearGradient id="animeTrunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#8D6E63" />
      <stop offset="40%" stopColor="#A1887F" />
      <stop offset="50%" stopColor="#BCAAA4" />
      <stop offset="60%" stopColor="#8D6E63" />
      <stop offset="100%" stopColor="#5D4037" />
    </linearGradient>
    <linearGradient id="animeLeafLight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#A5D6A7" /> {/* 更亮的动漫绿 */}
      <stop offset="100%" stopColor="#66BB6A" />
    </linearGradient>
    <linearGradient id="animeLeafShadow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#43A047" />
      <stop offset="100%" stopColor="#2E7D32" />
    </linearGradient>
    <filter id="animeGlow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="dropShadowLoose">
      <feDropShadow
        dx="0"
        dy="5"
        stdDeviation="3"
        floodColor="#3e2723"
        floodOpacity="0.3"
      />
    </filter>
  </defs>
);

// --- 🌳 树冠 ---
const FluffyCrown = ({ cx, cy, color, r, delay = 0 }) => {
  const blobs = useMemo(
    () => [
      { dx: 0, dy: -r * 0.8, r: r * 0.6 },
      { dx: r * 0.7, dy: -r * 0.3, r: r * 0.5 },
      { dx: r * 0.8, dy: r * 0.4, r: r * 0.55 },
      { dx: 0, dy: r * 0.8, r: r * 0.5 },
      { dx: -r * 0.8, dy: r * 0.4, r: r * 0.55 },
      { dx: -r * 0.7, dy: -r * 0.3, r: r * 0.5 },
      { dx: 0, dy: 0, r: r * 0.8 },
    ],
    [r]
  );

  return (
    <motion.g
      animate={{ scale: [1, 1.03, 1], rotate: [-1, 1, -1] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {blobs.map((b, i) => (
        <circle key={i} cx={cx + b.dx} cy={cy + b.dy} r={b.r} fill={color} />
      ))}
    </motion.g>
  );
};

// --- 🪵 木牌 ---
const HangingSign = ({ x, y, text, onClick, delay }) => {
  const [hover, setHover] = useState(false);
  const ropeLen = 40; // 绳子加长
  const signWidth = 160;
  const signHeight = 55;

  return (
    <motion.g
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring" }}
      style={{ originX: `${x}px`, originY: `${y}px` }}
    >
      <motion.g
        animate={{ rotate: hover ? 0 : [-1.5, 1.5, -1.5] }} // 摆动幅度减小，更自然
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * 1.5,
        }}
      >
        <line
          x1={x}
          y1={y}
          x2={x}
          y2={y + ropeLen}
          stroke="#5D4037"
          strokeWidth="3"
        />
        <g
          transform={`translate(${x}, ${y + ropeLen})`}
          onClick={onClick}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{ cursor: "pointer" }}
        >
          {/* 牌子本体 */}
          <motion.rect
            x={-signWidth / 2}
            y={0}
            width={signWidth}
            height={signHeight}
            rx={10}
            fill="#D7CCC8"
            stroke="#5D4037"
            strokeWidth="3"
            filter="url(#dropShadowLoose)"
            whileHover={{ scale: 1.05, fill: "#EFEBE9" }}
            whileTap={{ scale: 0.95 }}
          />
          {/* 钉子细节 */}
          <circle
            cx={-signWidth / 2 + 10}
            cy={10}
            r={2}
            fill="#5D4037"
            opacity="0.6"
          />
          <circle
            cx={signWidth / 2 - 10}
            cy={10}
            r={2}
            fill="#5D4037"
            opacity="0.6"
          />
          <circle
            cx={-signWidth / 2 + 10}
            cy={signHeight - 10}
            r={2}
            fill="#5D4037"
            opacity="0.6"
          />
          <circle
            cx={signWidth / 2 - 10}
            cy={signHeight - 10}
            r={2}
            fill="#5D4037"
            opacity="0.6"
          />

          <text
            x={0}
            y={34}
            textAnchor="middle"
            fill="#3E2723"
            fontSize="16"
            fontWeight="800"
            style={{
              pointerEvents: "none",
              fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
            }}
          >
            {text.length > 10 ? text.slice(0, 9) + "..." : text}
          </text>

          {/* 气泡 */}
          <AnimatePresence>
            {hover && (
              <motion.g
                initial={{ opacity: 0, scale: 0, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <rect
                  x={-80}
                  y={-45}
                  width={160}
                  height={35}
                  rx={18}
                  fill="#FFF9C4"
                  stroke="#FBC02D"
                  strokeWidth={2}
                />
                <text
                  x={0}
                  y={-22}
                  textAnchor="middle"
                  fontSize={14}
                  fill="#F57F17"
                  fontWeight="bold"
                  style={{ pointerEvents: "none" }}
                >
                  ✨ 点击查看详情
                </text>
                <path
                  d="M -5 -11 L 5 -11 L 0 -4 Z"
                  fill="#FFF9C4"
                  stroke="#FBC02D"
                  strokeWidth={1}
                />
              </motion.g>
            )}
          </AnimatePresence>
        </g>
      </motion.g>
    </motion.g>
  );
};

// --- 🍃 环境粒子 ---
const Particles = ({ width, height }) => (
  <g style={{ pointerEvents: "none" }}>
    {Array.from({ length: 8 }).map((_, i) => (
      <motion.circle
        key={i}
        r={Math.random() * 3 + 1}
        fill="#FFF"
        opacity={0.7}
        initial={{ x: Math.random() * width, y: Math.random() * height - 100 }}
        animate={{
          y: [null, height],
          x: [null, Math.random() * width],
          opacity: [0, 0.8, 0],
        }}
        transition={{
          duration: Math.random() * 4 + 6,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 5,
        }}
      />
    ))}
  </g>
);

// --- 🌳 主组件 ---
export default function SingleIssueTree({ issues = [], compact = false }) {
  const navigate = useNavigate();

  // 注意：这里不再处理分页，只负责渲染传入的 issues 数组
  const mainIssue = issues[0];
  const branchIssues = issues.slice(1);

  const centerX = 250;
  const startY = 480; // 树根位置下移
  const trunkHeight = 300; // 树干加高

  if (compact) return <div className="anime-loading">召唤树木中...</div>;

  return (
    <div
      className="single-tree-container"
      style={{
        width: "100%",
        height: "100%",
        background: "transparent", // 🌟 关键：背景透明
        overflow: "visible",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 500 550"
        className="anime-tree-svg"
        style={{ overflow: "visible" }}
      >
        <AnimeDefs />

        {/* 树后的光晕 */}
        <ellipse
          cx={centerX}
          cy={startY}
          rx={160}
          ry={30}
          fill="#000"
          opacity="0.15"
          filter="blur(10px)"
        />

        {/* 树干 */}
        <motion.path
          d={`M ${centerX - 35} ${startY} Q ${centerX - 45} ${startY - 100}, ${
            centerX - 15
          } ${startY - trunkHeight} L ${centerX + 15} ${
            startY - trunkHeight
          } Q ${centerX + 45} ${startY - 100}, ${centerX + 35} ${startY} Z`}
          fill="url(#animeTrunkGrad)"
          stroke="#4E342E"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2 }}
        />

        {/* 树枝 */}
        {branchIssues.map((_, i) => {
          const yPos = startY - 90 - i * 55;
          const isLeft = i % 2 !== 0;
          const xEnd = isLeft ? centerX - 130 : centerX + 130;
          const controlX = isLeft ? centerX - 20 : centerX + 20;
          return (
            <motion.path
              key={`branch-${i}`}
              d={`M ${centerX} ${yPos + 25} Q ${controlX} ${
                yPos - 15
              }, ${xEnd} ${yPos}`}
              fill="none"
              stroke="#5D4037"
              strokeWidth="7"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.4 + i * 0.15 }}
            />
          );
        })}

        {/* 树冠 */}
        <FluffyCrown
          cx={centerX}
          cy={startY - trunkHeight - 20}
          r={110}
          color="url(#animeLeafShadow)"
          delay={0.2}
        />
        <FluffyCrown
          cx={centerX}
          cy={startY - trunkHeight - 35}
          r={95}
          color="url(#animeLeafLight)"
          delay={0.3}
        />

        {/* 挂牌 */}
        {branchIssues.map((issue, i) => {
          const yPos = startY - 90 - i * 55;
          const isLeft = i % 2 !== 0;
          const xEnd = isLeft ? centerX - 130 : centerX + 130;
          return (
            <HangingSign
              key={issue.id}
              x={xEnd}
              y={yPos}
              text={issue.title}
              onClick={() => navigate(`/detail/${issue.id}`, { state: { from: '/topic-tree' } })}
              delay={0.8 + i * 0.1}
            />
          );
        })}

        {/* 核心问题 (发光果实) */}
        {mainIssue && (
          <motion.g
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.6, delay: 1.2 }}
            onClick={() => navigate(`/detail/${mainIssue.id}`, { state: { from: '/topic-tree' } })}
            style={{ cursor: "pointer" }}
          >
            {/* 光效背景 */}
            <circle
              cx={centerX}
              cy={startY - trunkHeight - 35}
              r={60}
              fill="#FFF59D"
              opacity="0.4"
              filter="blur(15px)"
            />
            <circle
              cx={centerX}
              cy={startY - trunkHeight - 35}
              r={50}
              fill="#FDD835"
              stroke="#F57F17"
              strokeWidth="3"
              filter="url(#animeGlow)"
            />

            <text
              x={centerX}
              y={startY - trunkHeight - 45}
              textAnchor="middle"
              fontSize="28"
              fontWeight="900"
              fill="#E65100"
              style={{ fontFamily: "Arial Rounded MT Bold, Arial" }}
            >
              #1
            </text>
            <text
              x={centerX}
              y={startY - trunkHeight - 15}
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill="#BF360C"
            >
              {mainIssue.title.length > 6
                ? mainIssue.title.slice(0, 5) + ".."
                : mainIssue.title}
            </text>

            {/* 交互波纹 */}
            <motion.circle
              cx={centerX}
              cy={startY - trunkHeight - 35}
              r={52}
              stroke="#FFF"
              strokeWidth="2"
              fill="none"
              animate={{ scale: [1, 1.4], opacity: [1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </motion.g>
        )}

        <Particles width={500} height={550} />
      </svg>
    </div>
  );
}
