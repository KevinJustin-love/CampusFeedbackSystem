# 校园反馈系统 (FeedbackGo) 项目架构文档

## 项目概述

FeedbackGo 是一个校园反馈管理系统，采用**前后端分离**的架构设计，后端使用 **Django REST Framework**，前端使用 **React + Vite**。该系统提供学生问题反馈、管理员处理、通知系统、浏览历史和收藏等功能。

---

## 总体架构

### 架构模式

- **前后端分离架构**
- **RESTful API** 接口设计
- **JWT Token** 身份认证
- **角色权限管理**

### 技术栈总览

| 层级        | 技术栈                             | 用途               |
| ----------- | ---------------------------------- | ------------------ |
| 前端        | React 18 + Vite + React Router     | 用户界面和路由管理 |
| 后端        | Django 5.2 + Django REST Framework | API 服务和业务逻辑 |
| 身份认证    | JWT (Simple JWT)                   | 无状态身份验证     |
| 数据库      | SQLite                             | 开发环境数据存储   |
| HTTP 客户端 | Axios                              | 前后端通信         |
| 文件上传    | Django + Pillow                    | 图片和附件处理     |
| 跨域处理    | django-cors-headers                | CORS 配置          |

---

## 后端架构 (Django)

### 核心框架与中间件

```python
# 主要依赖
Django==5.2
djangorestframework
djangorestframework-simplejwt
django-cors-headers
Pillow
psycopg2-binary
```

### 应用模块划分

- **`api`** - 用户认证与管理
- **`feedback`** - 反馈问题核心业务
- **`backend`** - 项目配置

### 数据模型设计

#### 用户模块 (`api/models.py`)

```
CustomUser (继承 AbstractUser)
├── bio: 个人简介
├── phone: 手机号
├── avatar: 头像
└── roles: 角色关联 (多对多)

Role (角色管理)
├── name: 角色名称
├── description: 角色描述
└── topic: 关联内容类别
```

#### 反馈模块 (`feedback/models.py`)

```
Topic (问题分类)
└── name: 分类名称

Issue (问题)
├── host: 提交用户
├── title: 标题
├── topic: 分类
├── description: 描述
├── status: 处理状态
├── attachment: 附件
├── views: 浏览量
├── likes: 点赞量
└── popularity: 热度值

Reply (管理员回复)
├── administrator: 回复管理员
├── content: 回复内容
├── attachment: 附件
└── issue: 关联问题

Message (用户评论)
├── user: 评论用户
├── body: 评论内容
└── issue: 关联问题

其他模型:
- IssueLike: 点赞记录
- Notification: 通知系统
- ViewHistory: 浏览历史
- Favorite: 收藏夹
```

### API 设计

#### 认证相关 (`/api/`)

- `POST /api/token/` - 获取 JWT Token
- `POST /api/token/refresh/` - 刷新 Token
- `POST /api/register/` - 用户注册
- `GET /api/me/` - 获取当前用户信息
- `PUT /api/profile/` - 更新用户资料

#### 反馈相关 (`/feedback/`)

- `GET/POST /feedback/issues/` - 问题列表/创建
- `GET/PUT/DELETE /feedback/issues/{id}/` - 问题详情/更新/删除
- `GET/POST /feedback/issues/{id}/messages/` - 评论列表/创建
- `POST /feedback/issues/{id}/like/` - 点赞/取消点赞
- `POST /feedback/issues/{id}/view/` - 记录浏览
- `GET/POST /feedback/notifications/` - 通知相关
- `GET/POST /feedback/favorites/` - 收藏相关

#### 管理员相关 (`/api/admin/`)

- `GET /api/admin/issues/` - 管理员问题列表
- `POST /api/admin/issues/{id}/reply/` - 管理员回复

### 权限系统

- **超级管理员** (`super_admin`): 全部权限
- **内容管理员** (`content_admin`): 特定分类管理权限
- **普通用户**: 基础功能权限

### 认证机制

```python
# JWT 配置
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
}

# 自定义 Token 载荷
token['username'] = user.username
token['roles'] = [role.name for role in user.roles.all()]
token['topics'] = [role.topic for role in user.roles.all()]
```

---

## 前端架构 (React)

### 核心依赖

```json
{
  "react": "^18.3.1",
  "react-router-dom": "^7.8.2",
  "axios": "^1.11.0",
  "jwt-decode": "^4.0.0",
  "lucide-react": "^0.542.0"
}
```

### 项目结构

```
src/
├── api.js                 # API 接口封装
├── constants.js           # 常量定义
├── App.jsx               # 主应用组件
├── index.jsx             # 应用入口
├── styles.css            # 全局样式
├── components/           # 组件库
│   ├── ProtectedRoute.jsx    # 路由保护
│   ├── Navbar.jsx           # 导航栏
│   ├── IssueCard.jsx        # 问题卡片
│   ├── FilterBar.jsx        # 筛选栏
│   └── functions/           # 工具函数
├── pages/                # 页面组件
│   ├── LoginPage.jsx        # 登录页
│   ├── StudentDashboard.jsx # 学生仪表板
│   ├── AdminDashboard.jsx   # 管理员仪表板
│   ├── IssueDetailPage.jsx  # 问题详情页
│   └── NotificationPage.jsx # 通知页面
├── hooks/                # 自定义 Hooks
├── services/             # 业务服务
└── styles/               # 样式文件
```

