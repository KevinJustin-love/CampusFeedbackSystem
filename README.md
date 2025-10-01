## 合作规范

请务必遵循 33 【入职第一课：做好分支协作，告别代码冲突 - Perry Ye | 小红书 - 你的生活兴趣社区】 😆 7dRoWTINT2J982L 😆 https://www.xiaohongshu.com/discovery/item/685c6bde0000000017034db9?source=webshare&xhsshare=pc_web&xsec_token=AB5dxMlZK-w-R0bJZu0Mzmi1h2O4BMq83E40MoNGwEGXo=&xsec_source=pc_share 的内容进行代码的管理。

⚠ 每当团队用户做出一个新的 `feature` 时，最好把其代码同步到本地（通过 `develop` 分支），并解决随之产生的代码冲突 (参考小红书的教程)。

## 前端部分

首先，输入 `cd frontend` 切换到前端文件夹。

其次，在终端输入 `npm install` 安装必要的依赖。

最后，运行 `npm run start` 得到链接 http://localhost:5173/

## 后端部分

首先，输入 `cd backend` 切换到后端文件夹。

其次，切换到虚拟环境，并安装所有依赖。

最后，运行 `python manage.py runserver` 得到后端链接

## 具体使用

- 对于非管理员（学生等），直接在前端进行注册。访问 http://localhost:5173/login, 注册后登录。

- 对于管理员，在后端文件夹中运行 `python create_admin_data.py`，会创建 super_admin、life_admin 两名用户。其中，super_admin 的用户名设置为 admin, 密码设置为 admin123。life_admin 用户名设置为 life_admin，密码设置为 life123
