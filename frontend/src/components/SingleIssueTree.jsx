// SingleIssueTree.jsx - 单棵树多分支问题展示组件
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/SingleIssueTree.css";

// 树桩组件
const TreeStump = ({ x, y, width = 200, height = 35 }) => (
  <g className="tree-stump">
    <defs>
      <linearGradient id="stumpGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#6D4C41" />
        <stop offset="100%" stopColor="#4E342E" />
      </linearGradient>
    </defs>
    <rect
      x={x - width / 2}
      y={y}
      width={width}
      height={height}
      fill="url(#stumpGradient)"
      rx={3}
    />
    {/* 年轮效果 */}
    <ellipse
      cx={x}
      cy={y + 5}
      rx={width * 0.35}
      ry={8}
      fill="#5D4037"
      opacity={0.6}
    />
    <ellipse
      cx={x}
      cy={y + 5}
      rx={width * 0.25}
      ry={6}
      fill="#4E342E"
      opacity={0.5}
    />
  </g>
);

// 树干组件
const TreeTrunk = (
  { x, y, height, width = 24 } // 🔧 树干粗细：14 → 24（加粗约70%）
) => (
  <g className="tree-trunk">
    <defs>
      <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#6D4C41" />
        <stop offset="50%" stopColor="#8B5A2B" />
        <stop offset="100%" stopColor="#6D4C41" />
      </linearGradient>
    </defs>
    <rect
      x={x - width / 2}
      y={y - height}
      width={width}
      height={height}
      fill="url(#trunkGradient)"
      rx={3} // 圆角也相应增大
    />
  </g>
);

// 🍃 真实叶子组件
const RealisticLeaf = ({
  cx,
  cy,
  rotation = 0,
  scale = 1,
  isHovered = false,
  index = 0,
}) => {
  // 每片叶子有独特的颜色变化
  const greenVariations = [
    { base: "#4CAF50", vein: "#2E7D32", highlight: "#66BB6A" },
    { base: "#43A047", vein: "#1B5E20", highlight: "#81C784" },
    { base: "#388E3C", vein: "#2E7D32", highlight: "#66BB6A" },
  ];
  const colorSet = greenVariations[index % 3];

  return (
    <g
      transform={`translate(${cx}, ${cy}) rotate(${rotation}) scale(${scale})`}
    >
      <defs>
        {/* 叶子渐变 */}
        <radialGradient id={`leafGradient-${index}`}>
          <stop offset="0%" stopColor={colorSet.highlight} />
          <stop offset="60%" stopColor={colorSet.base} />
          <stop offset="100%" stopColor={colorSet.vein} />
        </radialGradient>

        {/* 叶子阴影 */}
        <filter id={`leafShadow-${index}`}>
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="1" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 阴影层 */}
      <ellipse
        cx={2}
        cy={3}
        rx={isHovered ? 30 : 26}
        ry={isHovered ? 18 : 15}
        fill="rgba(0,0,0,0.2)"
        filter="blur(3px)"
      />

      {/* 叶片主体 - 使用path绘制真实形状 */}
      <path
        d={`
          M 0,-15
          C 8,-15 15,-12 20,-5
          C 22,0 22,5 18,10
          C 12,14 5,16 0,16
          C -5,16 -12,14 -18,10
          C -22,5 -22,0 -20,-5
          C -15,-12 -8,-15 0,-15
        `}
        fill={`url(#leafGradient-${index})`}
        stroke={colorSet.vein}
        strokeWidth={isHovered ? 2 : 1.5}
        filter={`url(#leafShadow-${index})`}
        className="leaf-shape"
      />

      {/* 主叶脉（中间） */}
      <path
        d="M 0,-14 Q 0,0 0,15"
        stroke={colorSet.vein}
        strokeWidth={1.5}
        fill="none"
        opacity={0.7}
      />

      {/* 侧叶脉（左侧） */}
      <path
        d="M 0,-8 Q -8,-5 -12,0"
        stroke={colorSet.vein}
        strokeWidth={0.8}
        fill="none"
        opacity={0.5}
      />
      <path
        d="M 0,0 Q -10,3 -14,8"
        stroke={colorSet.vein}
        strokeWidth={0.8}
        fill="none"
        opacity={0.5}
      />

      {/* 侧叶脉（右侧） */}
      <path
        d="M 0,-8 Q 8,-5 12,0"
        stroke={colorSet.vein}
        strokeWidth={0.8}
        fill="none"
        opacity={0.5}
      />
      <path
        d="M 0,0 Q 10,3 14,8"
        stroke={colorSet.vein}
        strokeWidth={0.8}
        fill="none"
        opacity={0.5}
      />

      {/* 高光效果 */}
      <ellipse
        cx={-5}
        cy={-5}
        rx={8}
        ry={5}
        fill="#fff"
        opacity={isHovered ? 0.4 : 0.25}
        transform="rotate(-20)"
      />

      {/* 边缘锯齿（模拟真实叶边） */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const distance = 18;
        const x = Math.cos(rad) * distance;
        const y = Math.sin(rad) * distance;
        return (
          <circle
            key={angle}
            cx={x}
            cy={y}
            r={0.8}
            fill={colorSet.vein}
            opacity={0.3}
          />
        );
      })}
    </g>
  );
};

