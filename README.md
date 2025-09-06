## 前端部分

首先，输入 `cd frontend` 切换到前端文件夹。

其次，在终端输入 `npm install` 安装必要的依赖。

最后，运行 `npm run start` 得到链接 http://localhost:5173/

## 后端部分

首先，输入 `cd backend` 切换到后端文件夹。

其次，切换到虚拟环境，并安装所有依赖。

最后，运行 `python manage.py runserver` 得到后端链接 

## 具体使用

首先，切换到后端文件夹。

其次，在虚拟环境中运行 `python manage.py createsuperuser`，并对应创建一位用户。输入 `username、role、password`。
其中，`role` 必须为 student、life_admin、study_admin、manage_admin，`username` 对应 student、lifeAdmin、studyAdmin、manageAdmin。

> 还有 bug 没修好。当登录了admin后，再登录student，在 /dashboard 会出现admin才有的切换按钮