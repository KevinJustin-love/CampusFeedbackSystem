// SingleIssueTree.jsx - 动漫/RPG风格树形展示组件
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/SingleIssueTree.css"; // 即使样式变了，文件名保持一致

// --- 🎨 动漫风格配色与滤镜定义 ---
const AnimeDefs = () => (
  <defs>
    {/* 树干纹理：卡通风格 */}
    <linearGradient id="animeTrunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#8D6E63" />
      <stop offset="40%" stopColor="#A1887F" />
      <stop offset="50%" stopColor="#BCAAA4" /> {/* 高光线条 */}
      <stop offset="60%" stopColor="#8D6E63" />
      <stop offset="100%" stopColor="#5D4037" />
    </linearGradient>

    {/* 树叶：赛璐珞风格明暗 */}
    <linearGradient id="animeLeafLight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#81C784" />
      <stop offset="100%" stopColor="#66BB6A" />
    </linearGradient>
    <linearGradient id="animeLeafShadow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#388E3C" />
      <stop offset="100%" stopColor="#2E7D32" />
    </linearGradient>

    {/* 木牌纹理 */}
    <filter id="woodGrain" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.5"
        numOctaves="3"
        result="noise"
      />
      <feColorMatrix type="saturate" values="0.2" />
      <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
    </filter>

    {/* 动漫发光效果 */}
    <filter id="animeGlow">
      <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    {/* 投影 */}
    <filter id="dropShadowLoose">
      <feDropShadow
        dx="0"
        dy="4"
        stdDeviation="4"
        floodColor="#000"
        floodOpacity="0.25"
      />
    </filter>
  </defs>
);

