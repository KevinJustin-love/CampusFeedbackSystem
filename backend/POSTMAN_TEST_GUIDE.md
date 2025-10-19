# 📮 Postman 测试智能客服 API 指南

## 🚀 准备工作

### 1. 启动 Django 服务器

```bash
cd backend
python manage.py runserver
```

服务器将在 `http://127.0.0.1:8000` 或 `http://localhost:8000` 运行

### 2. 确认依赖已安装

```bash
pip install -r requirements.txt
```

---

## 📋 Postman 测试步骤

### 测试 1: 基本聊天功能测试

#### 配置请求：

1. **Method（请求方法）**: `POST`

2. **URL（请求地址）**:

   ```
   http://127.0.0.1:8000/feedback/chat/
   ```

3. **Headers（请求头）**:

   - 点击 "Headers" 标签页
   - 添加以下 Header：

   ```
   Content-Type: application/json
   ```

4. **Body（请求体）**:

   - 点击 "Body" 标签页
   - 选择 "raw"
   - 选择 "JSON" 格式
   - 输入以下内容：

   **测试用例 1 - 简单问候：**

   ```json
   {
     "message": "你好"
   }
   ```

5. **发送请求**: 点击 "Send" 按钮

#### 预期响应：

**成功响应（Status: 200 OK）：**

```json
{
  "message": "您好！很高兴为您服务。我是 DoveLink 校园反馈系统的智能客服...",
  "usage": {
    "prompt_tokens": 123,
    "completion_tokens": 45,
    "total_tokens": 168
  }
}
```

---

### 测试 2: 系统功能咨询

#### 请求体：

```json
{
  "message": "请问如何提交一个校园反馈问题？"
}
```

#### 预期响应：

AI 应该回答关于如何使用 DoveLink 系统提交反馈的步骤。

---

### 测试 3: 带对话历史的多轮对话

#### 请求体：

```json
{
  "message": "那提交后如何查看问题的处理状态？",
  "history": [
    {
      "role": "user",
      "content": "请问如何提交一个校园反馈问题？"
    },
    {
      "role": "assistant",
      "content": "您可以通过以下步骤提交校园反馈问题：1. 登录系统 2. 点击提交问题 3. 填写问题详情..."
    }
  ]
}
```

#### 预期响应：

AI 应该基于对话历史，回答关于查看问题处理状态的内容。

---

### 测试 4: 空消息错误处理

#### 请求体：

```json
{
  "message": ""
}
```

#### 预期响应：

**错误响应（Status: 400 Bad Request）：**

```json
{
  "error": "消息不能为空"
}
```

---

### 测试 5: 缺少 message 字段

#### 请求体：

```json
{
  "history": []
}
```

#### 预期响应：

**错误响应（Status: 400 Bad Request）：**

```json
{
  "error": "消息不能为空"
}
```

---

## 🎯 完整测试检查清单

- [ ] ✅ 基本问候测试成功（返回 200 和合理回复）
- [ ] ✅ 系统功能咨询测试成功
- [ ] ✅ 多轮对话测试成功（带 history）
- [ ] ✅ 空消息返回 400 错误
- [ ] ✅ 缺少字段返回 400 错误
- [ ] ✅ 响应时间合理（一般 2-10 秒）
- [ ] ✅ 返回的 message 内容专业、温和
- [ ] ✅ 返回包含 usage 统计信息

---

## 🔍 调试技巧

### 如果遇到连接错误：

1. 检查 Django 服务器是否正在运行
2. 确认 URL 是否正确（端口号、路径）
3. 检查防火墙设置

### 如果遇到 500 错误：

1. 查看 Django 终端输出的错误信息
2. 检查 OpenAI API Key 是否正确
3. 检查网络连接是否能访问 `https://ai98.vip/v1`
4. 查看 `backend/backend/settings.py` 中的配置

### 如果 AI 回复不符合预期：

1. 检查 `feedback/chat_service.py` 中的 `system_prompt`
2. 尝试调整 `temperature` 参数（0.0-1.0，默认 0.7）
3. 调整 `max_tokens` 参数

---

## 📸 Postman 截图示例

### 配置示例：

```
┌─────────────────────────────────────────┐
│ POST http://127.0.0.1:8000/feedback/chat/ │
├─────────────────────────────────────────┤
│ Headers:                                │
│   Content-Type: application/json        │
├─────────────────────────────────────────┤
│ Body (raw - JSON):                      │
│   {                                     │
│     "message": "你好"                    │
│   }                                     │
└─────────────────────────────────────────┘
```

---

## 🛠️ 高级测试

### 测试长对话历史：

```json
{
  "message": "谢谢你的帮助！",
  "history": [
    { "role": "user", "content": "你好" },
    { "role": "assistant", "content": "您好！很高兴为您服务..." },
    { "role": "user", "content": "如何提交问题？" },
    { "role": "assistant", "content": "您可以通过以下步骤..." },
    { "role": "user", "content": "如何查看状态？" },
    { "role": "assistant", "content": "您可以在个人中心查看..." }
  ]
}
```

### 测试复杂问题：

```json
{
  "message": "我提交了一个关于食堂卫生的问题，已经3天了还没有人回复，应该怎么办？"
}
```

---

## 📊 性能基准

- **响应时间**: 通常 2-10 秒
- **Token 使用**:
  - 简单问候: ~150-200 tokens
  - 复杂问题: ~300-500 tokens
- **成功率**: 应该接近 100%（网络正常情况下）

---

## ✅ 测试完成标准

当以上所有测试都通过时，说明后端 OpenAI API 已经正确配置并正常工作！

可以继续进行前端开发了。🎉
