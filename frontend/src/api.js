import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || ''
});

// CSRF token is not needed for JWT authentication, commenting out
// (async () => {
//   try {
//       const response = await api.get('/auth/csrf/');
//       const csrfToken = response.data.csrfToken;
//       // 如果成功获取到 CSRF Token，将其添加到默认请求头
//       api.defaults.headers.common['X-CSRFToken'] = csrfToken;
//   } catch (error) {
//       console.error("Failed to fetch CSRF token:", error);
//   }
// })();

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
  
  // 评论相关API
  createMessage: (issueId, data) => api.post(`/feedback/issues/${issueId}/messages/`, data),
  getMessages: (issueId) => api.get(`/feedback/issues/${issueId}/messages/`),
  
  // 点赞相关API
  likeIssue: (issueId) => api.post(`/feedback/issues/${issueId}/like/`),
  checkLikeStatus: (issueId) => api.get(`/feedback/issues/${issueId}/like-status/`),
  viewIssue: (issueId) => api.post(`/feedback/issues/${issueId}/view/`),
  
  // 删除权限相关API
  checkDeletePermission: (issueId) => api.get(`/feedback/issues/${issueId}/delete-permission/`),
  deleteIssueById: (issueId) => api.delete(`/feedback/issues/${issueId}/delete/`),
  
  // 管理员相关API
  getAdminIssues: () => api.get('/api/admin/issues/'),
  adminReplyIssue: (issueId, data) => api.post(`/api/admin/issues/${issueId}/reply/`, data),
};

export const authAPI = {
  register: (data) => api.post("/api/auth/register/", data),
};

export default api;
