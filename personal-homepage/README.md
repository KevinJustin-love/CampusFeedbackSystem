# 个人主页（GitHub Pages）

这个目录包含了可直接部署到 GitHub Pages 的静态个人主页。你可以把仓库推送到 GitHub 后，在 Settings → Pages 中选择「GitHub Actions」进行发布。

## 使用步骤
1. 修改 `index.html` 文案（名字、项目链接等）以及 `assets/css/style.css` 配色或样式。
2. （可选）把头像、项目截图等静态资源放到 `assets/` 下并在页面中引用。
3. 将仓库推送到 GitHub，进入 Settings → Pages，选择「Build and deployment」为 *GitHub Actions*。
4. 确认 `.github/workflows/pages.yml` 工作流存在；首次 push 后会自动构建并发布到 GitHub Pages。

## 本地预览
直接在浏览器打开 `personal-homepage/index.html` 即可，无需额外构建步骤。
