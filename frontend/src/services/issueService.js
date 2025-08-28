import api from "../api";

export const issueService = {
  // 获取问题列表
  getIssues: async () => {
    const response = await api.get("/issues/");
    return response.data;
  },

  // 获取单个问题详情
  getIssueById: async (id) => {
    const response = await api.get(`/issues/${id}/`);
    return response.data;
  },

  // 创建新问题
  createIssue: async (issueData) => {
    const response = await api.post("/issues/", issueData);
    return response.data;
  },

  // 更新问题状态
  updateIssue: async (id, updateData) => {
    const response = await api.patch(`/issues/${id}/`, updateData);
    return response.data;
  },

  // 添加评论
  addComment: async (issueId, comment) => {
    const response = await api.post(`/issues/${issueId}/comments/`, {
      message: comment,
    });
    return response.data;
  },

  // 获取问题的评论列表
  getComments: async (issueId) => {
    const response = await api.get(`/issues/${issueId}/comments/`);
    return response.data;
  },
};
