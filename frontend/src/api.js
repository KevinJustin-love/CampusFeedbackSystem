import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
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
  createIssue: (data) => api.post("/feedback/issues/", data),
  getIssueDetail: (id) => api.get(`/feedback/issues/${id}/`),
  updateIssue: (id, data) => api.put(`/feedback/issues/${id}/`, data),
  deleteIssue: (id) => api.delete(`/feedback/issues/${id}/`),

  getTopicList: () => api.get("/feedback/topics/"),

  // 评论相关API
  createMessage: (issueId, data) =>
    api.post(`/feedback/issues/${issueId}/messages/`, data),
  getMessages: (issueId) => api.get(`/feedback/issues/${issueId}/messages/`),

  // 点赞相关API
  likeIssue: (issueId) => api.post(`/feedback/issues/${issueId}/like/`),
  checkLikeStatus: (issueId) =>
    api.get(`/feedback/issues/${issueId}/like-status/`),
  viewIssue: (issueId) => api.post(`/feedback/issues/${issueId}/view/`),

  // 删除权限相关API
  checkDeletePermission: (issueId) =>
    api.get(`/feedback/issues/${issueId}/delete-permission/`),
  deleteIssueById: (issueId) =>
    api.delete(`/feedback/issues/${issueId}/delete/`),

  // 确认结案相关API
  confirmResolved: (issueId, data) =>
    api.post(`/feedback/issues/${issueId}/confirm-resolved/`, data),
  checkConfirmPermission: (issueId) =>
    api.get(`/feedback/issues/${issueId}/confirm-permission/`),
  markUnresolved: (issueId, data) =>
    api.post(`/feedback/issues/${issueId}/mark-unresolved/`, data),

  // 管理员相关API
  getAdminIssues: () => api.get("/api/admin/issues/"),
  adminReplyIssue: (issueId, data) =>
    api.post(`/api/admin/issues/${issueId}/reply/`, data),
};

export const notificationAPI = {
  // 获取通知列表
  getNotifications: (isRead = null, adminFilter = false) => {
    const params = {};
    if (isRead !== null) {
      params.is_read = isRead;
    }
    if (adminFilter) {
      params.admin_filter = true;
    }
    return api.get("/feedback/notifications/", { params });
  },

  // 获取未读通知数量
  getUnreadCount: (adminFilter = false) => {
    const params = adminFilter ? { admin_filter: true } : {};
    return api.get("/feedback/notifications/unread-count/", { params });
  },

  // 标记指定通知为已读
  markAsRead: (notificationIds) =>
    api.post("/feedback/notifications/mark-read/", {
      notification_ids: notificationIds,
    }),

  // 标记所有通知为已读
  markAllAsRead: () => api.post("/feedback/notifications/mark-all-read/"),
};

export const historyAPI = {
  // 获取用户浏览历史记录
  getViewHistory: () => api.get("/feedback/view-history/"),

  // 记录用户浏览问题
  recordView: (issueId) => api.post(`/feedback/issues/${issueId}/record-view/`),

  // 清空浏览历史
  clearHistory: () => api.delete("/feedback/view-history/clear/"),
};

export const favoriteAPI = {
  // 获取用户收藏列表
  getFavorites: () => api.get("/feedback/favorites/"),

  // 切换收藏状态
  toggleFavorite: (issueId) =>
    api.post(`/feedback/issues/${issueId}/favorite/`),

  // 检查收藏状态
  checkFavoriteStatus: (issueId) =>
    api.get(`/feedback/issues/${issueId}/favorite-status/`),
};

export const chatAPI = {
  // 智能客服聊天接口
  chat: ({ message, history = [] }) =>
    api.post("/feedback/chat/", { message, history }),
};

export const classifyAPI = {
  // 智能分类接口
  classifyIssue: ({ title, description = "" }) =>
    api.post("/feedback/classify/", { title, description }),
};

export const authAPI = {
  register: (data) => api.post("/api/auth/register/", data),
};

export default api;
