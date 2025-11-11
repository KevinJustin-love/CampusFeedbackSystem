import React from "react";

// 树型A：松树
const TreeTypeA = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <rect x={-4} y={10} width={8} height={18} fill="#8B5A2B" rx={2} />
    <polygon points="0,0 -12,18 12,18" fill="#388E3C" />
    <polygon points="0,7 -10,20 10,20" fill="#43A047" />
    <polygon points="0,14 -8,24 8,24" fill="#66BB6A" />
  </g>
);

// 树型B：圆冠树
const TreeTypeB = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <rect x={-3} y={12} width={6} height={14} fill="#A0522D" rx={2} />
    <ellipse cx={0} cy={10} rx={10} ry={12} fill="#81C784" />
    <ellipse cx={-5} cy={8} rx={4} ry={5} fill="#388E3C" opacity={0.7} />
    <ellipse cx={5} cy={8} rx={4} ry={5} fill="#388E3C" opacity={0.7} />
  </g>
);

// 树型C：小灌木
const TreeTypeC = ({ x, y, scale = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${scale})`}>
    <ellipse cx={0} cy={16} rx={6} ry={4} fill="#6D4C41" />
    <ellipse cx={0} cy={10} rx={10} ry={7} fill="#A5D6A7" />
    <ellipse cx={-5} cy={12} rx={4} ry={3} fill="#388E3C" opacity={0.6} />
    <ellipse cx={5} cy={12} rx={4} ry={3} fill="#388E3C" opacity={0.6} />
  </g>
);

const treeTypes = [TreeTypeA, TreeTypeB, TreeTypeC];

function getRandom(min, max) {
  return min + Math.random() * (max - min);
}

function getForestConfig(mode) {
  // mode: 0=稀疏, 1=较茂盛, 2=茂盛, 3=非常茂盛
  // 稀疏时树最大，越茂密树越小
  const configs = [
    // === 调整后的稀疏模式 (mode: 0) ===
    { 
      count: 18, // 数量增加，实现更均匀的覆盖
      minScale: 1.08, 
      maxScale: 1.28, 
      minR: 100,  // 最小半径减小
      maxR: 300  // 最大半径增大，分布到小岛更广区域
    }, 
    // ===================================
    { count: 28, minScale: 0.85, maxScale: 1.05, minR: 60, maxR: 300 }, // 较茂盛
    { count: 40, minScale: 0.6, maxScale: 0.8, minR: 50, maxR: 300}, // 茂盛
    { count: 50, minScale: 0.38, maxScale: 0.55, minR: 40, maxR: 300 }, // 非常茂盛
  ];
  return configs[mode] || configs[1];
}

// 岛的空间范围（相对island-image-wrapper的SVG坐标）
// 以700x300为基准，椭圆分布

function ForestOnIsland({ mode = 0 }) {
  // SVG 视口参数
  const svgWidth = 700;
  const svgHeight = 500;
  const centerX = 350;
  const centerY = 270;

  // 不同模式下的层数和每层树数
  // 稀疏: 1层, 较茂盛: 2层, 茂盛: 3层, 非常茂盛: 4层
  const modeConfig = [
    { rings: 3, treesPerRing: [8,12,16], radii: [60, 120, 180], scale: [1.18, 1.18, 1.18, 1.18] },
    { rings: 4, treesPerRing: [1,15,25,35,45], radii: [10,65, 130,190], scale: [1.05, 1.00, 0.95, 0.90] },
    { rings: 3, treesPerRing: [8, 14, 18], radii: [70, 120, 180], scale: [0.95, 0.75, 0.6] },
    { rings: 4, treesPerRing: [8, 12, 16, 20], radii: [55, 95, 140, 200], scale: [0.8, 0.65, 0.5, 0.38] },
  ];
  const { rings, treesPerRing, radii, scale } = modeConfig[mode] || modeConfig[0];

  let trees = [];
  let treeIdx = 0;
  const ellipseRatio = 0.6; // 椭圆短轴/长轴比例，长轴水平
  for (let ring = 0; ring < rings; ring++) {
    const n = treesPerRing[ring];
    const r = radii[ring];
    const s = scale[ring];
    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      const cx = centerX + Math.cos(angle) * r;
      const cy = centerY + Math.sin(angle) * r * ellipseRatio;
      const Tree = treeTypes[treeIdx % treeTypes.length];
      trees.push(
        <Tree key={`r${ring}-t${i}`} x={cx} y={cy} scale={s} />
      );
      treeIdx++;
    }
  }

  return (
    <svg
      className="island-forest-svg"
      width={svgWidth}
      height={svgHeight}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        pointerEvents: "none",
        zIndex: 3,
      }}
    >
      {trees}
    </svg>
  );
}

export default ForestOnIsland;