// --- 🌳 蓬松的动漫树冠 (Blob形状) ---
const FluffyCrown = ({ cx, cy, color, r, delay = 0 }) => {
  // 生成随机的云朵状边缘
  const blobs = useMemo(() => {
    return [
      { dx: 0, dy: -r * 0.8, r: r * 0.6 },
      { dx: r * 0.7, dy: -r * 0.3, r: r * 0.5 },
      { dx: r * 0.8, dy: r * 0.4, r: r * 0.55 },
      { dx: 0, dy: r * 0.8, r: r * 0.5 },
      { dx: -r * 0.8, dy: r * 0.4, r: r * 0.55 },
      { dx: -r * 0.7, dy: -r * 0.3, r: r * 0.5 },
      { dx: 0, dy: 0, r: r * 0.8 }, // 中心填充
    ];
  }, [r]);

  return (
    <motion.g
      animate={{ scale: [1, 1.02, 1], rotate: [-1, 1, -1] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {blobs.map((b, i) => (
        <circle key={i} cx={cx + b.dx} cy={cy + b.dy} r={b.r} fill={color} />
      ))}
    </motion.g>
  );
};

// --- 🪵 悬挂的木牌 (分支问题) ---
const HangingSign = ({ x, y, text, onClick, delay }) => {
  const [hover, setHover] = useState(false);

  // 绳子长度
  const ropeLen = 30;

  return (
    <motion.g
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      // 像风铃一样摆动
      style={{ originX: `${x}px`, originY: `${y}px` }} // 设置旋转原点为绳子挂点
    >
      <motion.g
        animate={{ rotate: hover ? 0 : [-2, 2, -2] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay * 2,
        }}
      >
        {/* 绳子 */}
        <line
          x1={x}
          y1={y}
          x2={x}
          y2={y + ropeLen}
          stroke="#5D4037"
          strokeWidth="2"
        />

        {/* 木牌组 */}
        <g
          transform={`translate(${x}, ${y + ropeLen})`}
          onClick={onClick}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{ cursor: "pointer" }}
        >
          {/* 牌子背景 */}
          <motion.rect
            x={-60}
            y={0}
            width={120}
            height={40}
            rx={5}
            fill="#D7CCC8"
            stroke="#5D4037"
            strokeWidth="2"
            filter="url(#dropShadowLoose)"
            whileHover={{ scale: 1.1, fill: "#EFEBE9" }}
          />
          {/* 木纹装饰线 */}
          <path
            d="M -50 10 L -20 10 M 10 30 L 50 30"
            stroke="#A1887F"
            strokeWidth="1"
            opacity="0.5"
          />

          {/* 文字 */}
          <text
            x={0}
            y={25}
            textAnchor="middle"
            fill="#3E2723"
            fontSize="12"
            fontWeight="bold"
            style={{
              pointerEvents: "none",
              fontFamily: "'Comic Sans MS', 'Chalkboard SE', sans-serif",
            }}
          >
            {text.length > 8 ? text.slice(0, 8) + "..." : text}
          </text>

          {/* Hover 提示气泡 */}
          <AnimatePresence>
            {hover && (
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <rect
                  x={-70}
                  y={-35}
                  width={140}
                  height={25}
                  rx={12}
                  fill="#FFF9C4"
                  stroke="#FBC02D"
                  strokeWidth={1.5}
                />
                <text
                  x={0}
                  y={-18}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#F57F17"
                  fontWeight="bold"
                >
                  ✨ 查看详情
                </text>
              </motion.g>
            )}
          </AnimatePresence>
        </g>
      </motion.g>
    </motion.g>
  );
};

// --- ✨ 飘落粒子 ---
const Particles = ({ width, height }) => {
  const particles = Array.from({ length: 12 });
  return (
    <g style={{ pointerEvents: "none" }}>
      {particles.map((_, i) => (
        <motion.circle
          key={i}
          r={Math.random() * 2 + 1}
          fill="#FFF"
          opacity={0.6}
          initial={{ x: Math.random() * width, y: Math.random() * height - 50 }}
          animate={{
            y: [null, height],
            x: [null, Math.random() * width],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </g>
  );
};

// --- 🌳 主组件 ---
export default function SingleIssueTree({
  issues = [],
  pageSize = 5,
  compact = false,
}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);

  // 分页逻辑
  const effectivePageSize = Math.max(pageSize, 1);
  const totalPages = Math.ceil(issues.length / effectivePageSize);
  const safeCurrentPage =
    totalPages === 0 ? 0 : Math.min(currentPage, totalPages - 1);
  const currentIssues = issues.slice(
    safeCurrentPage * effectivePageSize,
    safeCurrentPage * effectivePageSize + effectivePageSize
  );

  const mainIssue = currentIssues[0];
  const branchIssues = currentIssues.slice(1);

  const handleNext = () =>
    setCurrentPage((p) => Math.min(p + 1, totalPages - 1));
  const handlePrev = () => setCurrentPage((p) => Math.max(p - 1, 0));

  // 树的参数
  const centerX = 250;
  const startY = 450;
  const trunkHeight = 280;
  const curveIntensity = 20; // 树干弯曲度

  // 紧凑模式（Loading/Empty State）
  if (compact)
    return <div style={{ textAlign: "center" }}>Loading Anime Tree...</div>;

  return (
    <div
      className="single-tree-container"
      style={{
        background: "linear-gradient(to top, #e0f7fa 0%, #ffffff 80%)", // 蓝天背景
        borderRadius: "20px",
        boxShadow: "inset 0 0 30px rgba(255,255,255,0.8)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Comic Sans MS', cursive, sans-serif", // 强行可爱字体
      }}
    >
      <svg
        width={500}
        height={500}
        viewBox="0 0 500 500"
        className="anime-tree-svg"
      >
        <AnimeDefs />

        {/* 背景光晕 */}
        <circle
          cx={centerX}
          cy={150}
          r={120}
          fill="url(#animeLeafLight)"
          opacity="0.2"
          filter="blur(40px)"
        />

        {/* --- 树干 (绘制有机的贝塞尔曲线) --- */}
        <motion.path
          d={`
            M ${centerX - 30} ${startY} 
            Q ${centerX - 40} ${startY - 100}, ${centerX - 15} ${
            startY - trunkHeight
          } 
            L ${centerX + 15} ${startY - trunkHeight}
            Q ${centerX + 40} ${startY - 100}, ${centerX + 30} ${startY} 
            Z
          `}
          fill="url(#animeTrunkGrad)"
          stroke="#4E342E"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* --- 树枝 (连接到挂牌子的地方) --- */}
        {branchIssues.map((_, i) => {
          const yPos = startY - 80 - i * 50;
          const isLeft = i % 2 !== 0; // 左右交替
          const xEnd = isLeft ? centerX - 100 : centerX + 100;
          const controlX = isLeft ? centerX - 20 : centerX + 20;

          return (
            <motion.path
              key={`branch-${i}`}
              d={`M ${centerX} ${yPos + 20} Q ${controlX} ${
                yPos - 10
              }, ${xEnd} ${yPos}`}
              fill="none"
              stroke="#5D4037"
              strokeWidth="6"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5 + i * 0.2 }}
            />
          );
        })}

        {/* --- 树冠 (分层绘制) --- */}
        {/* 后层阴影叶子 */}
        <FluffyCrown
          cx={centerX}
          cy={startY - trunkHeight - 20}
          r={85}
          color="url(#animeLeafShadow)"
          delay={0.2}
        />
        {/* 前层高光叶子 */}
        <FluffyCrown
          cx={centerX}
          cy={startY - trunkHeight - 30}
          r={75}
          color="url(#animeLeafLight)"
          delay={0.3}
        />

        {/* --- 挂在树枝上的牌子 --- */}
        {branchIssues.map((issue, i) => {
          const yPos = startY - 80 - i * 50;
          const isLeft = i % 2 !== 0;
          const xEnd = isLeft ? centerX - 100 : centerX + 100;
          return (
            <HangingSign
              key={issue.id}
              x={xEnd}
              y={yPos}
              text={issue.title}
              onClick={() => navigate(`/detail/${issue.id}`)}
              delay={0.8 + i * 0.1}
            />
          );
        })}

        {/* --- 顶部主要问题 (魔法果实/大牌子) --- */}
        {mainIssue && (
          <motion.g
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.5, delay: 1 }}
            onClick={() => navigate(`/detail/${mainIssue.id}`)}
            style={{ cursor: "pointer" }}
          >
            {/* 光晕背景 */}
            <circle
              cx={centerX}
              cy={startY - trunkHeight - 30}
              r={45}
              fill="#FFF176"
              opacity="0.6"
              filter="blur(10px)"
            />

            {/* 核心UI */}
            <circle
              cx={centerX}
              cy={startY - trunkHeight - 30}
              r={40}
              fill="#FFEB3B"
              stroke="#F57F17"
              strokeWidth="3"
              filter="url(#animeGlow)"
            />
            <text
              x={centerX}
              y={startY - trunkHeight - 35}
              textAnchor="middle"
              fontSize="16"
              fontWeight="bold"
              fill="#E65100"
            >
              #1
            </text>
            <text
              x={centerX}
              y={startY - trunkHeight - 15}
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="#BF360C"
            >
              {mainIssue.title.length > 6
                ? mainIssue.title.slice(0, 5) + ".."
                : mainIssue.title}
            </text>

            {/* 点击提示圆环动画 */}
            <motion.circle
              cx={centerX}
              cy={startY - trunkHeight - 30}
              r={42}
              stroke="#FFF"
              strokeWidth="2"
              fill="none"
              animate={{ scale: [1, 1.3], opacity: [1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.g>
        )}

        {/* --- 地面草丛 --- */}
        <ellipse cx={centerX} cy={startY} rx={120} ry={20} fill="#AED581" />
        <path
          d={`M ${centerX - 80} ${startY} q 10 -20 20 0`}
          stroke="#7CB342"
          fill="none"
          strokeWidth="2"
        />
        <path
          d={`M ${centerX + 60} ${startY + 5} q 10 -15 20 0`}
          stroke="#7CB342"
          fill="none"
          strokeWidth="2"
        />

        {/* 粒子特效 */}
        <Particles width={500} height={500} />
      </svg>

      {/* --- 动漫风格分页控制 --- */}
      {totalPages > 1 && (
        <div
          className="anime-pagination"
          style={{
            position: "absolute",
            bottom: "20px",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            alignItems: "center",
          }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            disabled={safeCurrentPage === 0}
            style={{
              background: "#FFAB91",
              border: "3px solid #D84315",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              color: "#FFF",
              fontWeight: "bold",
              cursor: "pointer",
              opacity: safeCurrentPage === 0 ? 0.5 : 1,
            }}
          >
            ◀
          </motion.button>

          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              padding: "5px 15px",
              borderRadius: "15px",
              border: "2px solid #81C784",
              color: "#2E7D32",
              fontWeight: "bold",
            }}
          >
            LV.{safeCurrentPage + 1} / {totalPages}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            disabled={safeCurrentPage === totalPages - 1}
            style={{
              background: "#FFAB91",
              border: "3px solid #D84315",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              color: "#FFF",
              fontWeight: "bold",
              cursor: "pointer",
              opacity: safeCurrentPage === totalPages - 1 ? 0.5 : 1,
            }}
          >
            ▶
          </motion.button>
        </div>
      )}
    </div>
  );
}
