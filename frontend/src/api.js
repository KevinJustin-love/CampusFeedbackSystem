import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// 使用一个自执行的异步函数来设置拦截器
(async () => {
  try {
      const response = await api.get('/auth/csrf/');
      const csrfToken = response.data.csrfToken;
      // 如果成功获取到 CSRF Token，将其添加到默认请求头
      api.defaults.headers.common['X-CSRFToken'] = csrfToken;
  } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
  }
})();

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const feedbackAPI = {
  // getIssueList: () => api.get("/feedback/issues/"),
  getIssueList: (config = {}) => api.get("/feedback/issues/", config),
  createIssue: (data) => api.post("/feedback/issues/",data),
  getIssueDetail: (id) => api.get(`/feedback/issues/${id}/`),
  updateIssue: (id, data) => api.put(`/feedback/issues/${id}/`, data),
  deleteIssue: (id) => api.delete(`/feedback/issues/${id}/`),

  getTopicList: () => api.get("/feedback/topics/"),
};

export const authAPI = {
  register: (data) => api.post("/api/auth/register/", data),
};

export default api;
