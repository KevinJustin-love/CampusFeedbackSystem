import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 配置代理
    proxy: {
      '/feedback': {
        target: 'http://localhost:8000', // 你的 Django 后端地址
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        // 这里是你的后端服务器地址
        target: 'http://127.0.0.1:8000', 
        changeOrigin: true,
      },
    },
  },
});