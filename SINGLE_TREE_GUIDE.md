# 单树多分支问题展示系统使用指南

## 功能概述

新实现的单树多分支系统允许每页用一棵树展示最多 5 个问题：

- **0 个问题**：显示树桩 + "暂无问题"
- **1 个问题**：树桩 + 树冠（顶部）
- **2-5 个问题**：第 1 个在树冠，第 2-5 个依次作为分支从上到下连接

## 文件结构

```
frontend/src/
├── components/
│   ├── SingleIssueTree.jsx    # 核心单树组件
│   └── IssueCard.jsx           # 更新支持新渲染模式
├── pages/
│   └── ForestIssue.jsx         # 森林面板，支持单树/多树模式
└── styles/
    └── SingleIssueTree.css     # 单树样式
```

## 使用方法

### 1. 在 ForestIssue 页面使用单树模式

```jsx
import ForestPanel from './pages/ForestIssue';

// 单树模式
<ForestPanel issues={issuesArray} mode="single-tree" />

// 多树模式（原有模式）
<ForestPanel issues={issuesArray} mode="multi-tree" />
```

### 2. 直接使用 SingleIssueTree 组件

```jsx
import SingleIssueTree from "./components/SingleIssueTree";

<SingleIssueTree
  issues={issuesArray}
  pageSize={5} // 每棵树最多显示的问题数
/>;
```

### 3. 在 IssueCard 中使用

```jsx
<IssueCard
  issue={issuesArray} // 传入数组
  renderMode="single-tree"
/>
```

## 视觉特性

### 树的结构

- **树桩**：底部基础，带年轮纹理和渐变色
- **树干**：主干连接树桩和树冠，带立体渐变
- **分支**：左右交替排列，带叶子和问题编号
- **树冠**：顶部最大的圆形区域，展示第一个问题

### 交互动效

- **摇晃动画**：整棵树轻微摇晃模拟风吹效果
- **Hover 高亮**：鼠标悬停在分支/树冠时放大并显示提示
- **渐入动画**：树冠、分支依次出现，营造生长感
- **点击跳转**：点击任意问题跳转详情页

### 颜色方案

- 树干/树桩：深棕色系 (#8B5A2B, #6D4C41)
- 树冠/叶子：绿色系 (#4CAF50, #66BB6A, #2E7D32)
- 文字：白色 + 阴影增强可读性

## 分页逻辑

当问题超过 5 个时：

- 自动分页，每页一棵树
- 显示"上一棵树/下一棵树"按钮
- 页码指示器：第 X / Y 棵树

## 响应式适配

- 移动端：树自动缩小，分页按钮堆叠
- 平板/桌面：树居中显示，分页横向排列

## 自定义配置

### 修改树的尺寸

在 `SingleIssueTree.jsx` 中调整：

```jsx
const centerX = 250; // 树的水平中心
const stumpY = 420; // 树桩位置
const trunkHeight = 200; // 树干高度
const branchLength = 45; // 分支长度
```

### 修改颜色主题

在 `SingleIssueTree.jsx` 的渐变定义中：

```jsx
<linearGradient id="stumpGradient">
  <stop offset="0%" stopColor="#自定义颜色" />
  <stop offset="100%" stopColor="#自定义颜色" />
</linearGradient>
```

### 调整动画速度

```jsx
transition={{ delay: 0.3, duration: 2 }}  // 调整 duration
```

## 数据格式要求

传入 `issues` 数组应包含以下字段：

```js
[
  {
    id: 1,
    title: "问题标题",
    topic: "分类",
    status: "状态",
    host: "发布者", // 可选
    // ... 其他字段
  },
];
```

## 性能优化

- 使用 `motion` 组件的 `layoutId` 实现共享布局动画
- 分支组件按需渲染，不超过 4 个
- SVG 矢量绘制，缩放不失真

## 兼容性说明

- 依赖 `framer-motion` 库（已在项目中）
- 需要 React Router 的 `useNavigate`
- 支持所有现代浏览器（Chrome, Firefox, Safari, Edge）

## 下一步增强建议

1. **季节主题**：根据时间/设置切换春夏秋冬颜色
2. **动态生长**：首次加载时树从种子长出的动画
3. **拖拽排序**：允许拖拽分支调整问题优先级
4. **3D 效果**：利用 CSS 3D transform 增加立体感
5. **音效**：点击时播放叶子沙沙声

---

## 快速测试

在任意父组件中：

```jsx
import SingleIssueTree from "./components/SingleIssueTree";

const testIssues = [
  { id: 1, title: "测试问题1", topic: "学业", status: "进行中" },
  { id: 2, title: "测试问题2", topic: "生活", status: "已解决" },
  { id: 3, title: "测试问题3", topic: "情感", status: "待处理" },
];

<SingleIssueTree issues={testIssues} />;
```

效果：一棵树，树冠显示问题 1，两个分支显示问题 2 和问题 3。