### 路由设计

```jsx
Routes:
├── /dashboard           # 学生仪表板 (需认证)
├── /admin              # 管理员仪表板 (需认证)
├── /detail/:id         # 问题详情页 (需认证)
├── /notifications      # 通知页面 (需认证)
├── /login              # 登录页
├── /register           # 注册页
└── /logout             # 登出
```

### 状态管理

- **本地状态**: 使用 React Hooks (`useState`, `useEffect`)
- **用户状态**: 通过 `localStorage` 存储 JWT Token
- **全局状态**: 通过 props 和 context 传递

### API 封装

```javascript
// API 实例配置
const api = axios.create({
  baseURL: "http://localhost:8000",
});

// 请求拦截器 - 自动添加 JWT Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API 模块划分
export const feedbackAPI = {
  /* 反馈相关 */
};
export const notificationAPI = {
  /* 通知相关 */
};
export const historyAPI = {
  /* 历史记录相关 */
};
export const favoriteAPI = {
  /* 收藏相关 */
};
```

### 身份认证流程

```jsx
// 路由保护组件
function ProtectedRoute({ children }) {
  // 1. 检查 localStorage 中的 token
  // 2. 验证 token 有效性
  // 3. 自动刷新过期 token
  // 4. 未认证则重定向到登录页
}
```

---

## 开发环境配置

### 前端开发服务器 (Vite)

```javascript
// vite.config.js - 代理配置
server: {
  proxy: {
    '/api': { target: 'http://127.0.0.1:8000' },
    '/feedback': { target: 'http://localhost:8000' },
    '/media': { target: 'http://127.0.0.1:8000' }
  }
}
```

### 后端 CORS 配置

```python
# settings.py
CORS_ALLOW_ALL_ORIGINS = True
CORS_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

---

## 核心功能模块

### 1. 用户认证系统

- JWT Token 无状态认证
- 角色权限管理
- 自动 Token 刷新
- 路由级别的权限控制

### 2. 反馈管理系统

- 问题发布与分类
- 状态流转管理
- 附件上传支持
- 热度算法 (点赞*2 + 浏览*1)

### 3. 交互功能

- 点赞系统
- 评论系统
- 管理员回复
- 通知推送

### 4. 个人功能

- 浏览历史记录
- 收藏夹管理
- 个人资料更新

### 5. 管理员功能

- 问题审核处理
- 按角色权限过滤内容
- 批量操作支持

---

## 数据流向

```
用户操作 -> React 组件 -> Axios API 调用 -> Django REST API -> 数据库操作 -> JSON 响应 -> 前端状态更新 -> UI 渲染
```

### 典型交互流程

1. **用户登录**:

   ```
   LoginPage -> api.post('/api/token/') -> JWT Token -> localStorage -> 自动设置请求头
   ```

2. **发布问题**:

   ```
   Form 提交 -> feedbackAPI.createIssue() -> POST /feedback/issues/ -> 数据库保存 -> 通知管理员
   ```

3. **管理员回复**:
   ```
   AdminDashboard -> 回复表单 -> adminReplyIssue() -> 更新问题状态 -> 通知用户
   ```

---

## 部署考虑

### 生产环境建议

- **数据库**: 从 SQLite 升级到 PostgreSQL 或 MySQL
- **静态文件**: 使用 CDN 或对象存储
- **容器化**: Docker + Docker Compose
- **反向代理**: Nginx
- **HTTPS**: SSL 证书配置

### 安全建议

- 环境变量管理 (使用 python-dotenv)
- 密钥轮换策略
- API 限流控制
- CSRF 保护 (如需要)
- 文件上传安全检查

---

## 项目优势

1. **模块化设计**: 前后端职责清晰，易于维护和扩展
2. **RESTful API**: 标准化接口设计，支持多端接入
3. **角色权限**: 灵活的权限管理系统
4. **用户体验**: 单页面应用，响应式设计
5. **开发效率**: 热重载、代理配置等开发友好特性

---

## 扩展建议

1. **实时通知**: 集成 WebSocket 或 Server-Sent Events
2. **文件系统**: 对象存储服务集成
3. **搜索功能**: Elasticsearch 全文搜索
4. **缓存层**: Redis 缓存热点数据
5. **监控日志**: 应用性能监控和日志聚合
6. **测试覆盖**: 单元测试和集成测试
7. **CI/CD**: 自动化部署流水线

该架构为校园反馈系统提供了稳定、可扩展的技术基础，支持未来功能扩展和性能优化需求。
