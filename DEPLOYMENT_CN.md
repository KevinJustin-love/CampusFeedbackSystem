# dovelink.com 部署实操指南

本指南提供在域名 **dovelink.com** 上上线本项目前后端的可执行步骤，假设你有一台 Linux 服务器（Ubuntu/Debian），并能通过 sudo 获得 root 权限。

## 1. 前提准备
- 域名解析：在 DNS 控制台将 `dovelink.com` 和 `www.dovelink.com` 解析到服务器公网 IP（若前后端分域，新增 `api.dovelink.com` 指向同一 IP）。
- 系统依赖：安装 `git`、`python3-venv`、`nginx`、`certbot`（`apt install python3-venv nginx certbot python3-certbot-nginx`）。
- 开放端口：防火墙或安全组开放 80/443 端口。

## 2. 部署后端 (Django)
1. 获取代码并安装依赖：
   ```bash
   cd /srv
   git clone https://your_repo_url.git CampusFeedbackSystem
   cd CampusFeedbackSystem/backend
   python3 -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt
   ```
2. 配置环境变量：
   ```bash
   cp .env.example .env
   # 编辑 .env，至少设置 DJANGO_SECRET_KEY，并按需填写数据库、OpenAI 相关变量
   ```
   - 如需 PostgreSQL，写入类似 `DATABASE_URL=postgres://user:pass@localhost:5432/dovelink`，并在服务器上准备数据库。
3. 初始化数据与静态文件：
   ```bash
   python manage.py migrate
   python manage.py collectstatic --noinput
   # 如需初始管理员数据
   python create_admin_data.py
   ```
4. 以 Gunicorn 启动（示例使用 0.0.0.0:8000）：
   ```bash
   DJANGO_DEBUG=False .venv/bin/gunicorn backend.wsgi:application --bind 0.0.0.0:8000
   ```
5. 推荐配置 systemd 保持后台运行 `/etc/systemd/system/dovelink.service`：
   ```ini
   [Unit]
   Description=DoveLink Django Service
   After=network.target

   [Service]
   WorkingDirectory=/srv/CampusFeedbackSystem/backend
   ExecStart=/srv/CampusFeedbackSystem/backend/.venv/bin/gunicorn backend.wsgi:application --bind 127.0.0.1:8000
   EnvironmentFile=/srv/CampusFeedbackSystem/backend/.env
   Restart=always
   User=www-data

   [Install]
   WantedBy=multi-user.target
   ```
   执行 `sudo systemctl daemon-reload && sudo systemctl enable --now dovelink.service` 使其自启动。

## 3. 配置 Nginx 反向代理（同域部署示例）
在 `/etc/nginx/sites-available/dovelink` 写入：
```nginx
server {
    listen 80;
    server_name dovelink.com www.dovelink.com;

    root /var/www/dovelink/dist;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        alias /srv/CampusFeedbackSystem/backend/staticfiles/;
    }

    location /media/ {
        alias /srv/CampusFeedbackSystem/backend/media/;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
启用并重载：
```bash
sudo ln -s /etc/nginx/sites-available/dovelink /etc/nginx/sites-enabled/dovelink
sudo nginx -t && sudo systemctl reload nginx
```

## 4. 前端构建与部署
1. 在仓库根目录执行：
   ```bash
   cd /srv/CampusFeedbackSystem/frontend
   npm install
   cp .env.production.example .env.production
   # 将 VITE_API_URL 设置为 https://dovelink.com/api 或 https://api.dovelink.com
   npm run build
   ```
2. 将生成的 `dist/` 放到 Nginx 根目录：
   ```bash
   sudo mkdir -p /var/www/dovelink
   sudo cp -r dist /var/www/dovelink/
   ```

## 5. 启用 HTTPS
使用 Certbot 一键申请证书：
```bash
sudo certbot --nginx -d dovelink.com -d www.dovelink.com
```
完成后 Nginx 会自动切换到 443 并配置自动续期。

## 6. 验证上线
- 浏览器访问 `https://dovelink.com`，确保前端能正常加载。 
- 前端请求 `/api/` 能正常返回（可在浏览器控制台或 `curl https://dovelink.com/api/` 验证）。
- 如遇跨域问题，确认 `.env` 中的 `DJANGO_ALLOWED_HOSTS/CORS/CSRF` 已包含部署域名。

完成以上步骤后，站点即可通过 `https://dovelink.com` 直接访问；若使用子域 `api.dovelink.com`，同时将其加入 DNS 与 Nginx 配置即可。
