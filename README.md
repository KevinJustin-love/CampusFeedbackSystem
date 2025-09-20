## 前端部分

首先，输入 `cd frontend` 切换到前端文件夹。

其次，在终端输入 `npm install` 安装必要的依赖。

最后，运行 `npm run start` 得到链接 http://localhost:5173/

## 后端部分

首先，输入 `cd backend` 切换到后端文件夹。

其次，切换到虚拟环境，并安装所有依赖。

最后，运行 `python manage.py runserver` 得到后端链接

## 具体使用

访问 http://localhost:5173/login, 注册后登录。
现有管理员：

- 用户名：admin
- 密码：admin123

-用户名：life_admin -密码：life123

## 开会

### 现存 bug

- 登录界面 Register/Login 按钮 CSS 样式有问题（飘到右上角了
- register 无法正确进行 登录时无法实现区分 lifeAdmin、studyAdmin...因此无法进入管理员界面
- 用户信息无法更新
- “我的”部分无法显示（是空的吗
- 点赞功能是否应该移到 IssueDetailPage

### 做到什么程度

- 把所有 bug 修好
- 评论区的展示逻辑
- 导航栏的信息都目前是硬编码的


> register 界面