// 更新 Branch 组件使用真实叶子
const Branch = ({ x, y, side, issue, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const branchLength = 100; // 🔧 树枝长度：45 → 65（延长约45%）
  const endX = x + side * branchLength;
  const endY = y - 12; // 向上倾斜角度也加大（-8 → -12）

  return (
    <motion.g
      className="branch-group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      initial={{ opacity: 0, x: -side * 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.15, type: "spring" }}
      whileHover={{ scale: 1.05 }}
    >
      {/* 分支树枝 */}
      <line
        x1={x}
        y1={y}
        x2={endX}
        y2={endY}
        stroke="#8B5A2B"
        strokeWidth={isHovered ? 14 : 12} // 树枝粗细
        strokeLinecap="round"
      />

      {/* 真实叶子 */}
      <motion.g
        animate={{
          rotate: [side * -5, side * 5, side * -5],
        }}
        transition={{
          repeat: Infinity,
          duration: 3 + index * 0.5,
          ease: "easeInOut",
        }}
      >
        <RealisticLeaf
          cx={endX}
          cy={endY}
          rotation={side * 45}
          scale={isHovered ? 1.8 : 1.5} // 🔧 叶子大小
          isHovered={isHovered}
          index={index}
        />
      </motion.g>

      {/* 问题编号 */}
      <text
        x={endX}
        y={endY}
        fontSize={11}
        fill="#fff"
        textAnchor="middle"
        fontWeight="bold"
        className="branch-number"
        style={{ pointerEvents: "none" }}
      >
        #{index + 2}
      </text>

      {/* Hover 时显示标题预览 */}
      {isHovered && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <defs>
            <linearGradient
              id={`previewGradient-${index}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#4CAF50" />
              <stop offset="100%" stopColor="#2E7D32" />
            </linearGradient>
            <filter id={`previewShadow-${index}`}>
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>
          <rect
            x={endX - 90}
            y={endY + 25}
            width={180}
            height={50}
            fill={`url(#previewGradient-${index})`}
            stroke="#81C784"
            strokeWidth={2}
            rx={8}
            filter={`url(#previewShadow-${index})`}
          />
          <text
            x={endX}
            y={endY + 55}
            fontSize={16}
            fill="#B3E5FC"
            textAnchor="middle"
            fontWeight="600"
            fontFamily="'Georgia', 'Times New Roman', serif"
          >
            {issue.title.length > 18
              ? issue.title.slice(0, 18) + "..."
              : issue.title}
          </text>
        </motion.g>
      )}
    </motion.g>
  );
};

// 真实树冠组件（由多片叶子组成）
const TreeCrown = ({ x, y, issue, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.g
      className="tree-crown-group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
      whileHover={{ scale: 1.08 }}
    >
      {/* 底层阴影 */}
      <ellipse
        cx={x}
        cy={y + 10}
        rx={50}
        ry={35}
        fill="rgba(0,0,0,0.15)"
        filter="blur(8px)"
      />
      {/* 多层真实叶子组成树冠 */}
      {/* 后排（暗） */}
      {[
        { angle: 0, distance: 50, rotation: 20 }, // 🔧 距离扩大：40→50
        { angle: 60, distance: 52, rotation: -30 }, // 42→52
        { angle: 120, distance: 48, rotation: 15 }, // 38→48
        { angle: 180, distance: 50, rotation: -20 }, // 40→50
        { angle: 240, distance: 52, rotation: 25 }, // 42→52
        { angle: 300, distance: 48, rotation: -15 }, // 38→48
      ].map((leaf, i) => {
        const rad = (leaf.angle * Math.PI) / 180;
        const lx = x + Math.cos(rad) * leaf.distance;
        const ly = y + Math.sin(rad) * leaf.distance;
        return (
          <RealisticLeaf
            key={`back-${i}`}
            cx={lx}
            cy={ly}
            rotation={leaf.rotation}
            scale={1.6} // 🔧 叶子大小：1.3 → 1.6（放大23%）
            index={i + 10}
            isHovered={false}
          />
        );
      })}
      {/* 中排（正常） */}
      {[
        { angle: 30, distance: 38, rotation: 10 }, // 🔧 距离扩大：30→38
        { angle: 90, distance: 40, rotation: -20 }, // 32→40
        { angle: 150, distance: 36, rotation: 15 }, // 28→36
        { angle: 210, distance: 38, rotation: -10 }, // 30→38
        { angle: 270, distance: 40, rotation: 20 }, // 32→40
        { angle: 330, distance: 36, rotation: -15 }, // 28→36
      ].map((leaf, i) => {
        const rad = (leaf.angle * Math.PI) / 180;
        const lx = x + Math.cos(rad) * leaf.distance;
        const ly = y + Math.sin(rad) * leaf.distance;
        return (
          <RealisticLeaf
            key={`mid-${i}`}
            cx={lx}
            cy={ly}
            rotation={leaf.rotation}
            scale={1.8} // 🔧 叶子大小：1.5 → 1.8（放大20%）
            index={i}
            isHovered={isHovered}
          />
        );
      })}
      {/* 前排（亮） */}
      {[
        { angle: 15, distance: 26, rotation: 5 }, // 🔧 距离扩大：20→26
        { angle: 75, distance: 28, rotation: -10 }, // 22→28
        { angle: 135, distance: 24, rotation: 8 }, // 18→24
        { angle: 195, distance: 26, rotation: -5 }, // 20→26
        { angle: 255, distance: 28, rotation: 10 }, // 22→28
        { angle: 315, distance: 24, rotation: -8 }, // 18→24
      ].map((leaf, i) => {
        const rad = (leaf.angle * Math.PI) / 180;
        const lx = x + Math.cos(rad) * leaf.distance;
        const ly = y + Math.sin(rad) * leaf.distance;
        return (
          <RealisticLeaf
            key={`front-${i}`}
            cx={lx}
            cy={ly}
            rotation={leaf.rotation}
            scale={2.0} // 🔧 叶子大小：1.6 → 2.0（放大25%）
            index={i + 3}
            isHovered={isHovered}
          />
        );
      })}
      {/* 中央信息背景 */}
      <circle cx={x} cy={y} r={38} fill="rgba(46, 125, 50, 0.85)" />{" "}
      {/* 🔧 半径：30→38（增大27%） */}
      {/* 问题编号 */}
      <text
        x={x}
        y={y - 12}
        fontSize={14}
        fill="#FFD700"
        textAnchor="middle"
        fontWeight="bold"
      >
        #1
      </text>
      {/* 标题 */}
      <text
        x={x}
        y={y + 5}
        fontSize={11}
        fill="#fff"
        textAnchor="middle"
        fontWeight="500"
      >
        {issue.title.length > 10 ? issue.title.slice(0, 10) : issue.title}
      </text>
      {issue.title.length > 10 && (
        <text
          x={x}
          y={y + 18}
          fontSize={11}
          fill="#fff"
          textAnchor="middle"
          fontWeight="500"
        >
          {issue.title.slice(10, 20)}...
        </text>
      )}
      {/* Hover 提示 */}
      {isHovered && (
        <motion.g
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <rect
            x={x - 70}
            y={y + 42}
            width={140}
            height={28}
            fill="#4CAF50"
            stroke="#81C784"
            strokeWidth={2}
            rx={6}
            opacity={0.95}
          />
          <text
            x={x}
            y={y + 61}
            fontSize={13}
            fill="#B3E5FC"
            textAnchor="middle"
            fontWeight="600"
            fontFamily="'Georgia', 'Times New Roman', serif"
          >
            📖 点击查看详情
          </text>
        </motion.g>
      )}
    </motion.g>
  );
};

// 主树组件
export default function SingleIssueTree({ issues = [], pageSize = 5, compact = false }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const effectivePageSize = Math.max(pageSize, 1);
  const totalPages = Math.ceil(issues.length / effectivePageSize);
  const safeCurrentPage =
    totalPages === 0 ? 0 : Math.min(currentPage, totalPages - 1);
  const startIndex = safeCurrentPage * effectivePageSize;
  const displayIssues = issues.slice(
    startIndex,
    startIndex + effectivePageSize
  );

  useEffect(() => {
    if (safeCurrentPage !== currentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [safeCurrentPage, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    if (totalPages === 0) return;
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  // SVG 画布参数
  const centerX = 250;
  const stumpY = 420;
  const stumpHeight = 35;
  const trunkHeight =
    displayIssues.length === 0 ? 0 : 200 + (displayIssues.length - 1) * 25; // 🔧 树干高度

  const handleIssueClick = (issue) => {
    navigate(`/detail/${issue.id}`);
  };

  // 无问题状态
  // 如果 compact 模式，只绘制简化的树干和分支（不需要后端数据）
  if (compact) {
    const cCenterX = 180;
    const cStumpY = 200;
    const cTrunkHeight = 120;
    const branchCount = 4;
    const branchSpacing = cTrunkHeight / (branchCount + 1);

    return (
      <div className="single-tree-container compact-tree">
        <svg width={360} height={260} className="tree-svg">
          <TreeStump x={cCenterX} y={cStumpY} width={120} height={20} />
          <TreeTrunk x={cCenterX} y={cStumpY} height={cTrunkHeight} width={18} />

          {/* 简化分支：仅线条表示 */}
          {Array.from({ length: branchCount }).map((_, i) => {
            const y = cStumpY - branchSpacing * (i + 1);
            const side = i % 2 === 0 ? 1 : -1;
            const endX = cCenterX + side * (80 + i * 8);
            const endY = y - 6;
            return (
              <line
                key={i}
                x1={cCenterX}
                y1={y}
                x2={endX}
                y2={endY}
                stroke="#8B5A2B"
                strokeWidth={6}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      </div>
    );
  }

  const mainIssue = displayIssues[0];
  const branches = displayIssues.slice(1);

  // 计算分支位置
  const branchSpacing =
    branches.length > 0 ? trunkHeight / (branches.length + 1) : 0;

  return (
    <div className="single-tree-container">
      <svg width={500} height={480} className="tree-svg">
        {/* 树桩 */}
        <TreeStump x={centerX} y={stumpY} />

        {/* 树干 */}
        <TreeTrunk x={centerX} y={stumpY} height={trunkHeight} />

        {/* 分支（第2-5个问题） */}
        {branches.map((issue, i) => {
          const y = stumpY - branchSpacing * (i + 1);
          const side = i % 2 === 0 ? 1 : -1; // 左右交替
          return (
            <Branch
              key={issue.id}
              x={centerX}
              y={y}
              side={side}
              issue={issue}
              index={i}
              onClick={() => handleIssueClick(issue)}
            />
          );
        })}

        {/* 树冠（第1个问题） */}
        <TreeCrown
          x={centerX}
          y={stumpY - trunkHeight - 40}
          issue={mainIssue}
          onClick={() => handleIssueClick(mainIssue)}
        />
      </svg>

      {/* 分页控制 */}
      {totalPages > 1 && (
        <div className="tree-pagination">
          <button
            className="page-btn"
            onClick={handlePrevPage}
            disabled={safeCurrentPage === 0}
          >
            上一页
          </button>
          <span className="page-indicator">
            第 {safeCurrentPage + 1} / {totalPages} 页
          </span>
          <button
            className="page-btn"
            onClick={handleNextPage}
            disabled={safeCurrentPage === totalPages - 1}
          >
            下一页
          </button>
        </div>
      )}

      {/* 问题总数提示 */}
      {totalPages > 1 && (
        <motion.div
          className="more-issues-hint"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          共 {issues.length} 个问题，使用分页查看更多
        </motion.div>
      )}
    </div>
  );
}
