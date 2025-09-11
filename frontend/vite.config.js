import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 配置代理
    proxy: {
      '/api': {
        // 这里是你的后端服务器地址
        target: 'http://127.0.0.1:8000', 
        changeOrigin: true,
        // 可选：如果你的后端路由不以 /api 开头，可以重写路径
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
});