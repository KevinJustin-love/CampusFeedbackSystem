import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

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
  getIssueList: () => api.get("/feedback/issues/"),
  createIssue: (data) => api.post("/feedback/issues/",data),
  getIssueDetail: (id) => api.get(`/feedback/issues/${id}/`),
  updateIssue: (id, data) => api.put(`/feedback/issues/${id}/`, data),
  deleteIssue: (id) => api.delete(`/feedback/issues/${id}/`),
};

export const authAPI = {
  register: (data) => api.post("/api/auth/register/", data),
  // Add other auth methods here (e.g., login, etc.)
};

export default api;
