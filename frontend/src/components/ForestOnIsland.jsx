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

// 保持原有的配置结构，但实际上我们使用 modeConfig 来生成位置
function getForestConfig(mode) {
  const configs = [
    { count: 18, minScale: 1.08, maxScale: 1.28, minR: 100, maxR: 300 }, 
    { count: 28, minScale: 0.85, maxScale: 1.05, minR: 60, maxR: 300 }, 
    { count: 40, minScale: 0.6, maxScale: 0.8, minR: 50, maxR: 300}, 
    { count: 50, minScale: 0.38, maxScale: 0.55, minR: 40, maxR: 300 }, 
  ];
  return configs[mode] || configs[1];
}

// 岛的空间范围（相对island-image-wrapper的SVG坐标）
// 以700x500为基准，椭圆分布

function ForestOnIsland({ mode = 0 }) {
  // SVG 视口参数
  const svgWidth = 700;
  const svgHeight = 500;
  const centerX = 370;
  const centerY = 285;

  // 不同模式下的层数、每层树数、半径和缩放
  const modeConfig = [
    // mode 0: 稀疏 (引入更大的随机扰动)
    { 
        rings: 3, 
        treesPerRing: [6, 8, 10], 
        radii: [60, 120, 180], 
        scale: [1.18, 1.18, 1.18],
        radialJitter: 20, // 半径扰动范围（最大 ±20）
        angleJitter: 0.3,  // 角度扰动范围（最大 ±0.3 弧度）
    },
    // mode 1: 较茂盛
    { 
        rings: 4, 
        treesPerRing: [1, 13, 15, 15], 
        radii: [15, 80, 150, 200], 
        scale: [1.00, 1.00, 0.95, 0.90],
        radialJitter: 15,
        angleJitter: 0.2,
    },
    // mode 2: 茂盛
    { 
        rings: 4, 
        treesPerRing: [5, 20, 25, 25], 
        radii: [20, 90, 150, 210], 
        scale: [0.85, 0.85, 0.75, 0.75],
        radialJitter: 15,
        angleJitter: 0.15,
    },
    // mode 3: 非常茂盛
    { 
        rings: 5, 
        treesPerRing: [5, 20, 30, 40, 50], 
        radii: [30, 80, 140, 200, 240], 
        scale: [0.8, 0.65, 0.6, 0.55, 0.5],
        radialJitter: 15,
        angleJitter: 0.1,
    },
  ];
  
  const { 
    rings, 
    treesPerRing, 
    radii, 
    scale, 
    radialJitter, 
    angleJitter 
  } = modeConfig[mode] || modeConfig[0];

  let trees = [];
  let treeIdx = 0;
  const ellipseRatio = 0.6; // 椭圆短轴/长轴比例，长轴水平
  
  for (let ring = 0; ring < rings; ring++) {
    const n = treesPerRing[ring];
    const r_base = radii[ring];
    const s = scale[ring];
    
    for (let i = 0; i < n; i++) {
      // 1. 计算基础角度
      const angle_base = (2 * Math.PI * i) / n - Math.PI / 2;
      
      // 2. 引入径向和角度扰动 (Jittering)
      const r_jittered = r_base + getRandom(-radialJitter, radialJitter);
      const angle_jittered = angle_base + getRandom(-angleJitter, angleJitter);
      
      // 3. 计算最终坐标
      let cx = centerX + Math.cos(angle_jittered) * r_jittered;
      let cy = centerY + Math.sin(angle_jittered) * r_jittered * ellipseRatio;

      // 4. 引入微小平移扰动，增加错落感
      cx += getRandom(-4, 4);
      cy += getRandom(-2, 2);

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