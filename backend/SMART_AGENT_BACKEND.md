# 智能客服后端实现 - 第一阶段完成

## ✅ 已完成的工作

### 1. 依赖配置

- 已在 `requirements.txt` 中添加 `openai` 包
- 已在 `settings.py` 中配置 OpenAI API Key 和 Base URL

### 2. 聊天服务实现

- 创建了 `chat_service.py` 文件
- 实现了 `ChatService` 类，包含：
  - OpenAI 客户端初始化
  - 系统 Prompt 定义（DoveLink 校园反馈系统智能客服角色）
  - `get_response()` 方法处理用户消息和对话历史

### 3. API 接口

- 在 `views.py` 中添加了 `chat()` 视图函数
- 路由：`POST /feedback/chat/`
- 权限：AllowAny（允许所有用户使用）
- 功能：接收用户消息和可选的对话历史，返回 AI 回复

### 4. URL 配置

- 在 `feedback/urls.py` 中添加了聊天路由

## 📝 API 接口说明

### POST /feedback/chat/

**请求体：**

```json
{
  "message": "用户输入的问题",
  "history": [
    // 可选，对话历史
    { "role": "user", "content": "之前的用户消息" },
    { "role": "assistant", "content": "之前的AI回复" }
  ]
}
```

**成功响应（200）：**

```json
{
  "message": "AI客服的回复内容",
  "usage": {
    "prompt_tokens": 123,
    "completion_tokens": 456,
    "total_tokens": 579
  }
}
```

**错误响应：**

- 400: 消息为空
- 500: 服务器错误或 OpenAI API 调用失败

## 🧪 测试步骤

### 1. 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

### 2. 运行服务器

```bash
python manage.py runserver
```

### 3. 测试 API（使用 curl 或 Postman）

```bash
curl -X POST http://localhost:8000/feedback/chat/ \
  -H "Content-Type: application/json" \
  -d '{"message": "你好，请问如何提交反馈问题？"}'
```

## 🔧 配置说明

OpenAI API 配置位于 `backend/settings.py`：

```python
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL")
```

如需修改，可以：

1. 直接在 `settings.py` 中修改
2. 或创建 `.env` 文件并设置环境变量：
   ```
   OPENAI_API_KEY=your_key
   OPENAI_BASE_URL=your_base_url
   ```

## ⏭️ 下一步：前端实现

后端已经准备就绪！请测试确认后端 API 工作正常，然后我们开始实现前端的 `ChatWidget` 组件。
