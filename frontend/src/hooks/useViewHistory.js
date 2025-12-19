import { useState, useEffect, useCallback } from "react";
import { historyAPI } from "../api";

export const useViewHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 获取浏览历史
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await historyAPI.getViewHistory();
      setHistory(response.data);
    } catch (err) {
      console.error("获取浏览历史失败:", err);
      setError("获取浏览历史失败");
    } finally {
      setLoading(false);
    }
  }, []);

  // 记录浏览
  const recordView = useCallback(
    async (issueId) => {
      try {
        await historyAPI.recordView(issueId);
        // 记录成功后重新获取历史列表
        await fetchHistory();
      } catch (err) {
        console.error("记录浏览失败:", err);
        setError("记录浏览失败");
      }
    },
    [fetchHistory]
  );

  // 清空历史
  const clearHistory = useCallback(async () => {
    try {
      await historyAPI.clearHistory();
      setHistory([]);
    } catch (err) {
      console.error("清空历史失败:", err);
      setError("清空历史失败");
    }
  }, []);

  // 格式化时间显示
  const formatTime = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}分钟前`;
    } else if (diffInHours < 24) {
      return `${diffInHours}小时前`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}天前`;
    }
  }, []);

  // 获取状态显示文本
  const getStatusText = useCallback((status) => {
    const statusMap = {
      "已提交，等待审核": "待审核",
      处理中: "处理中",
      已处理: "已处理",
      已解决: "已解决",
      已关闭: "已关闭",
    };
    return statusMap[status] || status;
  }, []);

  // 获取状态样式类名
  const getStatusClass = useCallback((status) => {
    const statusClassMap = {
      "已提交，等待审核": "status-pending",
      处理中: "status-processing",
      已处理: "status-processed",
      已解决: "status-resolved",
      已关闭: "status-closed",
    };
    return statusClassMap[status] || "status-default";
  }, []);

  return {
    history,
    loading,
    error,
    fetchHistory,
    recordView,
    clearHistory,
    formatTime,
    getStatusText,
    getStatusClass,
  };
};
